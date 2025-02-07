import { useContext, useEffect, useState } from "react";
import Tran from "../../libs/translater";
import { MainContext } from "../Mother";
import { proxy, useSnapshot } from "valtio";
import { captureVisibleTab, getAllTabs, getActiveTab, goSpecificTab, openInNewTabNextTo, resizeImage } from "../../libs/chrome_funcs";
import MomSaidTheVirtualListAtHome from "../reuse/MomSaidTheVirtualListAtHome";


function Tabs() {
  // const { tabs } = useSnapshot(MainProxy);
  const { tabs } = useContext(MainContext)
  useEffect(() => {
    console.log('Tabs useEffect');
    getAllTabs().then((_tabs) => {
      tabs[1](_tabs);
    });
  }, []);
  return (
    <div className="flex-grow bg-[--ws-bg] text-[--ws-text] p-[10px] rounded-[10px] flex flex-col gap-[10px] min-h-0 ">
      <div className={`flex flex-col gap-[2px] overflow-y-auto relative`} >

        {tabs[0].reduce((acc, tab) => {
          if (acc.length === 0) {
            acc.push([tab]);
          } else {
            if (acc[acc.length - 1][0].windowId === tab.windowId) {
              acc[acc.length - 1].push(tab);
            } else {
              acc.push([tab]);
            }
          }
          return acc;
        }, []).map((windowTabs, index) => {
          return (
            <WindowGroup key={windowTabs[0].windowId} windowTabs={windowTabs} index={index} />
          )
        })}

      </div>
    </div>
  );
}

function WindowGroup({ windowTabs, index }) {
  const tabOpen = useState(true);

  return (
    <>
      <div className="text-[14px] flex gap-[5px] items-center !bg-[--ws-text] !text-[--ws-bg] p-[5px_10px] rounded-[5px] sticky top-0 left-0" onClick={() => { tabOpen[1](prev => !prev) }}>
        <Tran text={{ "en": "Window", "zh-TW": "視窗" }} />
        <span className="text-[12px] bg-[--ws-text] text-[--ws-bg] p-[2px_8px] rounded-[7px]">{index + 1}</span>
        <span className="text-[12px] bg-[--ws-bg] text-[--ws-text] p-[2px_8px] rounded-[7px]">{windowTabs.length}</span>
        <div className="flex-grow"></div>
        <span className="text-[12px] bg-[--ws-text] text-[--ws-bg] p-[2px_8px] rounded-[7px] go">
          {tabOpen[0] ? "expand_less" : "expand_more"}
        </span>
      </div>
      <div className={`grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[2px]
                [&>*]:flex [&>*]:items-center [&>*]:gap-[10px] [&>*]:p-[5px_10px] [&>*]:rounded-[5px] [&>*]:bg-[--ws-bg_hover] [&>*]:text-[--ws-text] [&>*]:text-[12px]
                `} >
        {tabOpen[0] && windowTabs.map((tab, i) => {
          if (i === 0) {
            console.log('tab', tab);
          }
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
                <button onClick={async () => {
                  await goSpecificTab(tab.id);
                  const { fullsize, thumbnail } = await captureVisibleTab(tab.windowId);
                  //open data url in new tab
                  openInNewTabNextTo(fullsize)
                  openInNewTabNextTo(thumbnail)


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
    </>
  )

}

export default Tabs;