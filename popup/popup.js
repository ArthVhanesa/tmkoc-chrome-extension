const perfectVideoButton = document.getElementById("perfect-video-button");

perfectVideoButton.addEventListener("click", openRandomVideo);

// console.log("hello popujs");

function openRandomVideo() {
  chrome.storage.local.get("episodes", (result) => {
    const episodes = result.episodes;
    if (episodes && episodes.length > 0) {
      const randomIndex = Math.floor(Math.random() * episodes.length);
      // console.log(randomIndex);
      const randomVideoID = episodes[randomIndex].youtubeVideoID;

      const youtubeURL = `https://www.youtube.com/watch?v=${randomVideoID}`;
      // chrome.tabs.create({ url: youtubeURL });
    }
  });
}
