let focusPoints = 0;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.includes("youtube.com/watch") || tab.url.includes("instagram.com")) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/mascot.png",
      title: "Uh-oh! Distracted?",
      message: "Nooo! Not Instagram again! 🥺",
    });

    document.body.style.filter = "grayscale(100%)";
  } else {
    focusPoints += 1;
    chrome.storage.local.set({ focusPoints });
  }
});
