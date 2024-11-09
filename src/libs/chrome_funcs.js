const functions = {
  openInNewPopup() {
    window.open(window.location.href, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
  },
  async openInNewTabNextTo(url = window.location.href) {
    const activeTab = await new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        resolve(tabs[0]);
      });
    });
    // console.log('activeTab', url)
    const newTab = await chrome.tabs.create({
      url: url,
      index: activeTab.index + 1,
      active: false
    })

    // console.log('newTab', newTab)

    //focus on the new tab
    chrome.tabs.update(newTab.id, { active: true });

  },
  async getActiveTab() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log('tabs[0]', tabs[0])
        var activeTab = tabs[0];
        var activeTabId = activeTab.id; // or do whatever you need
        resolve(activeTab)
      });
    })
  },
  async getAllTabs() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({}, function (tabs) {
        resolve(tabs)
      });
    })
  },
  async goSpecificTab(tabId) {
    return new Promise((resolve, reject) => {
      chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        const currentWindowId = chrome.windows.WINDOW_ID_CURRENT;
        if (tab.windowId !== currentWindowId) {
          chrome.windows.update(tab.windowId, { focused: true }, () => {
            chrome.tabs.update(tabId, { active: true }, resolve);
          });
        } else {
          chrome.tabs.update(tabId, { active: true }, resolve);
        }
      });
    });
  },
  async captureVisibleTab(windowId = null, fullScreen = false, inWorker = false) {
    return new Promise((resolve, reject) => {
      if (fullScreen) {
        //trigger fullscreen before capture
        chrome.windows.update(windowId, { state: "fullscreen" }, () => {
          setTimeout(() => {
            chrome.tabs.captureVisibleTab(windowId, { format: "jpeg", quality: 100 }, async (dataUrl) => {
              //trigger fullscreen after capture
              chrome.windows.update(windowId, { state: "maximized" });
              const thumbnail = inWorker ? await resizeImageWorker(dataUrl, 0.4) : await resizeImage(dataUrl, 0.4);
              resolve({ fullsize: dataUrl, thumbnail })
            });
          }, 1000)
        });
      }
      else {
        chrome.tabs.captureVisibleTab(windowId, { format: "jpeg", quality: 100 }, async (dataUrl) => {
          console.log('inWorker', inWorker)
          const thumbnail = inWorker ? await resizeImageWorker(dataUrl, 0.4) : await resizeImage(dataUrl, 0.4);
          resolve({ fullsize: dataUrl, thumbnail })
        }
        );
      }
    })
  },
  async resizeImage(dataUrl, ratio = 1) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width * ratio, img.height * ratio);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.src = dataUrl;
    });
  },
  async resizeImageWorker(dataUrl, ratio = 1) {

    function blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    try {
      // Convert dataUrl to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Create ImageBitmap
      const imageBitmap = await createImageBitmap(blob);

      // Calculate new dimensions
      let width = imageBitmap.width * ratio;
      let height = imageBitmap.height * ratio;

      // Create offscreen canvas
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Draw and resize
      ctx.drawImage(imageBitmap, 0, 0, width, height);

      // Convert to blob
      const resizedBlob = await canvas.convertToBlob({
        type: 'image/jpeg',
        quality: 0.8
      });

      // Convert to base64
      return await blobToBase64(resizedBlob);
    } catch (error) {
      console.error('Resize error:', error);
      return dataUrl; // Return original if resize fails
    }
  },
  async getBookmarks() {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.getTree(function (bookmarks) {
        resolve(bookmarks)
      });
    })
  },
  bookmarksTreeNavify(bookmarks, bookmarkNavPath) {
    // if (bookmarkNavPath.length === 0) {
    //   // console.log('bookmarkNavPath.length === 0', current)
    //   return bookmarks[0];
    // }

    // Handle empty path or empty bookmarks
    if (!bookmarkNavPath.length || !bookmarks || !bookmarks.length) {
      return bookmarks;
    }

    // Start with the root array
    let current = { children: bookmarks }; // Take the first item since Chrome bookmarks tree starts with a root node

    
    console.log('bookmarkNavPath', bookmarks, bookmarkNavPath)
    // Navigate through the path
    for (let i = 0; i < bookmarkNavPath.length; i++) {
      if (!current || !current.children) {
        console.warn('Navigation path broken at:', bookmarkNavPath[i]);
        return null;
      }

      current = !current?.children ? 
        current.find(child => child.id === bookmarkNavPath[i])
       :
      current.children.find(child => child.id === bookmarkNavPath[i]);

      if (!current) {
        console.warn('Could not find bookmark with id:', bookmarkNavPath[i]);
        return null;
      }
    }

   

    return current;
  },
  externalDataHandler: {
    async initExtensionStorage() {
      const externalData = {
        settings: {
          // lang: 'en',
          // theme: 'light',
          bookmarkNavPath: {
            default: ['0', '2'],
            lastActive: ['0', '2'],
          }
        },
        bookmarksExtendInfo: {
          // ['bookmarkId']: { capture: { thumb, fullsize } }
        },
        groups: [
          // {
          //   name: 'Group 1',
          //   bookmarks: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
          // }
        ],
        favicons: {
          // ['url']: 'data:image/png;base64,'
        }
      }

      // await chrome.storage.local.clear();
      const localData = await chrome.storage.local.get();
      console.log('localData', localData)
      if (Object.keys(localData).length === 0) {
        console.log('localData empty');
        await chrome.storage.local.set(externalData);
      }

    },
  }
    
}


export const { 
  openInNewPopup,
  openInNewTabNextTo,
  getActiveTab,
  getAllTabs,
  goSpecificTab,
  captureVisibleTab,
  resizeImage,
  resizeImageWorker,
  getBookmarks,
  bookmarksTreeNavify,
  externalDataHandler
} = functions

// const chains = {
//   errorhandle({chainStep='func1'}){
//     startChain()
//   },
//   async func1(){
//     try {
      
//     } catch (error) {
//       chains.errorhandle()
//     }
//   },
//   async func2() {
//     try {

//     } catch (error) {
//       chains.errorhandle()
//     }
//   },
//   async func3() {
//     try {

//     } catch (error) {
//       chains.errorhandle()
//     }
//   },
// }

// async function startChain() {
//   await chains.func1()
//   await chains.func2()
//   await chains.func3()  
// }

