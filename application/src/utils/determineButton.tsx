import React from "react";
import { TaskType } from "../types/types";
import { Button } from "../components/Button";

export function determineButton(type: TaskType) {
  switch (type) {
    case "personal":
      return <Button type={"transparent"} />

    case "pari":
      return (
        <div className="flex flex-col gap-2">
          <Button type={"blue"} />
          <Button type={"gray"} />
        </div>
      )

    case "team":
      return <Button type={"transparent"} />

    default:
      break;
  }
}