import React from "react";
import { Size } from "../components/Size";
import { Coins } from "../components/Coins";
import { determineCategory } from "../utils/determineCategory";
import { TaskProps } from "../types/types";
import moment from "moment";
import { formatTime } from "../utils/formatTime";
import { updateTask } from "../api/api";


export function CompletedTask(props: TaskProps) {
  const { taskType = "personal" } = props;
  const formattedCategory = determineCategory(props.categoryName)
  const daysPassed = moment(props.dateOfComplete).fromNow()
  const timePassed = props.timeForComplete ? formatTime(props.timeForComplete) : 0

  if(props.deletedAt != 0) return <></>

  return (
    <div className="relative container-grid mb-4 bg-gray-100 rounded-lg" key={`${props.dateOfComplete}_${props.deadline}`}>
      <div>
        <div className="grid grid-cols-2">
          {props.dateOfComplete && <div>Вполнено: <br /><b>{daysPassed}</b></div>}
          {props.sizeName && <Size size={props.sizeName} />}
          {props.timeForComplete && <div className="mt-3">Время: <br /><b>{timePassed}</b></div>}
        </div>
        <div className="font-medium mt-4" style={{ color: formattedCategory?.color }}>{formattedCategory?.text}</div>
      </div>
      <div className="flex flex-col border-l-4 border-[#0066FF]">
        <h3 className="font-medium text-xl mb-4">{props.taskName}</h3>
        <p>{props.taskDescr}</p>
      </div>
      <div className="flex flex-col !items-end !justify-between gap-4">
        <div className="w-full translate-x-4 flex justify-between items-center border border-gray-600 rounded-full pl-10 pr-4 py-3">
          Получил
          <Coins {...props} />
        </div>
        <div className="flex justify-between w-[290px]">
        <button 
            className="ml-12 text-red-400 z-10"
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
              deletedAt: moment().valueOf(),
            })}
            >
              Удалить
            </button>
          <div className="">{taskType}</div>
       </div>
      </div>
      <div className="absolute w-full h-full rounded-lg bg-white opacity-50"></div>
    </div>
  )
};