import React from "react";
import { Size } from "../components/Size";
import { calculateCoins } from "../utils/calculateCoins";
import { Coins } from "../components/Coins";
import { determineCategory } from "../utils/determineCategory";
import { TaskProps } from "../types/types";
import 'moment/locale/ru';
import moment from "moment";
import { updateTask } from "../api/api";
import { Button } from "../components/Button";
import { formatTime } from "../utils/formatTime";

export function UpcomingTask(props: TaskProps) {
  const { taskType = "personal" } = props;
  const formattedCategory = determineCategory(props.categoryName)
  const timeLeft = props.deadline && props.deadlineTimeMS && moment(props.deadline + props.deadlineTimeMS).fromNow()
  const now = moment().valueOf();
  // const timeLeft = formatTime(props.deadline - now)
  const timeForComplete = now - props.createdAt;

  if(props.deletedAt != 0) return <></>

  return (
    <div className="container-grid mb-4 bg-gray-100 rounded-lg">
      <div>
        <div className="grid grid-cols-2">
          {props.deadline && <div>Дедлайн: <br /><b>{timeLeft}</b></div>}
          {props.sizeName && <Size size={props.sizeName} />}
        </div>
        <div className="font-medium mt-4" style={{ color: formattedCategory?.color }}>{formattedCategory?.text}</div>
      </div>
      <div className="flex flex-col border-l-4 border-[#0066FF]">
        <h3 className="font-medium text-xl mb-4">{props.taskName}</h3>
        <p>{props.taskDescr}</p>
      </div>
      <div className="flex flex-col !items-end !justify-between gap-4">
        <div className="flex justify-between items-center w-[290px]">
          <Button type={"transparent"} onClick={() => updateTask(props.id, {
            taskStatus: "completed",
            sizeName: props.sizeName,
            taskType: props.taskType,
            categoryName: props.categoryName,
            taskName: props.taskName,
            createdAt: props.createdAt,
            coinsAmount: props.coinsAmount,
            changetAt: moment().valueOf(),
            dateOfComplete: moment().valueOf(),
            timeForComplete: timeForComplete,
          })} />
          <Coins coins={calculateCoins(props.sizeName, props.categoryName)} />
        </div>
       <div className="flex justify-between w-[290px]">
          <button 
            className="ml-12 text-red-400"
            onClick={() => updateTask(props.id, {
              taskStatus: "completed",
              sizeName: props.sizeName,
              taskType: props.taskType,
              categoryName: props.categoryName,
              taskName: props.taskName,
              createdAt: props.createdAt,
              coinsAmount: props.coinsAmount,
              changetAt: moment().valueOf(),
              dateOfComplete: moment().valueOf(),
              timeForComplete: timeForComplete,
              deletedAt: moment().valueOf(),
            })}
            >
              Удалить
            </button>
          <div className="">{taskType}</div>
       </div>
      </div>
    </div>
  )
};