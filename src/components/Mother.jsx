import { createContext, useContext, useEffect, useState } from "react";
import usePageTheme, { pageThemeStyle } from "../libs/pageTheme";
import Tran, { LangContext } from "../libs/translater";
import JSONRender from "./reuse/JSONRender";
import JSONBuilder from "./reuse/JSONBuilder";
import Popup from "./reuse/Popup";
import DataTableBase from "./reuse/DataTableBase";
import { getTabs, openInNewPopup, openInNewTabNextTo } from "../libs/chrome_funcs";

const Context = createContext(null);

const F = {}

const C = {
  Header(){
    const Child = C.HeaderChild;
    return(
      <div className="text-[15px] p-[5px]">
        <div className="flex items-center gap-[5px]">
          <div className="flex items-center gap-[5px] flex-grow">
            <img className="bg-[#555] aspect-square h-[25px] rounded-[5px] object-fill" src="https://pbs.twimg.com/media/GYuT1QmbYAANz7a?format=jpg&name=4096x4096" alt="" />
            <div className="text-[18px] font-[700]">
              <Tran text={{ "en": "SSBookMark", "zh-TW": "截圖書籤" }} />
            </div>
            <div className="text-[10px] text-[--ws-bg] bg-[--ws-text] p-[0px_3px] rounded-[5px] font-[700]">
              RONI STU.
            </div>

          </div>

          <div className="flex items-center gap-[5px]">
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
            open_in_new
            
          </div>
        </div>
      )
    },
    OpenInNewTabNextTo() {
        
        return (
          <div onClick={openInNewTabNextTo} className="bg-[--ws-bg] text-[--ws-text] p-[5px] rounded-[5px] cursor-pointer">
            <div className="text-[15px] go">
              open
            </div>
          </div>
        )
    },
    ThemeSwitch(){
      const { themeState, pageThemeStyle } = useContext(Context);

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
      const { langState } = useContext(Context);

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
    }
  },
  MainSection(){
    const isOpen = useState(false);
    return(
      <div className="p-[1px] flex-grow flex gap-[1px] bg-[--ws-bg-d] overflow-auto">
        <C.MainSectionChild.SideBar />
        <C.MainSectionChild.MainContent />
      </div>
    )
  },
  MainSectionChild:{
    SideBar(){
      const tabs = [
        { name: { "en": "Tab", "zh-TW": "分頁" }, icon: "tab" },
        { name: { "en": "Window", "zh-TW": "視窗" }, icon: "window" },
        { name: { "en": "Setting", "zh-TW": "設定" }, icon: "settings" },
        { name: { "en": "Bookmark", "zh-TW": "書籤" }, icon: "bookmark" },
        { name: { "en": "History", "zh-TW": "歷史" }, icon: "history" },
        { name: { "en": "Note", "zh-TW": "筆記" }, icon: "note" },
        { name: { "en": "Todo", "zh-TW": "待辦" }, icon: "list" },
        { name: { "en": "Calendar", "zh-TW": "行事曆" }, icon: "calendar_month" },
        { name: { "en": "Clock", "zh-TW": "時鐘" }, icon: "timer" },
        { name: { "en": "Calculator", "zh-TW": "計算機" }, icon: "calculate" },
        { name: { "en": "Weather", "zh-TW": "天氣" }, icon: "cloud" },
      ]
      
      return(
        <div className="w-[120px] bg-[--ws-bg] text-[--ws-text] p-[5px] rounded-[10px] flex flex-col">
          <div className="p-[2px] rounded-[10px] flex-grow flex flex-col gap-[2px]">
            {tabs.map((tab, index) => {
              const { name, icon } = tab;
              return(
                <div key={index} className="text-[12px]  rounded-[10px] p-[5px] flex gap-[5px] items-center">
                  <span className="go">{icon}</span>
                  <Tran text={name} />
                </div>
              )
            })}
          </div>

          
        </div>
      )
    },
    MainContent(){
      return(
        <div className="flex-grow bg-[--ws-bg] text-[--ws-text] p-[5px] rounded-[10px] flex flex-col overflow-auto">
          <div className="text-[14px]">
            <Tran text={{ "en": "Tabs", "zh-TW": "分頁" }} />
          </div>
          <div className=" ">

          </div>
        </div>
      )
    },
  }
}

function Mother(){

  const themeState = usePageTheme({ prefix: "ws", themeStyle: pageThemeStyle })
  // const langState = useContext(LangContext);
  const langState = useState("en");

  useEffect(() => {
    if (!localStorage.getItem('lang')) {
      localStorage.setItem('lang', 'zh-TW')
      langState[1]('zh-TW')
    } else {
      langState[1](localStorage.getItem('lang'))
    }
  }, [])
  
  const value = { themeState, pageThemeStyle, langState }

  return(
    <LangContext.Provider value={langState}>
    <Context.Provider value={value}>
      <div className="text-[--ws-text] text-[25px] bg-[--ws-bg] absolute inset-0 flex flex-col">
        <C.Header />
        <C.MainSection />
      </div>
    </Context.Provider>
    </LangContext.Provider>
  )
}

export default Mother;