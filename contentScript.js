(() => {
  let episodeTitle = "Taarak Mehta Ka Ooltah Chashmah";
  let channelName1 = "Sony SAB";
  let channelName2 = "Sony PAL";
  let episodeTitleElement;
  let channelNameElement;
  let ytSubscribeElement;
  let submitEpisodeButton;
  let currentVideoId;
  let isEpisodeAvailableVariable;

  let currentUrl = window.location.href;
  let currentUrlQueryParameters = currentUrl.split("?")[1];
  let currentUrlParameters = new URLSearchParams(currentUrlQueryParameters);
  currentVideoId = currentUrlParameters.get("v");

  function isEpisodeAvailable(videoId) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get("episodes", (result) => {
        const episodes = result.episodes;

        if (episodes && episodes.length > 0) {
          const findEpisode = episodes.find(
            (episode) => episode.youtubeVideoID === videoId
          );
          // console.log(`${findEpisode.youtubeVideoID}`);

          if (findEpisode) {
            // console.log("video ID found");
            isEpisodeAvailableVariable = true;
            resolve();
          } else {
            // console.log("video ID not found");
            isEpisodeAvailableVariable = false;
            resolve();
          }
        }
      });
    });
  }

  isEpisodeAvailable(currentVideoId);

  function newVideoLoaded() {
    setTimeout(() => {
      ytSubscribeElement = document.getElementById("owner");

      episodeTitleElement = document.getElementsByClassName(
        "style-scope ytd-watch-metadata"
      )[3];
      channelNameElement = document.getElementsByClassName(
        "style-scope ytd-channel-name"
      )[1];

      if (
        episodeTitleElement &&
        episodeTitleElement.textContent.includes(episodeTitle) &&
        channelNameElement &&
        (channelNameElement.textContent.includes(channelName1) ||
          channelNameElement.textContent.includes(channelName2))
      ) {
        const submitEpisodeButtonExist =
          document.getElementsByClassName("episode-submit-btn")[0];

        if (!submitEpisodeButtonExist) {
          submitEpisodeButton = document.createElement("button");

          submitEpisodeButton.className = "episode-submit-btn";
          submitEpisodeButton.style.padding = "10px 15px";
          submitEpisodeButton.style.marginLeft = "10px";
          submitEpisodeButton.style.fontSize = "16px";
          submitEpisodeButton.style.border = "none";
          submitEpisodeButton.style.outline = "none";
          submitEpisodeButton.style.borderRadius = "50px";
          submitEpisodeButton.style.fontWeight = "600";
          submitEpisodeButton.style.cursor = "pointer";

          isEpisodeAvailable(currentVideoId).then(() => {
            if (isEpisodeAvailableVariable) {
              submitEpisodeButton.textContent = "✅ Added";
              submitEpisodeButton.style.backgroundColor = "#494945";
              submitEpisodeButton.style.color = "#f1f1f1";
              submitEpisodeButton.disabled = true;
            } else {
              submitEpisodeButton.textContent = "Add Episode";
              submitEpisodeButton.style.backgroundColor = "white";
              submitEpisodeButton.style.color = "black";
            }
          });

          submitEpisodeButton.addEventListener("click", onSubmitHandler);

          ytSubscribeElement.appendChild(submitEpisodeButton);
        }
      } else {
        const submitEpisodeButtonExist =
          document.getElementsByClassName("episode-submit-btn")[0];

        if (submitEpisodeButtonExist) submitEpisodeButtonExist.remove();
      }
    }, 2000);
  }

  async function setButtonStatus(videoId) {
    // console.log("button status");

    submitEpisodeButton.textContent = "Adding";
    submitEpisodeButton.style.backgroundColor = "#494945";
    submitEpisodeButton.style.color = "#f1f1f1";

    setTimeout(() => {
      isEpisodeAvailable(videoId).then(() => {
        if (isEpisodeAvailableVariable) {
          submitEpisodeButton.textContent = "✅ Added";
          submitEpisodeButton.style.backgroundColor = "rgb(255 255 255 / 10%)";
          submitEpisodeButton.style.color = "#f1f1f1";
          submitEpisodeButton.disabled = true;
          // console.log("status changed");
        } else {
          submitEpisodeButton.textContent = "Add Episode";
          submitEpisodeButton.style.backgroundColor = "white";
          submitEpisodeButton.style.color = "black";
        }
      });
    }, 1000);
  }

  async function onSubmitHandler() {
    await addEpisode();
    chrome.runtime.sendMessage({ type: "FETCH_EPISODES" }, async (response) => {
      // console.log("message received from background js");
      await response;
      if (response === "OK") {
        // console.log("response message received from background js");
        setButtonStatus(currentVideoId);
      }
    });
  }

  function addEpisode() {
    return new Promise((resolve, reject) => {
      let youtubeVideoID = currentVideoId;
      let episodeName = episodeTitleElement.textContent.trim();

      let ApiUrl = "https://tmkoc-perfect-episodes.cyclic.app";

      fetch(`${ApiUrl}/episodes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          youtubeVideoID: `${youtubeVideoID}`,
          episodeName: `${episodeName}`,
        }),
      })
        .then((response) => {
          if (response.ok) {
            // console.log("Episode submitted successfully");
            resolve();
          } else {
            console.error("Failed to submit episode");
            resolve();
          }
        })
        .catch((error) => {
          console.error("Error submitting episode:", error);
          reject(error);
        });
    });
  }

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type === "NEW") {
      currentVideoId = videoId;
      isEpisodeAvailable(currentVideoId).then(() => {
        setTimeout(newVideoLoaded, 500);
      });
      // newVideoLoaded();
    }
  });

  newVideoLoaded();
})();
