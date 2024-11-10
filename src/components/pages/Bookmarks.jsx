import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Tran from "../../libs/translater";
import { MainContext } from "../Mother";
import { bookmarksFunc, bookmarksTreeNavify, externalDataHandler ,extensionDB, getBookmarks, openInNewTabNextTo } from "../../libs/chrome_funcs";
import { proxy, snapshot, useSnapshot } from "valtio";
import MomSaidTheVirtualListAtHome from "../reuse/MomSaidTheVirtualListAtHome";
import Time_ago from "../../libs/time_ago";
import Popup from "../reuse/Popup";

const BookmarkC = {
  Navbar() {
    const { bookmarks, bookmarkNavPath } = useContext(MainContext);

    const folderPath = () => {
      let _folderPath = [/*{ children: bookmarks, title: "Root" }*/];
      let current = { children: bookmarks[0] };
      for (let i = 0; i < bookmarkNavPath[0].length; i++) {
        current = current.children.find(child => child.id === bookmarkNavPath[0][i]);
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
          {bookmarks[0].length > 0 && bookmarkNavPath[0].map((folderId, index) => {

            function goFolder() {
              bookmarkNavPath[1](bookmarkNavPath[0].slice(0, index + 1));
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
    const { bookmarkNavPath,modalBookmark } = useContext(MainContext);
    const ZoomImage = useState(false);
    const isFolder = !bookmark.url;
    // const favicons = bookmark?.url?.startsWith('http') ? bookmark.url.split('/')[2] + 'favicon.ico' : '';
    //https://www.google.com/favicons.ico
    // const favicons = bookmark?.url?.startsWith('http') ? `https://${bookmark.url.split('/')[2]}/favicon.ico` : null;
    const favicons = null

    const BookmarkExtendInfo = useState(null);
    const thumbnail = BookmarkExtendInfo[0]?.capture?.thumbnail ?? null;
    const fullsize = BookmarkExtendInfo[0]?.capture?.fullsize ?? 'https://pbs.twimg.com/media/GYuT1QmbYAANz7a?format=jpg&name=4096x4096';

    useEffect(() => {
      console.log('BookmarkExtendInfo useEffect');
      extensionDB.getBookmarkExtendInfo(bookmark.id).then((info) => {
        console.log('info', info);
        // console.log('info', Object.values(info)[0]);
        BookmarkExtendInfo[1](Object.values(info)[0]);
      });
    }, []);
    


    function NavToBookmark() {
      bookmarkNavPath[1]([...bookmarkNavPath[0], bookmark.id]);
    }

    function openModal(e) {
      e.stopPropagation();
      modalBookmark[1](bookmark);
    }

    function openUrlInNewTab(e) {
      e.stopPropagation();
      openInNewTabNextTo(bookmark.url);
    }

    function openFullsize() {
      ZoomImage[1](true);
    }
    
    return(
      <>
        <div className=" aspect-[1920/1080] w-full overflow-clip bg-[--ws-bg-d] relative " onClick={() => {
          if (isFolder) {
            NavToBookmark();
          }else{
            // openModal();
          }
        }}>

          {!isFolder &&
            <>
            {thumbnail &&
            <img className=" absolute inset-0 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] object-cover group-hover:scale-[1.05] duration-[0.2s] "
              src={thumbnail} onClick={openFullsize} alt="" />}
            {!thumbnail &&
            <div className="flex items-center justify-center w-full h-full opacity-[0.1] group-hover:opacity-[1] group-hover:scale-[1.25] duration-[0.2s]">
              <div className="text-[50px] go ">
                public
              </div>
            </div>}
            <div className="absolute top-1 right-1  text-[10px]  flex-col gap-[5px]  group-hover:flex hidden">
              <button onClick={openUrlInNewTab} className=" aspect-square w-[30px] h-[30px] p-[5px] rounded-full bg-[#00000080] cursor-pointer grid place-content-center">
                <div className="text-[15px] go text-[--ws-bg]">
                  open_in_new
                </div>
              </button>
              <button onClick={openModal} className=" aspect-square w-[30px] h-[30px] p-[5px] rounded-full bg-[#00000080] cursor-pointer grid place-content-center">
                <div className="text-[15px] go text-[--ws-bg]">
                  more_vert
                </div>
              </button>
            </div>
            </>
          }
          {isFolder &&
            <div className="flex items-center justify-center w-full h-full opacity-[0.75] group-hover:opacity-[1] group-hover:scale-[1.25] duration-[0.2s]">
              <div className="text-[50px] go ">
                folder
              </div>
            </div>
          }

          <div className="absolute bottom-0 right-0 p-[5px] text-[10px]" style={{
            textShadow: '#fff 1px 1px 2px , #fff -1px -1px 2px , #fff -1px 1px 2px , #fff 1px -1px 2px',
          }}>
            <Time_ago New_time={new Date().getTime()} Old_time={new Date(bookmark.dateAdded).getTime()} />
          </div>

        </div>
        <div className="flex items-center gap-[10px] p-[5px_10px] h-full">
          <div className="w-[18px] h-[18px] rounded-[5px] overflow-hidden">
            {!isFolder ?
              <>
                {favicons && <img src={favicons} alt={bookmark.title} loading="lazy" />}
                {!favicons && <div className="text-[15px] go">public</div>}
              </>
              :
              <div className="text-[15px] go">
                folder
              </div>
            }
          </div>
          <div className="flex-grow w-[50px] flex flex-col">
            <div className=" ellipsis line-clamp-1" title={bookmark.title}>
              {bookmark.title}
            </div>
            <div className=" ellipsis text-[8px] line-clamp-1" title={bookmark.url}>
              {bookmark.url}
            </div>
          </div>
          {/* <div className="flex gap-[5px]">
            <button onClick={() => { }} className=" aspect-square p-[5px] rounded-[5px] cursor-pointer">
              <div className="text-[15px] go">
                more_vert
              </div>
            </button>
          </div> */}
        </div>
        <Popup isOpen={ZoomImage[0]} onClose={() => { ZoomImage[1](false) }}>
          <div className=" w-full overflow-clip bg-[--ws-bg-d] relative" onClick={() => { ZoomImage[1](false) }}>
            <img src={fullsize} alt="" className="w-full h-full object-contain min-h-0" />
          </div>
        </Popup>
      </>
    )
  },
  PassiveThumbnail({ bookmark }) {
    const BookmarkExtendInfo = useState(null);
    const thumbnail = BookmarkExtendInfo[0]?.capture?.thumbnail ?? 'https://pbs.twimg.com/media/GYuT1QmbYAANz7a?format=jpg&name=4096x4096';

    useEffect(() => {
      extensionDB.getBookmarkExtendInfo(bookmark.id).then((info) => {
        
        console.log('info', Object.values(info)[0]);
        BookmarkExtendInfo[1](Object.values(info)[0]);
      });
    }, []);

    return (
      <img className=" absolute inset-0 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] object-cover group-hover:scale-[1.05] duration-[0.2s]"
        src={thumbnail} alt="" />
    )
  }
}
const BC = BookmarkC;

function Bookmarks() {
  // const { bookmarks, bookmarkNavPath } = useSnapshot(MainProxy);
  const { bookmarks, bookmarkNavPath } = useContext(MainContext);
  const bookmarkListRef = useRef(null);
  const sortedBookmarks = bookmarks[0].length > 0 ? [...bookmarksTreeNavify(bookmarks[0], bookmarkNavPath[0]).children].sort((a, b) => {
    return b.dateAdded - a.dateAdded;
  }):[];
  
  useEffect(() => {
    console.log('Bookmarks useEffect');
    bookmarksFunc.loadNativeBookmarks(bookmarks);
    bookmarksFunc.restoreNav(bookmarkNavPath);
  }, []);

  useEffect(() => {
    if (bookmarkListRef.current) {
      bookmarkListRef.current.scrollTop = 0;
    }
    bookmarksFunc.storeNav(bookmarkNavPath);
    
  }, [bookmarkNavPath[0]]);

  return (
    <div className="flex-grow bg-[--ws-bg] text-[--ws-text] p-[10px] rounded-[10px] flex flex-col gap-[10px] min-h-0 ">
      <BC.Navbar />
      <div ref={bookmarkListRef} className={'grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] gap-[2px] overflow-auto'} >
        {sortedBookmarks.map((bookmark) => {
          // console.log(bookmark);
          return (
            <MomSaidTheVirtualListAtHome key={bookmark.id} className="flex flex-col rounded-[5px] overflow-clip bg-[--ws-bg_hover] text-[--ws-text] text-[12px] group " inVisibleHeight="151px">
              <BC.Block bookmark={bookmark} />
            </MomSaidTheVirtualListAtHome>
            // <div className="text-[10px]">{bookmark.title}</div>
          );
        }
        )}
      </div>
    </div>
  );
}

export default Bookmarks;