import React from "react";
import { CoinsProps, TaskProps } from "../types/types";

export function Coins(props: TaskProps | CoinsProps) {
  const coinsAmount = props.coinsAmount ? props.coinsAmount : 0
  const coinsNotEarnedAmount = props.coinsNotEarnedAmount ? props.coinsNotEarnedAmount : 0
  const coinColor = props.coinColor ? props.coinColor : ''
  const coinsHasPlus = props.coinsHasPlus ? props.coinsHasPlus : ''
  const coinsHasBg = props.coinsHasBg ? props.coinsHasBg : ''

  return (
    <div className={`flex flex-row items-center justify-center gap-1 font-semibold ${coinsHasBg ? "px-8 py-2 rounded-full bg-gray-100" : "bg-transparent"}`}>
      {coinsNotEarnedAmount != 0 && <span className="opacity-30 line-through">+{coinsNotEarnedAmount}</span>}
      <span>{coinsHasPlus && "+"}{coinsAmount}</span>
      {
        coinColor === "green"
          ? <div className="w-6 h-6 bg-[url(/coinGreen.png)] bg-center bg-no-repeat"></div>
          : <div className="w-6 h-6 bg-[url(/coinRed.png)] bg-center bg-no-repeat"></div>
      }
    </div>
  )
};

