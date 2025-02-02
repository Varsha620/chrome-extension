const mascotUrl = chrome.runtime.getURL("icons/ghosty.png");
console.log("Mascot URL:", mascotUrl);  // Debugging output

const mascot = document.createElement("div");
mascot.id = "mascot";
mascot.style.position = "fixed";
mascot.style.top = "95px";   // Ensure it's positioned at the top
mascot.style.right = "0.7px"; // Move it more to the right
mascot.style.width = "80px";
mascot.style.height = "80px";
mascot.style.backgroundImage = `url(${mascotUrl})`;
mascot.style.backgroundSize = "contain";  // Ensure the image scales properly
mascot.style.backgroundRepeat = "no-repeat";
mascot.style.zIndex = "9999";  // Keep it on top
mascot.style.pointerEvents = "none";  // Ensure it doesn’t block page clicks

document.body.appendChild(mascot);

// Debugging check
if (document.getElementById("mascot")) {
    console.log("Mascot successfully added to the page!");
} else {
    console.error("Mascot was NOT added to the page!");
}


// Predefined wellness messages
const wellnessMessages = [
    "Time to stretch! 🏃‍♂️",
    "Blink your eyes and relax! 👀",
    "Drink some water! 💧",
    "Fix your posture! 🪑",
    "Take a deep breath! 😌"
  ];
  
  // Function to show reminder
  function showReminder() {
    const bubble = document.createElement("div");
    bubble.className = "mascot-bubble";
    bubble.innerText = wellnessMessages[Math.floor(Math.random() * wellnessMessages.length)];
    
    document.body.appendChild(bubble);
    
    setTimeout(() => bubble.remove(), 10000);
  }
  
  // Show reminder every hr
  setInterval(showReminder, 3600000);

  //function to show encouragement
  function showEncouragement() {
    if (!chrome?.storage?.local) {
      console.warn("Extension context is invalid. Skipping encouragement message.");
      return;
    }
  
    chrome.storage.local.get("task", (data) => {
      if (chrome.runtime.lastError) {
        console.error("Error accessing storage:", chrome.runtime.lastError);
        return;
      }
      
      const task = data.task || "your goal";
      const messages = [
        `Hey! Finish "${task}" or no cookies! 🍪`,
        `Keep going! "${task}" is almost done! 🚀`,
        `Don't give up! Complete "${task}" and treat yourself! 🎉`
      ];
      
      const bubble = document.createElement("div");
      bubble.className = "mascot-bubble";
      bubble.innerText = messages[Math.floor(Math.random() * messages.length)];
      
      document.body.appendChild(bubble);
      
      setTimeout(() => bubble.remove(), 9000);
    });
  }
  
  
  // Show every 30min
  setInterval(showEncouragement, 1800000 );

// Function to check if the user is on YouTube
// Store reference to the mascot bubble and last checked video title
let mascotBubble = null;
let videoOverlay = null;
let lastCheckedTitle = "";
let warningInterval = null;
let warningIndex = 0;
let warningCount = 0;

// List of mascot warnings
const warningMessages = [
    "Nuhh uhhh! Focus Buddy 🫡",
    "Hey! This isn't part of your goal! 🤨",
    "Stay on track! Don't let distractions win! 🚀",
    "Third warning! ❌ Click below to disable or continue."
];

// Function to reset warnings when a new task is set
function resetWarnings() {
    chrome.storage.local.set({ disableWarnings: false });
    warningCount = 0;
}

// Function to check if a YouTube ad is playing
function isAdPlaying() {
    return document.querySelector(".ytp-ad-text") || document.querySelector(".ytp-ad-skip-button");
}

// Function to get the YouTube video title correctly
function getYouTubeVideoTitle() {
    if (isAdPlaying()) return null;
    let titleElement = document.querySelector("#title h1 yt-formatted-string");
    return titleElement ? titleElement.innerText.toLowerCase() : null;
}

// Function to check if the video is related to the user's task
function isVideoRelated(task) {
    const videoTitle = getYouTubeVideoTitle();
    return videoTitle ? videoTitle.includes(task.toLowerCase()) : false;
}

