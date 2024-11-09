import browser from "webextension-polyfill";
import { captureVisibleTab } from "./libs/chrome_funcs";

console.log("Hello from the background!");

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
});

chrome.bookmarks.onCreated.addListener(async(id, bookmark) => {
  console.log("Bookmark created:", bookmark);
  const windowId = chrome.windows.WINDOW_ID_CURRENT
  const { fullsize, thumbnail } = await captureVisibleTab(windowId, false, true);
  console.log('fullsize', fullsize, 'thumbnail', thumbnail)
});

chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
  console.log("Bookmark removed:", removeInfo);
});