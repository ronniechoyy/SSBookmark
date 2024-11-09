import { createContext, useContext, useEffect, useState } from "react";
import usePageTheme, { pageThemeStyle } from "../libs/pageTheme";
import Tran, { LangContext } from "../libs/translater";
import JSONRender from "./reuse/JSONRender";
import JSONBuilder from "./reuse/JSONBuilder";
import Popup from "./reuse/Popup";
import DataTableBase from "./reuse/DataTableBase";
import { externalDataHandler, getActiveTab, openInNewPopup, openInNewTabNextTo } from "../libs/chrome_funcs";
import { proxy, useSnapshot } from "valtio";
import Tabs from "./pages/Tabs";
import Bookmarks from "./pages/Bookmarks";
import Settings from "./pages/Settings";
import History from "./pages/History";
import { AnimatePresence, motion } from "framer-motion";

/**@type {React.Context<ReturnType<typeof usePage>>}*/
export const MainContext = createContext(null);
// export const MainProxy = proxy({
//   page:'bookmark',
//   tabs: [],
//   bookmarks: [],
//   // /書籤列/Folder1/MYBookmark/DAY1 = [folderid, folderid, folderid, folderid]
//   bookmarkNavPath: ["0"],
// })

export function usePage(){
  const TABS = [
    { name: { "en": "Tab", "zh-TW": "分頁" }, icon: "tab", value: 'tabs' },
    { name: { "en": "Bookmark", "zh-TW": "書籤" }, icon: "bookmark", value: 'bookmark' },
    { name: { "en": "History", "zh-TW": "歷史" }, icon: "history", value: 'history' },
    // { name: { "en": "Setting", "zh-TW": "設定" }, icon: "settings", value: 'setting' },
  ]
  const themeState = usePageTheme({ prefix: "ws", themeStyle: pageThemeStyle })
  const state = {
    langState: useState("en"),
    page: useState('bookmark'),
    tabs: useState([]),
    bookmarks: useState([]),
    bookmarkNavPath: useState(["0"]),
  }

  useEffect(() => {
    externalDataHandler.initExtensionStorage();
    if (!localStorage.getItem('lang')) {
      localStorage.setItem('lang', 'zh-TW')
      state.langState[1]('zh-TW')
    } else {
      state.langState[1](localStorage.getItem('lang'))
    }
  }, [])

  return { TABS, themeState, pageThemeStyle, ...state }
}

const F = {}