// Function to show the third warning bubble
function showThirdWarningBubble() {
    mascotBubble = document.createElement("div");
    mascotBubble.className = "mascot-bubble";
    mascotBubble.innerHTML = `
        <p>⚠️ This is your third Warning! ❌Choose wisely!!</p>
        <button id="disableWarnings" class="bubble-button">Disable Further Warnings</button>
        <button id="continueWarnings" class="bubble-button">Continue Reminders</button>
    `;

    document.body.appendChild(mascotBubble);

    document.getElementById("disableWarnings").addEventListener("click", () => {
        chrome.storage.local.set({ disableWarnings: true });
        mascotBubble.remove();
        removeFocusReminder();
    });

    document.getElementById("continueWarnings").addEventListener("click", () => {
        chrome.storage.local.set({ disableWarnings: false });
        warningCount = 0; // Reset count so third warning repeats every 3 warnings
        mascotBubble.remove();
    });
}

// Function to show warning messages (pauses video)
function showFocusReminder(task) {
    let video = document.querySelector("video");
    if (video) video.pause();

    if (mascotBubble) mascotBubble.remove();

    // 🛠️ Always recreate the overlay
    if (videoOverlay) {
        videoOverlay.remove();
    }
    videoOverlay = document.createElement("div");
    videoOverlay.id = "video-overlay";
    videoOverlay.style.position = "fixed";
    videoOverlay.style.top = "0";
    videoOverlay.style.left = "0";
    videoOverlay.style.width = "100%";
    videoOverlay.style.height = "100%";
    videoOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    videoOverlay.style.zIndex = "9998";
    document.body.appendChild(videoOverlay);

    // 🛠️ Ensure the third warning shows the option bubble
    if ((warningCount + 1) % 3 === 0) {
        showThirdWarningBubble();
    } else {
        mascotBubble = document.createElement("div");
        mascotBubble.className = "mascot-bubble";
        mascotBubble.innerText = warningMessages[warningIndex];
        document.body.appendChild(mascotBubble);
        warningIndex = (warningIndex + 1) % (warningMessages.length - 1);
    }

    warningCount++;

    // Hide the reminder and overlay after 15 seconds
    setTimeout(() => {
        if (mascotBubble) mascotBubble.remove();
        if (videoOverlay) videoOverlay.remove(); // 🛠️ Ensure overlay is removed
    }, 15000);
}


// Function to start warning reminders every 20 seconds
function startWarningInterval(task) {
    chrome.storage.local.get("disableWarnings", (data) => {
        if (data.disableWarnings) return;

        clearInterval(warningInterval);
        showFocusReminder(task);

        warningInterval = setInterval(() => {
            showFocusReminder(task);
        }, 20000);
    });
}

// Function to remove warnings & overlays when user returns to related content
function removeFocusReminder() {
    if (mascotBubble) mascotBubble.remove();
    if (videoOverlay) videoOverlay.remove();
    clearInterval(warningInterval);
}

// Function to monitor YouTube videos & reset warnings if a new task is set
function monitorYouTube() {
    chrome.storage.local.get(["task", "lastTask", "disableWarnings"], (data) => {
        let task = data.task || "";
        let lastTask = data.lastTask || "";
        let disableWarnings = data.disableWarnings || false;

        if (!task) return;

        // 🛠️ If a new task is set, reset warnings!
        if (task !== lastTask) {
            console.log("🔄 New task detected! Resetting warnings.");
            chrome.storage.local.set({ disableWarnings: false, lastTask: task });
            warningCount = 0; // Reset warning count
        }

        // 🚫 If warnings are disabled for this task, stop checking
        if (disableWarnings) {
            console.log("🚫 Warnings are disabled for this task.");
            return;
        }

        let videoTitle = getYouTubeVideoTitle();
        if (!videoTitle || videoTitle === lastCheckedTitle) return;
        lastCheckedTitle = videoTitle;

        if (!isVideoRelated(task)) {
            startWarningInterval(task);
        } else {
            removeFocusReminder();
        }
    });
}


// Run the check on YouTube every 10 seconds
if (window.location.hostname.includes("youtube.com")) {
    setInterval(monitorYouTube, 10000);
}
