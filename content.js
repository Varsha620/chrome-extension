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
let warningInterval = null; // Stores the interval for rotating warnings
let warningIndex = 0; // Tracks the current warning message

// List of different mascot warnings
const warningMessages = [
    "Nuhh uhhh! Focus Buddy 🫡",
    "Hey! This isn't part of your goal! 🤨",
    "Stay on track! Don't let distractions win! 🚀",
    "Remember your task! You can do it! 💪",
    "Time to refocus! Get back to learning! 🎯"
];

// Function to check if a YouTube ad is playing
function isAdPlaying() {
    let adIndicator = document.querySelector(".ytp-ad-text"); // Checks for "Ad" label
    let skipButton = document.querySelector(".ytp-ad-skip-button"); // Checks for "Skip Ad" button
    return adIndicator || skipButton; // If either exists, it's an ad
}

// Function to get the YouTube video title correctly
function getYouTubeVideoTitle() {
    if (isAdPlaying()) {
        console.log("Ignoring ad...");
        return null; // If it's an ad, ignore it
    }

    let titleElement = document.querySelector("#title h1 yt-formatted-string"); // Updated selector
    if (!titleElement) {
        console.error("Could not find video title.");
        return null; // Return empty if title isn't found
    }
    console.log("Current Video Title:", titleElement.innerText);
    return titleElement.innerText.toLowerCase();
}

// Function to check if the video is related to the user's task
function isVideoRelated(task) {
    const videoTitle = getYouTubeVideoTitle();
    if (!videoTitle) return false;

    const taskLower = task.toLowerCase();
    const isRelated = videoTitle.includes(taskLower);
    console.log(`Checking video: "${videoTitle}" | Task: "${task}" | Related: ${isRelated ? "✅ Yes" : "❌ No"}`);
    return isRelated;
}

// Function to show a mascot warning bubble with grey overlay (pauses video)
function showFocusReminder(task) {
    let video = document.querySelector("video");
    if (video) {
        video.pause(); // Pause the video
    }

    console.log(`Mascot Reminder: Video doesn't match task "${task}"`);

    // Remove any existing bubble before adding a new one
    if (mascotBubble) {
        mascotBubble.remove();
    }

    // Create or update the grey overlay on video
    if (!videoOverlay) {
        videoOverlay = document.createElement("div");
        videoOverlay.id = "video-overlay";
        videoOverlay.style.position = "fixed";
        videoOverlay.style.top = "0";
        videoOverlay.style.left = "0";
        videoOverlay.style.width = "100%";
        videoOverlay.style.height = "100%";
        videoOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Semi-transparent grey overlay
        videoOverlay.style.zIndex = "9998"; // Just below mascot
        document.body.appendChild(videoOverlay);
    }

    // Create a mascot speech bubble
    mascotBubble = document.createElement("div");
    mascotBubble.className = "mascot-bubble";
    mascotBubble.innerText = warningMessages[warningIndex]; // Show first message initially
    warningIndex = (warningIndex + 1) % warningMessages.length; // Cycle through messages

    document.body.appendChild(mascotBubble);

    // Hide the reminder and overlay after 5 seconds and resume video
    setTimeout(() => {
        if (mascotBubble) {
            mascotBubble.remove();
            mascotBubble = null;
        }
        if (videoOverlay) {
            videoOverlay.remove();
            videoOverlay = null;
        }
    }, 5000);
}

// Function to start warning reminders every minute (pauses video each time)
function startWarningInterval(task) {
    clearInterval(warningInterval); // Clear any previous interval
    showFocusReminder(task); // Show the first reminder immediately

    warningInterval = setInterval(() => {
        showFocusReminder(task);
    }, 30000); // Show new reminder every 30 seconds
}

// Function to remove the mascot reminder, overlay, and stop warnings
function removeFocusReminder() {
    if (mascotBubble) {
        mascotBubble.remove();
        mascotBubble = null;
    }
    if (videoOverlay) {
        videoOverlay.remove();
        videoOverlay = null;
    }
    clearInterval(warningInterval); // Stop rotating messages when user is back on track
}

// Function to monitor YouTube videos
function monitorYouTube() {
    chrome.storage.local.get("task", (data) => {
        let task = data.task || "";
        if (!task) return;

        console.log("User Task:", task);
        console.log("Checking video relevance...");

        let videoTitle = getYouTubeVideoTitle();
        if (!videoTitle || videoTitle === lastCheckedTitle) {
            return; // Avoid unnecessary checks if title hasn't changed
        }

        lastCheckedTitle = videoTitle; // Update last checked title

        if (!isVideoRelated(task)) {
            console.warn("❌ Unrelated video detected. Showing reminder...");
            startWarningInterval(task); // Show reminders every minute & pause video
        } else {
            console.log("✅ Related video. Removing reminder.");
            removeFocusReminder();
        }
    });
}

// Run the check on YouTube every 30 seconds
if (window.location.hostname.includes("youtube.com")) {
    setInterval(monitorYouTube, 30000);
}
