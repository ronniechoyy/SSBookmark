import { createContext, useContext, useEffect, useState } from "react";
import usePageTheme, { pageThemeStyle } from "../libs/pageTheme";
import Tran, { LangContext } from "../libs/translater";
import JSONRender from "./reuse/JSONRender";
import JSONBuilder from "./reuse/JSONBuilder";
import Popup from "./reuse/Popup";
import DataTableBase from "./reuse/DataTableBase";
import { externalDataHandler, extensionDB, getActiveTab, openInNewPopup, openInNewTabNextTo } from "../libs/chrome_funcs";
import { proxy, useSnapshot } from "valtio";
import Tabs from "./pages/Tabs";
import Bookmarks from "./pages/Bookmarks";
import Settings from "./pages/Settings";
import History from "./pages/History";
import { AnimatePresence, motion } from "framer-motion";

/**@type {React.Context<ReturnType<typeof usePage>>}*/
export const MainContext = createContext(null);

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
    modalBookmark: useState(null),
  }

  useEffect(() => {
    extensionDB.initExtensionStorage();
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
  },
  DetailModal(){
    const { modalBookmark } = useContext(MainContext);
    const BookmarkExtendInfo = useState(null);
    const ZoomImage = useState(false);
    const fullsize = BookmarkExtendInfo[0]?.capture?.fullsize ?? 'https://pbs.twimg.com/media/GYuT1QmbYAANz7a?format=jpg&name=4096x4096';

    useEffect(() => {
      extensionDB.getBookmarkExtendInfo(modalBookmark[0]?.id).then((info) => {

        console.log('info', Object.values(info)[0]);
        BookmarkExtendInfo[1](Object.values(info)[0]);
      });
    }, [modalBookmark[0]]);

    const isOpen = modalBookmark[0] !== null;
    const onClose = () => { modalBookmark[1](null) }
    return (
      <Popup isOpen={isOpen} onClose={onClose}>
        <div className="w-[800px] max-w-[80%] max-h-[90%] bg-[--ws-bg] text-[--ws-text] rounded-[25px] shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-[15px_20px]">
            <div className="text-[20px] font-[700]">
              <Tran text={{ "en": "Detail", "zh-TW": "詳細" }} />
            </div>
            <div onClick={onClose} className="cursor-pointer">
              <div className="text-[20px] go aspect-square min-h-full h-[30px] rounded-full hover:bg-[--ws-bg_hover] grid place-content-center">
                close
              </div>
            </div>
          </div>
          <div className="scrollbar flex flex-col gap-[15px] text-[12px] p-[0px_20px_20px_20px] overflow-auto ">
            <div className=" w-full overflow-clip bg-[--ws-bg-d] relative rounded-[15px] " onClick={() => { ZoomImage[1](true) }}>
              <img src={fullsize} alt="" className="w-full h-full object-contain min-h-0" />
            </div>
            <h2 className="text-xl mb-4">
              {modalBookmark[0] && modalBookmark[0].title}
            </h2>
            <JSONBuilder value={modalBookmark[0]} readOnly />
          </div >
        </div >
        <Popup isOpen={ZoomImage[0]} onClose={() => { ZoomImage[1](false) }}>
          <div className=" w-full overflow-clip bg-[--ws-bg-d] relative" onClick={() => { ZoomImage[1](false) }}>
            <img src={fullsize} alt="" className="w-full h-full object-contain min-h-0" />
          </div>
        </Popup>
      </Popup>
    )
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
          <C.DetailModal />
        </div>
      </MainContext.Provider>
    </LangContext.Provider>
  )
}

export default Mother;