(async () => {
  const src = chrome.runtime.getURL("scripts/utils/index.js");
  const { injectScript } = await import(src);

  injectScript("scripts/yt-history/main.js");
})();
