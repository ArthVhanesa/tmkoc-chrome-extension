const ApiUrl = "https://tmkoc-perfect-episodes.cyclic.app";

// console.log("background.js running");

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("youtube.com/watch")
  ) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    // console.log(tab);
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParameters.get("v"),
    });
  }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  // console.log("get response from contentScript");
  if (message.type === "FETCH_EPISODES") {
    // console.log("message received");

    // getEpisodes().then(() => {
    //   const responseData = "OK";
    //   console.log(responseData);
    // });
    // sendResponse(responseData);
    // return true;

    getEpisodes();
    const responseData = "OK";
    // console.log(responseData);
    sendResponse(responseData);
  }
});

function getEpisodes() {
  return new Promise((resolve, reject) => {
    fetch(`${ApiUrl}/episodes`)
      .then((response) => response.json())
      .then((data) => {
        const episodes = data.episodes;

        chrome.storage.local.set({ episodes: episodes }, () => {
          // console.log("Episodes stored in local storage:", episodes);
          resolve();
        });
      })
      .catch((error) => {
        console.error("Error fetching episodes:", error);
        reject(error);
      });
  });
}

getEpisodes();