const C = {
  Header(){
    const Child = C.HeaderChild;
    return(
      <div className="text-[15px] p-[5px]">
        <div className="flex items-center gap-[5px]">
          <div className="flex items-center gap-[5px]">
            <img className="bg-[#555] aspect-square h-[25px] rounded-[5px] object-fill" src="https://pbs.twimg.com/media/GYuT1QmbYAANz7a?format=jpg&name=4096x4096" alt="" />
            <div className="text-[18px] font-[700]">
              <Tran text={{ "en": "SSBookMark", "zh-TW": "截圖書籤" }} />
            </div>
            <div className="text-[10px] text-[--ws-bg] bg-[--ws-text] p-[0px_3px] rounded-[5px] font-[700]">
              RONI STU.
            </div>

          </div>
          <div className="flex-grow">
            <C.MainSectionChild.SideBar />
          </div>
          <div className="flex items-center gap-[5px]">
            <Child.Setting />
            <Child.OpenInNewPopup />
            <Child.OpenInNewTabNextTo />
            <Child.LangSwitch />
            <Child.ThemeSwitch />
          </div>
          
        </div>
      </div>
    )
  },
  HeaderChild:{
    OpenInNewPopup() {
      
      return (
        <div onClick={openInNewPopup} className="bg-[--ws-bg] text-[--ws-text] p-[5px] rounded-[5px] cursor-pointer">
          <div className="text-[15px] go">
            open_in_new_down
            
          </div>
        </div>
      )
    },
    OpenInNewTabNextTo() {
        
        return (
          <div onClick={() => { openInNewTabNextTo() }} className="bg-[--ws-bg] text-[--ws-text] p-[5px] rounded-[5px] cursor-pointer">
            <div className="text-[15px] go">
              open_in_new
            </div>
          </div>
        )
    },
    ThemeSwitch(){
      const { themeState, pageThemeStyle } = useContext(MainContext);

      function LoopTheme(){
        const theme = themeState[0];
        const themeIndex = Object.keys(pageThemeStyle).indexOf(theme);
        const nextThemeIndex = themeIndex + 1;
        const nextTheme = Object.keys(pageThemeStyle)[nextThemeIndex] || Object.keys(pageThemeStyle)[0];
        themeState[1](nextTheme);
      }

      return (
        <div onClick={LoopTheme} className="bg-[--ws-bg] text-[--ws-text] p-[5px] rounded-[5px] cursor-pointer">
          <div className="text-[20px] go">
            {/* {themeState[0]} */}
            contrast
          </div>
        </div>

      )
    },
    LangSwitch(){
      const { langState } = useContext(MainContext);

      function LoopLang(){
        const lang = langState[0];
        const langIndex = ['en', 'zh-TW'].indexOf(lang);
        const nextLangIndex = langIndex + 1;
        const nextLang = ['en', 'zh-TW'][nextLangIndex] || 'en';
        langState[1](nextLang);
      }
      
      return (
        <div onClick={LoopLang} className="bg-[--ws-bg] text-[--ws-text] p-[5px] rounded-[5px] cursor-pointer">
          <div className="text-[15px]">
            <Tran text={{ "en": "EN", "zh-TW": "繁" }} />
          </div>
        </div>
      )
    },
    Setting(){
      const { page } = useContext(MainContext);
      return (
        <div className="bg-[--ws-bg] text-[--ws-text] p-[5px] rounded-[5px] cursor-pointer" onClick={() => {
          page[1]('setting')
        }}>
          <div className="text-[15px] go">
            settings
          </div>
        </div>
      )
    }
  },
  MainSection(){
    return(
      <div className="p-[1px] flex-grow flex flex-col gap-[1px] bg-[--ws-bg-d] min-h-0">
        {/* <C.MainSectionChild.SideBar /> */}
        <C.MainSectionChild.MainContent />
      </div>
    )
  },
  MainSectionChild:{
    SideBar() {
      const { TABS, page, tabs, bookmarks } = useContext(MainContext);
      
      /**w-[120px] */ 
      return (
        
        <div className=" bg-[--ws-bg] text-[--ws-text] p-[5px] rounded-[10px] flex ">
          <div className="p-[2px] rounded-[10px] flex gap-[2px] w-full">
            {TABS.map((sideBarTab, index) => {
              const { name, icon, value } = sideBarTab;
              return (
                <div 
                  key={index} 
                  className="text-[12px] w-full rounded-[10px] p-[5px] flex gap-[5px] justify-center items-center hover:bg-[--ws-bg_hover] cursor-pointer" 
                  style={{ backgroundColor: page[0] === value ? 'var(--ws-bg_hover)' : 'transparent' }}
                  onClick={() => { page[1](value) }}
                >
                  <span className="go">{icon}</span>
                  <Tran text={name} />
                  {value === 'tabs' && <span className="text-[12px] bg-[--ws-bg_hover] p-[2px_8px] rounded-[7px]">{tabs[0].length}</span>}
                  {value === 'bookmark' && <span className="text-[12px] bg-[--ws-bg_hover] p-[2px_8px] rounded-[7px]">{bookmarks[0].length}</span>}
                </div>
              )
            })}
          </div>
        </div>
      )
    },
    MainContent(){
      // const { page } = useSnapshot(MainProxy);
      const { page } = useContext(MainContext);
      return (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={page[0]}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-grow relative flex flex-col min-h-0">
              {page[0] === 'tabs' && <Tabs />}
              {page[0] === 'bookmark' && <Bookmarks />}
              {page[0] === 'history' && <History />}
              {page[0] === 'setting' && <Settings />}
            </motion.div>
          </AnimatePresence>
        </>
      )
    },
  }
}

function Mother(){
  const pageValue = usePage();
  const { langState } = pageValue;
  return(
    <LangContext.Provider value={langState}>
      <MainContext.Provider value={pageValue}>
        <div className="text-[--ws-text] text-[25px] bg-[--ws-bg] absolute inset-0 flex flex-col">
          <C.Header />
          <C.MainSection />
        </div>
      </MainContext.Provider>
    </LangContext.Provider>
  )
}

export default Mother;