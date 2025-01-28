import React, { useEffect } from "react";
import { Size } from "../components/Size";
import { Coins } from "../components/Coins";
import { determineCategory } from "../utils/determineCategory";
import { TaskProps } from "../types/types";
import 'moment/locale/ru';
import moment from "moment";
import { updateTask } from "../api/api";
import { Button } from "../components/Button";

export function UpcomingTask(props: TaskProps) {
  const { taskType = "personal" } = props;
  const formattedCategory = determineCategory(props.categoryName)
  const timeLeft = props.deadline && props.deadlineTimeMS && moment(props.deadline + props.deadlineTimeMS).fromNow()
  const now = moment().valueOf();
  const timeForComplete = now - props.createdAt;

  useEffect(() => {
    // const interval = setInterval(() => {
    //   if (props.deadline && props.deadlineTimeMS && now - props.deadline - props.deadlineTimeMS > 0) {
    //     console.log('Ждём пока у кого-нибудь истечёт дедлайн');

    //     if (props.expiredAt == 0) {
    //       const propsClone = structuredClone(props);
    //       propsClone.expiredAt = moment().valueOf();
    //       propsClone.coinsNotEarnedAmount = propsClone.coinsAmount
    //       propsClone.coinsAmount = Math.floor(propsClone.coinsAmount * 2 / 3)
    //       propsClone.coinColor = "red"
    //       updateTask(props.id, propsClone);

    //       console.log("Просрочено: ", props.taskName);
    //       console.log(props);
    //     }
    //   }
    // }, 5000);

    const interval = setInterval(() => {
      if (props.deadline && props.deadlineTimeMS && now - props.deadline - props.deadlineTimeMS > 0) {
        updateTask(props.id, {
          taskStatus: "upcoming",
          sizeName: props.sizeName,
          taskType: props.taskType,
          categoryName: props.categoryName,
          taskName: props.taskName,
          createdAt: props.createdAt,
          coinsAmount:  Math.floor(props.coinsAmount * 2 / 3),
          coinsNotEarnedAmount: props.coinsAmount,
          changetAt: moment().valueOf(),
          expiredAt: moment().valueOf(),
          coinColor: "red",
          timeForComplete: timeForComplete,
        });
      }
    }, 5000)

    return () => {
      clearInterval(interval);
    }
  }, [])

  if (props.deletedAt != 0) return <></>

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
          <Coins {...props} />
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