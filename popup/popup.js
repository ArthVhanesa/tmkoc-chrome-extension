const perfectVideoButton = document.getElementById("perfect-video-button");
const jethalalGifElement = document.getElementById("jethalal-gif");

perfectVideoButton.addEventListener("click", openRandomVideo);

// const jethalalGif = [
//   "https://media.tenor.com/UUyL8mVNYvMAAAAC/jetha-jethalal.gif",
//   "https://media.tenor.com/tgDbJxp0Yt4AAAAC/jethalal-tarak.gif",
//   "https://media.tenor.com/q2D1TATYTY8AAAAC/jethalal-tmkoc.gif",
//   "https://media.tenor.com/rcUlT6pAH9MAAAAC/jethalal-sab-changa-c.gif",
//   "https://media.tenor.com/rNbOhgMCWOkAAAAC/jethalal-jethalal-dancing.gif",
//   "https://media.tenor.com/W06knTv2yOUAAAAd/jetha-dance.gif",
//   "https://media.tenor.com/jcsfoiV2df4AAAAd/jetha.gif",
// ];

// const randomIndex = Math.floor(Math.random() * jethalalGif.length);

// jethalalGifElement.src = jethalalGif[randomIndex];

// console.log("hello popup.js");

function openRandomVideo() {
  chrome.storage.local.get("episodes", (result) => {
    const episodes = result.episodes;
    if (episodes && episodes.length > 0) {
      const randomIndex = Math.floor(Math.random() * episodes.length);
      // console.log(randomIndex);
      const randomVideoID = episodes[randomIndex].youtubeVideoID;

      const youtubeURL = `https://www.youtube.com/watch?v=${randomVideoID}`;
      chrome.tabs.create({ url: youtubeURL });
    }
  });
}
