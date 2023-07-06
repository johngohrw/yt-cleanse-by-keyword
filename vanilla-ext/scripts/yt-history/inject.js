(async () => {
  const mainUtils = chrome.runtime.getURL("scripts/utils/index.js");
  const { injectScript } = await import(mainUtils);

  injectScript("scripts/yt-history/main.js");
})();
