import { TaskCategory } from "../types/types"

export function determineCategory(categoryName: TaskCategory) {
  switch (categoryName) {
    case "qualification":
      return { text: "Повышение квалификации", color: "#0066ff" }
    case "outlook":
      return { text: "Расширение кругозора", color: "#08b908" }
  }
}