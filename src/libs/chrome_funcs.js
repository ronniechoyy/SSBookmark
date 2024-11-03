const functions = {
  openInNewPopup() {
    window.open(window.location.href, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
  },
  async openInNewTabNextTo() {
    const activeTab = await new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        resolve(tabs[0]);
      });
    });
    
    const newTab = await chrome.tabs.create({
      url: window.location.href,
      index: activeTab.index + 1,
      active: false
    })

    console.log('newTab', newTab)

    //focus on the new tab
    chrome.tabs.update(newTab.id, { active: true });

  },
  async getTabs() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log('tabs[0]', tabs[0])
        var activeTab = tabs[0];
        var activeTabId = activeTab.id; // or do whatever you need
        resolve(activeTab)
      });
    })
  }
}


export const { 
  openInNewPopup,
  openInNewTabNextTo,
  getTabs 
} = functions