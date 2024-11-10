import browser from "webextension-polyfill";
import { captureVisibleTab, externalDataHandler, extensionDB } from "./libs/chrome_funcs";

console.log("Hello from the background!");

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
});

// Keep track of recently created bookmarks
let recentBookmarks = [];
let createdManyBookmarks = false;
let processingTimer = null;

chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
  // Add to recent bookmarks
  recentBookmarks.push({ id, bookmark });

  // Clear existing timer
  if (processingTimer) {
    clearTimeout(processingTimer);
  }

  // Set new timer to process bookmarks
  processingTimer = setTimeout(async () => {
    if (recentBookmarks.length > 1) {
      createdManyBookmarks = true;
    } else {
      createdManyBookmarks = false;
    }
    try {
      // Process all accumulated bookmarks
      for (const { id, bookmark } of recentBookmarks) {
        // Try to find corresponding tab
        const tabs = await chrome.tabs.query({ url: bookmark.url });
        const tab = tabs[0];

        if (tab) {
          // Capture the tab
          await chrome.tabs.update(tab.id, { active: true });
          // Small delay to ensure tab is active and rendered
          await new Promise(resolve => setTimeout(resolve, createdManyBookmarks ? 500 : 100));

          const { fullsize, thumbnail } = await captureVisibleTab(tab.windowId, false, true);
          await extensionDB.addBookmarkExtendInfo(id, {
            capture: { fullsize, thumbnail }
          });
        }
      }
    } catch (error) {
      console.error('Error processing bookmarks:', error);
    } finally {
      // Clear the recent bookmarks array
      recentBookmarks = [];
    }
  }, 100); // Wait 500ms to collect all bookmarks from the batch
});

chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
  console.log("Bookmark removed:", removeInfo);
});

chrome.bookmarks.onChanged.addListener(async(id, changeInfo) => {
  console.log("Bookmark changed:", changeInfo);
  const windowId = chrome.windows.WINDOW_ID_CURRENT
  const { fullsize, thumbnail } = await captureVisibleTab(windowId, false, true);
  extensionDB.addBookmarkExtendInfo(id, { capture: { fullsize, thumbnail } });
});