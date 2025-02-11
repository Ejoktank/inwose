export type TaskType = "personal" | "pari" | "team"
export type TaskCategory = "qualification" | "outlook"
export type TaskStatus = "completed" | "upcoming"
export type SizeType = "sm" | "md" | "lg";

export type CoinColors = "green" | "red"

export interface CoinsProps {
  hasPlus?: boolean;
  hasBg?: boolean;
  coinsAmount: number;
  coinsNotEarnedAmount?: number;
  coinColor?: CoinColors;
}
