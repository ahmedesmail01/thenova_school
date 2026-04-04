import { type DownlineMember } from "../../features/auth/useUserData";

export interface NodeProps {
  userId: number | string;
  idCode: number | string;
  fullName: string;
  userImage?: string | null;
  rankName?: string | null;
  subscriptionName?: string | null;
  color: "red" | "blue" | "teal";
  isRoot?: boolean;
  rank?: string;
  userPackage?: string;
  rankIcon?: string | null;
}

export interface ColorScheme {
  bg: string;
  border: string;
  avatarRing: string;
  shape1: string;
  shape2: string;
}

export const COLOR_SCHEMES: Record<"red" | "blue" | "teal", ColorScheme> = {
  red: {
    bg: "from-[#ec4899] to-[#ef4444]",
    border: "border-red-400",
    avatarRing: "border-red-500/30",
    shape1: "bg-red-800/10",
    shape2: "bg-white/10",
  },
  blue: {
    bg: "from-[#3b82f6] to-[#1e3a8a]",
    border: "border-blue-400",
    avatarRing: "border-blue-500/30",
    shape1: "bg-blue-800/20",
    shape2: "bg-white/10",
  },
  teal: {
    bg: "from-[#14b8a6] to-[#047857]",
    border: "border-teal-400",
    avatarRing: "border-teal-500/30",
    shape1: "bg-teal-800/20",
    shape2: "bg-white/10",
  },
};

export const getLeg = (leg: unknown): DownlineMember | null => {
  if (!leg || typeof leg !== "object") return null;
  const typedLeg = leg as DownlineMember;
  const uid = typedLeg.user_id || typedLeg.id;
  if (!uid) return null;
  return typedLeg;
};
