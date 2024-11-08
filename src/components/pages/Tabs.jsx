import { useEffect, useState } from "react";
import Tran from "../../libs/translater";
import { MainProxy } from "../Mother";
import { proxy, useSnapshot } from "valtio";
import { captureVisibleTab, getAllTabs, getActiveTab, goSpecificTab, openInNewTabNextTo, resizeImage } from "../../libs/chrome_funcs";
import MomSaidTheVirtualListAtHome from "../reuse/MomSaidTheVirtualListAtHome";


function Tabs() {
  const { tabs } = useSnapshot(MainProxy);
  useEffect(() => {
    console.log('Tabs useEffect');
    getAllTabs().then((tabs) => {
      console.log(tabs);
      //put in different window
      MainProxy.tabs = tabs
    });
  }, []);
  return (
    <div className="flex-grow bg-[--ws-bg] text-[--ws-text] p-[10px] rounded-[10px] flex flex-col gap-[10px] min-h-0 ">
      {/* <div className="text-[14px] flex gap-[5px] items-center">
        <Tran text={{ "en": "Tabs", "zh-TW": "分頁" }} /> 
        <span className="text-[12px] bg-[--ws-bg_hover] p-[2px_8px] rounded-[7px]">{tabs.length}</span>
      </div> */}
      <div className={`grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[2px] overflow-y-auto
      [&>*]:flex [&>*]:items-center [&>*]:gap-[10px] [&>*]:p-[5px_10px] [&>*]:rounded-[5px] [&>*]:bg-[--ws-bg_hover] [&>*]:text-[--ws-text] [&>*]:text-[12px]
      `} >
        {tabs.map((tab) => {
          return (
            <MomSaidTheVirtualListAtHome key={tab.id} inVisibleHeight="42.5px"
            // className="flex items-center gap-[10px] p-[5px_10px] rounded-[5px] bg-[--ws-bg_hover] text-[--ws-text] text-[12px]"
            >
              <div className="w-[18px] h-[18px] rounded-[5px] overflow-hidden">
                {tab.favIconUrl ?
                  <img src={tab.favIconUrl} alt={tab.title} loading="lazy" />
                  :
                  <div className="text-[15px] go">
                    public
                  </div>
                }
              </div>
              <div className="flex-grow w-[50px] ellipsis line-clamp-1" title={tab.title}>
                {tab.title}
              </div>
              <div className="flex gap-[5px]">
                <button onClick={() => goSpecificTab(tab.id)} className=" aspect-square p-[5px] rounded-[5px] cursor-pointer">
                  <div className="text-[15px] go">
                    open_in_new
                  </div>
                </button>
                <button onClick={async() => {
                  await goSpecificTab(tab.id);
                  const img = await captureVisibleTab(tab.windowId);
                  const thumbnail = await resizeImage(img, 0.4);
                  //open data url in new tab
                  openInNewTabNextTo(img)
                  // openInNewTabNextTo(thumbnail)
                  
                  
                }} className=" aspect-square p-[5px] rounded-[5px] cursor-pointer">
                  <div className="text-[15px] go">
                    save_alt
                  </div>
                </button>
              </div>
            </MomSaidTheVirtualListAtHome>
          );
        }
        )}
      </div>
    </div>
  );
}

export default Tabs;