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

export interface TaskProps {
  id?: number;
  sizeName: SizeType;
  taskType: TaskType;
  categoryName: TaskCategory;
  taskName: string;
  taskDescr?: string;
  taskStatus: TaskStatus;

  createdAt: number;
  changetAt?: number;
  deletedAt?: number;
  expiredAt?: number;

  deadline?: number;
  deadlineTime?: string;
  deadlineTimeMS?: number;
  dateOfComplete?: number;
  timeForComplete?: number;

  //bool
  coinsHasPlus?: number; 
  //bool
  coinsHasBg?: number;
  coinsAmount: number;
  coinsNotEarnedAmount?: number;
  coinColor?: CoinColors;
}