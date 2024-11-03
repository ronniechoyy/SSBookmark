import { useEffect, useState } from "react";
import Tran from "../../libs/translater";
import { MainProxy } from "../Mother";
import { getBookmarks } from "../../libs/chrome_funcs";
import { proxy, useSnapshot } from "valtio";
import MomSaidTheVirtualListAtHome from "../reuse/MomSaidTheVirtualListAtHome";

const BookmarksProxy = proxy({
  bookmarks: []
})

function Bookmarks() {
  const { bookmarks } = useSnapshot(BookmarksProxy);
  
  useEffect(() => {
    console.log('Bookmarks useEffect');
    getBookmarks().then((bookmarks) => {
      console.log(bookmarks);
      BookmarksProxy.bookmarks = bookmarks[0].children
    });
  }, []);

  return (
    <div className="flex-grow bg-[--ws-bg] text-[--ws-text] p-[10px] rounded-[10px] flex flex-col gap-[10px] overflow-auto">
      <div className="text-[14px] flex gap-[5px] items-center">
        <Tran text={{ "en": "Bookmarks", "zh-TW": "書籤" }} />
        <span className="text-[12px] bg-[--ws-bg_hover] p-[2px_8px] rounded-[7px]">{bookmarks.length}</span>
      </div>
      <MomSaidTheVirtualListAtHome className={'grid grid-cols-4 gap-[2px]'} inVisibleHeight="42.5px">
        {bookmarks.map((bookmark) => {
          return (
            <div key={bookmark.id} className="flex items-center gap-[10px] p-[5px_10px] rounded-[5px] bg-[--ws-bg_hover] text-[--ws-text] text-[12px]">
              <div className="w-[18px] h-[18px] rounded-[5px] overflow-hidden">
                {bookmark.favIconUrl ?
                  <img src={bookmark.favIconUrl} alt={bookmark.title} loading="lazy" />
                  :
                  <div className="text-[15px] go">
                    folder
                  </div>
                }
              </div>
              <div className="flex-grow w-[50px] ellipsis line-clamp-1" title={bookmark.title}>
                {bookmark.title}
              </div>
              <div className="flex gap-[5px]">
                <button onClick={() => {}} className=" aspect-square p-[5px] rounded-[5px] cursor-pointer">
                  <div className="text-[15px] go">
                    more_vert
                  </div>
                </button>
              </div>
            </div>
          );
        }
        )}
      </MomSaidTheVirtualListAtHome>
    </div>
  );
}

export default Bookmarks;