import { useEffect, useState } from "react";
import Tran from "../../libs/translater";
import { MainProxy } from "../Mother";

function History() {
  return (
    <div className="flex-grow bg-[--ws-bg] text-[--ws-text] p-[10px] rounded-[10px] flex flex-col overflow-auto">
      <div className="text-[14px]">
        <Tran text={{ "en": "History", "zh-TW": "歷史" }} />
      </div>
      <div className=" ">

      </div>
    </div>
  );
}

export default History;