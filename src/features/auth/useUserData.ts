import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

export interface PackageFeatures {
  "Loyalty program": boolean;
  "Trade alert": boolean;
  "Beginner course": boolean;
  "Basics course": boolean;
  "Live trading": boolean;
  "Live sessions": boolean;
  "Advance course": boolean;
  "Expert course": boolean;
  "Expert plus course": boolean;
  "One Scanners": boolean;
  "Affiliate program": boolean;
}

export interface Package {
  id: number;
  name: string;
  price: string;
  billing_period: string;
  cv: number;
  features: PackageFeatures;
  pack_card: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  member_id: number;
  package_id: number;
  subscribed_at: string;
  created_at: string;
  updated_at: string;
  expiration_date: string;
  package: Package;
}

export interface Member {
  id: number;
  user_id: number;
  sponsor_id: number | null;
  left_leg_id: number | null;
  right_leg_id: number | null;
  current_cv: number;
  totla_left_volume: number;
  totla_right_volume: number;
  total_commision: string;
  is_first: string;
  created_at: string;
  updated_at: string;
  rank_id: number;
  sponsor: any | null;
  subscription: Subscription;
}

export interface UserData {
  id: number;
  id_code: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  phone: string | null;
  country: string | null;
  status: string;
  image: string;
  member: Member;
}

export interface Profile {
  user_first_name: string;
  user_last_name: string;
  sponsor_name: string | null;
  sponsor_id_code: unknown | null;
  subscription: string;
  id_code: number;
  current_cv: number;
  total_left_leg_cv: number;
  total_right_leg_cv: number;
  status: string;
  phone: string | null;
}

export interface UserDataResponse {
  status: boolean;
  message: string;
  "user data": UserData;
  subscription: string;
  sponsor: any | null;
  profile: Profile;
}

/**
 * Custom hook to fetch current user data using React Query
 */
export const useUserData = () => {
  return useQuery<UserDataResponse>({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await api.get("/user/data");
      return response.data;
    },
    // Cache for 5 minutes, consider it stale after 1 minute
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};

// -- STRICT TYPES FOR USER BY ID FETCH -- //
export interface MemberSponsorUser {
  id: number;
  id_code: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  phone: string | null;
  status: string;
  image: string;
}

export interface MemberSponsor {
  id: number;
  user_id: number;
  sponsor_id: number | null;
  left_leg_id: number | null;
  right_leg_id: number | null;
  current_cv: number;
  totla_left_volume: number;
  totla_right_volume: number;
  total_commision: string;
  is_first: string;
  created_at: string;
  updated_at: string;
  rank_id: number | null;
  user?: MemberSponsorUser;
}

export interface StrictMember {
  id: number;
  user_id: number;
  sponsor_id: number | null;
  left_leg_id: number | null;
  right_leg_id: number | null;
  current_cv: number;
  totla_left_volume: number;
  totla_right_volume: number;
  total_commision: string;
  is_first: string;
  created_at: string;
  updated_at: string;
  rank_id: number | null;
  sponsor?: MemberSponsor;
}

export interface StrictUserData {
  id: number;
  id_code: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  phone: string | null;
  status: string;
  image: string;
  member: StrictMember;
}

export interface UserByIdResponse {
  status: boolean;
  message: string;
  user: StrictUserData;
}

/**
 * Custom hook to strictly fetch a specific user's data by ID / ID Code
 */
export const useUserByIdData = (userId: string | number | null | undefined) => {
  return useQuery<UserByIdResponse>({
    queryKey: ["userByIdData", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const response = await api.get(`/user/data/${userId}`);
      if (response.data.status === false) {
        throw new Error(response.data.message || "User not found");
      }
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60,
  });
};

/**
 * Custom hook to fetch direct downline members
 */
export interface DownlineMember {
  id: number;
  rank_id: number | null;
  rank_name: string | null;
  user_name: string;
  user_id_code: number;
  user_first_name: string;
  user_last_name: string;
  user_image: string | null;
  // keep old type properties optional to not break existing usage
  user_id?: number;
  id_code?: number;
  full_name?: string;
  subscription?: { name: string } | string | null;
}

export interface DownlineResponse {
  status: boolean;
  message?: string;
  members: {
    left_leg_member: DownlineMember | null;
    right_leg_member: DownlineMember | null;
    user?: StrictUserData;
  };
}

export const useDownline = (userId?: number | string) => {
  return useQuery<DownlineResponse>({
    queryKey: ["downline", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const response = await api.get(`/get-direct-downline-members/${userId}`);

      if (response.data.status === false) {
        return {
          status: false,
          message: response.data.message,
          members: {
            left_leg_member: null,
            right_leg_member: null,
          },
        };
      }

      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};
