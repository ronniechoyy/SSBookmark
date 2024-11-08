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
    console.log('activeTab', url)
    const newTab = await chrome.tabs.create({
      url: url,
      index: activeTab.index + 1,
      active: false
    })

    console.log('newTab', newTab)

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
  async captureVisibleTab(windowId = null, fullScreen = false) {
    return new Promise((resolve, reject) => {
      if (fullScreen) {
        //trigger fullscreen before capture
        chrome.windows.update(windowId, { state: "fullscreen" }, () => {
          setTimeout(() => {
            chrome.tabs.captureVisibleTab(windowId, { format: "jpeg", quality: 80 }, (dataUrl) => {
              //trigger fullscreen after capture
              chrome.windows.update(windowId, { state: "maximized" });
              resolve(dataUrl)
            });
          }, 1000)
        });
      }
      else {
        chrome.tabs.captureVisibleTab(windowId, { format: "jpeg", quality: 80 }, (dataUrl) => {
          resolve(dataUrl)
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
  async getBookmarks() {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.getTree(function (bookmarks) {
        resolve(bookmarks)
      });
    })
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
  getBookmarks
} = functions