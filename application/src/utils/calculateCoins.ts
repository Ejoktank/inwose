import { SizeType, TaskCategory } from "../types/types"

export function determineCoinsAmount(size: SizeType, category: TaskCategory) {
  let categoryCost = 0;
  let sizeCost = 0;

  if (category === "qualification") {
    categoryCost = 5
  } else { categoryCost = 3 }

  if (size === "lg") {
    sizeCost = 4
  } else if (size === "md") {
    sizeCost = 3
  } else { sizeCost = 2 }

  return categoryCost * sizeCost
}