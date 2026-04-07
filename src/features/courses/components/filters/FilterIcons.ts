import {
  Cpu,
  Handshake,
  Calculator,
  Flag,
  Smile,
  Monitor,
  PenTool,
  Megaphone,
  Box,
  Camera,
  Headphones,
  BriefcaseMedical,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Development: Cpu,
  Business: Handshake,
  "Finance & Accounting": Calculator,
  "IT & Software": Flag,
  "Office Productivity": Smile,
  "Personal Development": Monitor,
  Design: PenTool,
  Marketing: Megaphone,
  Lifestyle: Box,
  "Photography & Video": Camera,
  Music: Headphones,
  "Health & Fitness": BriefcaseMedical,
};
