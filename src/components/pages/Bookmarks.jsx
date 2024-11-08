import { useEffect, useRef, useState } from "react";
import Tran from "../../libs/translater";
import { MainProxy } from "../Mother";
import { bookmarksTreeNavify, getBookmarks } from "../../libs/chrome_funcs";
import { proxy, useSnapshot } from "valtio";
import MomSaidTheVirtualListAtHome from "../reuse/MomSaidTheVirtualListAtHome";

const BookmarkC = {
  Navbar() {
    const { bookmarks, bookmarkNavPath } = useSnapshot(MainProxy);

    const folderPath = () => {
      let _folderPath = [/*{ children: bookmarks, title: "Root" }*/];
      let current = { children: bookmarks };
      for (let i = 0; i < bookmarkNavPath.length; i++) {
        current = current.children.find(child => child.id === bookmarkNavPath[i]);
        if (current.title === "") {
          current = { ...current };
          current.title = "ROOT";
        }
        _folderPath.push(current);
      }
      // return current;
      return _folderPath;
    }

    //Bookmark/Folder1/Folder2
    return (
      <div className="flex items-center gap-[5px] p-[5px] min-w-0">
        <div className="flex items-center gap-[5px]  overflow-y-auto overflow-x-auto">
          <div className="text-[15px] go">
            bookmark
          </div>
          {bookmarks.length > 0 && bookmarkNavPath.map((folderId, index) => {

            function goFolder() {
              MainProxy.bookmarkNavPath = bookmarkNavPath.slice(0, index + 1);
            }

            // console.log("folderPath", folderPath());
            
            return (
              <div key={folderId} className="flex items-center justify-center gap-[5px]" >
                <div className="text-[15px] go">
                  chevron_right
                </div>
                <div className="text-[15px] hover:bg-[--ws-bg_hover] p-[0px_10px] rounded-[5px] duration-[0.2s] cursor-pointer" 
                onClick={() => {goFolder()}}>
                  {folderPath()[index].title}
                  {/* {folderId} */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );


  },
  Block({ bookmark }) {
    //MomSaidTheVirtualListAtHome
    const { bookmarkNavPath } = useSnapshot(MainProxy);
    const isFolder = !bookmark.url;
    // console.log(bookmark);
    return(
      <MomSaidTheVirtualListAtHome className="flex flex-col rounded-[5px] overflow-clip bg-[--ws-bg_hover] text-[--ws-text] text-[12px] group " inVisibleHeight="151px">
        <div className=" aspect-[1920/1080] w-full overflow-clip bg-[--ws-bg-d] relative " onClick={()=>{
          MainProxy.bookmarkNavPath.push(bookmark.id);
        }}>

          {!isFolder &&
            <>
              <img className=" absolute inset-0 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] object-cover group-hover:scale-[1.05] duration-[0.2s]" src="https://pbs.twimg.com/media/GYuT1QmbYAANz7a?format=jpg&name=4096x4096" alt="" />
            </>
          }
          {isFolder &&
            <div className="flex items-center justify-center w-full h-full opacity-[0.75] group-hover:opacity-[1] group-hover:scale-[1.25] duration-[0.2s]">
              <div className="text-[50px] go ">
                folder
              </div>
            </div>
          }

        </div>
        <div className="flex items-center gap-[10px] p-[5px_10px]">
          <div className="w-[18px] h-[18px] rounded-[5px] overflow-hidden">
            {!isFolder ?
              <>
                {bookmark.favIconUrl && <img src={bookmark.favIconUrl} alt={bookmark.title} loading="lazy" />}
                {!bookmark.favIconUrl && <div className="text-[15px] go">public</div>}
              </>
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
            <button onClick={() => { }} className=" aspect-square p-[5px] rounded-[5px] cursor-pointer">
              <div className="text-[15px] go">
                more_vert
              </div>
            </button>
          </div>
        </div>
      </MomSaidTheVirtualListAtHome>
    )
  }
}
const BC = BookmarkC;

function Bookmarks() {
  const { bookmarks, bookmarkNavPath } = useSnapshot(MainProxy);
  const bookmarkListRef = useRef(null);
  const sortedBookmarks = bookmarks.length > 0 ? [...bookmarksTreeNavify(bookmarks, bookmarkNavPath).children].sort((a, b) => {
    return b.dateAdded - a.dateAdded;
  }):[];
  
  useEffect(() => {
    console.log('Bookmarks useEffect');
    getBookmarks().then((bookmarks) => {
      console.log(JSON.parse(JSON.stringify(bookmarks)));
      MainProxy.bookmarks = bookmarks
    });
  }, []);

  useEffect(() => {
    if (bookmarkListRef.current) {
      bookmarkListRef.current.scrollTop = 0;
    }
  }, [bookmarkNavPath]);

  return (
    <div className="flex-grow bg-[--ws-bg] text-[--ws-text] p-[10px] rounded-[10px] flex flex-col gap-[10px] min-h-0 ">
      <BC.Navbar />
      <div ref={bookmarkListRef} className={'grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] gap-[2px] overflow-auto'} >
        {sortedBookmarks.map((bookmark) => {
          // console.log(bookmark);
          return (
            <BC.Block key={bookmark.id} bookmark={bookmark} />
            // <div className="text-[10px]">{bookmark.title}</div>
          );
        }
        )}
      </div>
    </div>
  );
}

export default Bookmarks;