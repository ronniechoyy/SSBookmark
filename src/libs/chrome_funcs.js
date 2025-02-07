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
    function updateWindow(windowId, updateInfo) {
      return new Promise((resolve) => {
        chrome.windows.update(windowId, updateInfo, () => resolve());
      });
    }

    function captureTab(windowId, options) {
      return new Promise((resolve) => {
        chrome.tabs.captureVisibleTab(windowId, options, (dataUrl) => resolve(dataUrl));
      });
    }

    if (fullScreen) {
      await updateWindow(windowId, { state: "fullscreen" });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for fullscreen to take effect
      const dataUrl = await captureTab(windowId, { format: "jpeg", quality: 100 });
      await updateWindow(windowId, { state: "maximized" });
      const thumbnail = inWorker
        ? await resizeImageWorker(dataUrl, 0.4)
        : await resizeImage(dataUrl, 0.4);
      return { fullsize: dataUrl, thumbnail };
    } else {
      const dataUrl = await captureTab(windowId, { format: "jpeg", quality: 100 });
      console.log('inWorker', inWorker);
      const thumbnail = inWorker
        ? await resizeImageWorker(dataUrl, 0.4)
        : await resizeImage(dataUrl, 0.4);
      return { fullsize: dataUrl, thumbnail };
    }
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
            default: ['0', '3'],
            lastActive: ['0', '3'],
          }
        },
        // bookmarksExtendInfo: {
        //   // ['bookmarkId']: { capture: { thumb, fullsize } }
        // },
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
    async getExtensionStorage() {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, function (data) {
          resolve(data)
        });
      })
    },
    async setLastActiveBookmarkNavPath(path) {
      const data = await chrome.storage.local.get(['settings']);
      const newSettings = {
        ...data.settings,
        bookmarkNavPath: {
          ...data.settings.bookmarkNavPath,
          lastActive: path
        }
      }
      await chrome.storage.local.set({
        settings: newSettings
      });
    },
    async addBookmarkExtendInfo(bookmarkId, extendInfo) {
      await chrome.storage.local.set({
        [`bookmarksExtendInfo.${bookmarkId}`]: extendInfo
      });
    },
    async getBookmarkExtendInfo(bookmarkId) {
      return await chrome.storage.local.get(`bookmarksExtendInfo.${bookmarkId}`)
    },
    async getBookmarksExtendInfoBatch(bookmarkIds) {
      // const data = await chrome.storage.local.get(['bookmarksExtendInfo']);
      // return bookmarkIds.map(id => data.bookmarksExtendInfo[id]);
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(bookmarkIds.map(id => `bookmarksExtendInfo.${id}`), function (data) {
          resolve(bookmarkIds.map(id => data[`bookmarksExtendInfo.${id}`]));
        });
      });
    }
  },
  extensionDB: {
    dbName: 'SSStorage',
    version: 1,
    stores: ['extensionData', 'bookmarksExtendInfo'], // Define stores
    db: null,
    async convertOldDB() {
      indexedDB.open('ExtensionStorage', 1).onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['extensionData'], 'readonly');
        const store = transaction.objectStore('extensionData')
        //get key "bookmarksExtendInfo"
        const request = store.getAll();

        request.onerror = () => console.error(request.error);
        request.onsuccess = () => {
          const data = request.result[0];
          console.log('data', data);
          // const { bookmarksExtendInfo } = data;
          this.init().then(async () => {
            await this.setAll('bookmarksExtendInfo', data);
          });
          
        };
      };
    },
    async init() {
      if (this.db) return this.db;
      // await this.convertOldDB();

      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);

        request.onerror = () => reject(request.error);

        request.onsuccess = () => {
          this.db = request.result;
          resolve(this.db);
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          // Create all stores
          this.stores.forEach(storeName => {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName);
            }
          });
        };
      });
    },

    async initExtensionStorage() {
      const externalData = {
        settings: {
          bookmarkNavPath: {
            default: ['0', '3'],
            lastActive: ['0', '3'],
          }
        },
        groups: [],
        favicons: {}
      };

      await this.init();
      const existingData = await this.getAll('extensionData');
      if (!existingData || Object.keys(existingData).length === 0) {
        await this.setAll('extensionData', externalData);
      }
    },

    async setAll(storeName, data) {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        for (const [key, value] of Object.entries(data)) {
          store.put(value, key);
        }

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    },

    async getAll(storeName) {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const result = {};
          store.getAllKeys().onsuccess = (e) => {
            const keys = e.target.result;
            keys.forEach((key, index) => {
              result[key] = request.result[index];
            });
            resolve(result);
          };
        };
      });
    },

    async get(storeName, key) {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });
    },

    async set(storeName, key, value) {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(value, key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });
    },

    async setLastActiveBookmarkNavPath(path) {
      const settings = await this.get('extensionData', 'settings') || {};
      const newSettings = {
        ...settings,
        bookmarkNavPath: {
          ...settings.bookmarkNavPath,
          lastActive: path
        }
      };
      await this.set('extensionData', 'settings', newSettings);
    },

    async addBookmarkExtendInfo(bookmarkId, extendInfo) {
      await this.set('bookmarksExtendInfo', bookmarkId, extendInfo);
    },

    async getBookmarkExtendInfo(bookmarkId) {
      const info = await this.get('bookmarksExtendInfo', bookmarkId);
      return { [`bookmarksExtendInfo.${bookmarkId}`]: info };
    },

    async getBookmarksExtendInfoBatch(bookmarkIds) {
      return Promise.all(bookmarkIds.map(id =>
        this.get('bookmarksExtendInfo', id)
      ));
    },

    async clear(storeName) {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    }
  },
  bookmarksFunc:{
    loadNativeBookmarks(bookmarksState){
      getBookmarks().then((bookmarks) => {
        console.log(JSON.parse(JSON.stringify(bookmarks)));
        bookmarksState[1](bookmarks)
      });
    },
    storeNav(bookmarkNavPath){
      // externalDataHandler.setLastActiveBookmarkNavPath(bookmarkNavPath[0]);
      extensionDB.setLastActiveBookmarkNavPath(bookmarkNavPath[0]);
    },
    restoreNav(bookmarkNavPathState){
      // externalDataHandler.getExtensionStorage().then((data) => {
      //   bookmarkNavPathState[1](data.settings.bookmarkNavPath.lastActive)
      // });
      extensionDB.get('extensionData','settings').then((data) => {
        bookmarkNavPathState[1](data.bookmarkNavPath.lastActive)
      });
    }
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
  externalDataHandler,
  extensionDB,
  bookmarksFunc
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

