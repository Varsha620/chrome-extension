const mascotUrl = chrome.runtime.getURL("icons/ghosty.png");
console.log("Mascot URL:", mascotUrl);  // Debugging output

const mascot = document.createElement("div");
mascot.id = "mascot";
mascot.style.position = "fixed";
mascot.style.top = "10px";   // Ensure it's positioned at the top
mascot.style.right = "10px"; // Ensure it's positioned at the right
mascot.style.width = "100px";
mascot.style.height = "100px";
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
    
    setTimeout(() => bubble.remove(), 4000);
  }
  
  // Show reminder every 10 minutes
  setInterval(showReminder, 5000);

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
      
      setTimeout(() => bubble.remove(), 4000);
    });
  }
  
  
  // Show every hour
  setInterval(showEncouragement, 5000);

// Function to check if the user is on YouTube
// Store reference to the mascot bubble and last checked video title
let mascotBubble = null;
let lastCheckedTitle = "";

// Function to get the YouTube video title correctly
function getYouTubeVideoTitle() {
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

// Function to pause video and show mascot reminder
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

    // Create a mascot speech bubble
    mascotBubble = document.createElement("div");
    mascotBubble.className = "mascot-bubble";
    mascotBubble.innerText = `Are you sure?? 🤨 Don't lose focus on "${task}"!`;

    document.body.appendChild(mascotBubble);
    
    setTimeout(() => {
        if (mascotBubble) mascotBubble.remove();
    }, 5000);
}

// Function to remove the mascot reminder if user is back on task
function removeFocusReminder() {
    if (mascotBubble) {
        mascotBubble.remove();
        mascotBubble = null;
    }
}

// Function to monitor YouTube videos
function monitorYouTube() {
    chrome.storage.local.get("task", (data) => {
        let task = data.task || "";
        if (!task) return;

        console.log("User Task:", task);
        console.log("Checking video relevance...");

        let videoPlayer = document.querySelector("video");
        let videoTitle = getYouTubeVideoTitle();

        if (!videoTitle || videoTitle === lastCheckedTitle) {
            return; // Avoid unnecessary checks if title hasn't changed
        }

        lastCheckedTitle = videoTitle; // Update last checked title

        if (!isVideoRelated(task)) {
            console.warn("❌ Unrelated video detected. Pausing...");
            showFocusReminder(task);
            if (videoPlayer && !videoPlayer.paused) {
                videoPlayer.pause();
            }
        } else {
            console.log("✅ Related video. Removing reminder.");
            removeFocusReminder();
            if (videoPlayer && videoPlayer.paused) {
                videoPlayer.play(); // Resume video if it was paused
            }
        }
    });
}

// Run the check on YouTube every 5 seconds
if (window.location.hostname.includes("youtube.com")) {
    setInterval(monitorYouTube, 5000);
}
