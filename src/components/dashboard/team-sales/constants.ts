export type TimePeriod = "now" | "7days" | "30days" | "year";

export const PERIOD_LABELS: Record<TimePeriod, string> = {
  now: "Now",
  "7days": "Last 7 Days",
  "30days": "Last 30 Days",
  year: "Last Year",
};

export const PERIODS: TimePeriod[] = ["now", "7days", "30days", "year"];
