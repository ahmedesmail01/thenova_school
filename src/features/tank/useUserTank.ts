import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import toast from "react-hot-toast";

export interface TankMember {
  id: number;
  member_id: number;
  sponsor_id: number;
  created_at: string;
  updated_at: string;
  member_username: string;
  member_firstname: string;
  member_lastname: string;
  member_package: string | null;
  member_id_code: string;
  member_package_cv: number;
}

export interface TankPaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface TankPaginationData {
  current_page: number;
  data: TankMember[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: TankPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface TankResponse {
  status: boolean;
  message: string;
  tank: TankPaginationData;
}

export const useUserTank = (page: number = 1, perPage: number = 5) => {
  return useQuery<TankResponse>({
    queryKey: ["userTank", page, perPage],
    queryFn: async () => {
      const response = await api.get("/user-tank", {
        params: {
          page,
          per_page: perPage,
        },
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

export const usePlaceMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      referralId,
      placement,
    }: {
      referralId: number;
      placement: "left" | "right";
    }) => {
      const response = await api.post("/place-referral", {
        referral_id: referralId,
        placement,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("User successfully placed!");
      queryClient.invalidateQueries({ queryKey: ["userTank"] });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(axiosError.response?.data?.message || "Failed to place user");
    },
  });
};
