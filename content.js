// --- Initial Setup and Mascot Creation ---
const mascot = document.createElement("div");
mascot.id = "mascot";
document.body.appendChild(mascot);

let mascotBubble = null;
let videoOverlay = null;
let lastCheckedTitle = ""; // Stores the title of the last YouTube video checked
let warningInterval = null; // Interval for YouTube warnings
let warningIndex = 0; // Cycles through warning messages
let warningCount = 0; // Counts warnings for interactive prompt
let snoozeUntil = 0; // Timestamp for when YouTube warning snooze ends

// --- Mascot Drag and Drop Functionality ---
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

// Load mascot image and position from storage
function loadMascotSettings() {
    chrome.storage.local.get(["mascot", "mascotX", "mascotY"], (data) => {
        const mascotFileName = data.mascot || "ghosty.png";
        const mascotUrl = chrome.runtime.getURL(`icons/${mascotFileName}`);
        mascot.style.backgroundImage = `url(${mascotUrl})`;

        if (data.mascotX !== undefined && data.mascotY !== undefined) {
            mascot.style.left = `${data.mascotX}px`;
            mascot.style.top = `${data.mascotY}px`;
            xOffset = data.mascotX;
            yOffset = data.mascotY;
        } else {
            // Default position if not saved (top right)
            const defaultRight = 7; // As per styles.css
            const defaultTop = 95; // As per styles.css

            // Temporarily apply default position to get dimensions
            mascot.style.position = "fixed";
            mascot.style.right = `${defaultRight}px`;
            mascot.style.top = `${defaultTop}px`;
            mascot.style.left = '';
            mascot.style.bottom = '';

            const rect = mascot.getBoundingClientRect();
            xOffset = rect.left;
            yOffset = rect.top;

            mascot.style.left = `${xOffset}px`;
            mascot.style.top = `${yOffset}px`;
            mascot.style.right = ''; // Clear right for consistent left/top control

            chrome.storage.local.set({ mascotX: xOffset, mascotY: yOffset });
        }
    });
}

function dragStart(e) {
    if (e.target !== mascot) return;
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    isDragging = true;
    mascot.classList.add("dragging");
    mascot.style.transition = "none";
    e.preventDefault();
}

function dragEnd(e) {
    isDragging = false;
    mascot.classList.remove("dragging");
    mascot.style.transition = "transform 0.1s ease-out";

    chrome.storage.local.set({ mascotX: xOffset, mascotY: yOffset });
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        const maxX = window.innerWidth - mascot.offsetWidth;
        const maxY = window.innerHeight - mascot.offsetHeight;

        xOffset = Math.max(0, Math.min(currentX, maxX));
        yOffset = Math.max(0, Math.min(currentY, maxY));

        mascot.style.left = `${xOffset}px`;
        mascot.style.top = `${yOffset}px`;

        if (mascotBubble) {
            positionMascotBubble();
        }
    }
}

// Attach event listeners for drag and drop
document.addEventListener("mousedown", dragStart, false);
document.addEventListener("mouseup", dragEnd, false);
document.addEventListener("mousemove", drag, false);

// Position the bubble relative to the mascot
function positionMascotBubble() {
    if (!mascotBubble) return;

    const mascotRect = mascot.getBoundingClientRect();
    const bubbleRect = mascotBubble.getBoundingClientRect();

    let bubbleTop, bubbleLeft;
    const gap = 15;

    bubbleTop = mascotRect.top - bubbleRect.height - gap;
    bubbleLeft = mascotRect.left + (mascotRect.width / 2) - (bubbleRect.width / 2);

    const tail = mascotBubble.querySelector(".bubble-tail");
    if (bubbleTop < 5) {
        bubbleTop = mascotRect.bottom + gap;
        mascotBubble.classList.add("below-mascot");
    } else {
        mascotBubble.classList.remove("below-mascot");
    }

    if (bubbleLeft < 5) {
        bubbleLeft = 5;
    }
    if (bubbleLeft + bubbleRect.width > window.innerWidth - 5) {
        bubbleLeft = window.innerWidth - bubbleRect.width - 5;
    }

    mascotBubble.style.top = `${bubbleTop}px`;
    mascotBubble.style.left = `${bubbleLeft}px`;

    if (tail) {
        tail.style.removeProperty('top');
        tail.style.removeProperty('bottom');
        tail.style.removeProperty('border-width');
        tail.style.removeProperty('border-color');

        tail.style.left = `${mascotRect.left + mascotRect.width / 2 - bubbleLeft - (tail.offsetWidth / 2)}px`;

        if (mascotBubble.classList.contains("below-mascot")) {
            tail.style.top = "-10px";
            tail.style.borderWidth = "0 10px 10px 0";
            tail.style.borderColor = "transparent transparent #ffe47a transparent";
        } else {
            tail.style.bottom = "-10px";
            tail.style.borderWidth = "10px 10px 0 0";
            tail.style.borderColor = "#ffe47a transparent transparent transparent";
        }
    }
}

// --- Reminder System (Wellness & Encouragement) ---
const wellnessMessages = [
    "Time to stretch! 🏃‍♂️", "Blink your eyes and relax! 👀",
    "Drink some water! 💧", "Fix your posture! 🪑",
    "Take a deep breath! 😌", "Stand up and walk a bit! 🚶‍♀️",
    "Look away from the screen for 20 seconds. 🌳"
];

let wellnessIntervalId;
let encouragementIntervalId;

// Creates and shows a mascot speech bubble
function createMascotBubble(message, type = 'normal') { // 'normal', 'warning', 'interactive'
    if (mascotBubble) mascotBubble.remove();

    mascotBubble = document.createElement("div");
    mascotBubble.className = "mascot-bubble";
    mascotBubble.innerHTML = `<p>${message}</p><div class="bubble-tail"></div>`;

    document.body.appendChild(mascotBubble);
    positionMascotBubble();

    let duration;
    if (type === 'normal') {
        duration = (Math.random() * 1000) + 4000; // 4-5 seconds
    } else if (type === 'warning') {
        duration = (Math.random() * 2000) + 5000; // 5-7 seconds
    } else if (type === 'interactive') {
        duration = (Math.random() * 2000) + 10000; // 10-12 seconds for user interaction
    }

    setTimeout(() => {
        if (mascotBubble && mascotBubble.parentNode) {
            mascotBubble.style.opacity = '0';
            mascotBubble.style.transform = 'translateY(10px) scale(0.9)';
            mascotBubble.addEventListener('transitionend', () => mascotBubble && mascotBubble.remove(), { once: true });
            mascotBubble = null;
        }
    }, duration);
}

// Starts or restarts the wellness reminder interval
function startWellnessReminder() {
    clearInterval(wellnessIntervalId);
    chrome.storage.local.get("wellnessFrequency", (data) => {
        const frequency = (data.wellnessFrequency || 60) * 60 * 1000;
        wellnessIntervalId = setInterval(() => {
            createMascotBubble(wellnessMessages[Math.floor(Math.random() * wellnessMessages.length)], 'normal');
        }, frequency);
    });
}

// Starts or restarts the encouragement reminder interval
function startEncouragementReminder() {
    clearInterval(encouragementIntervalId);
    chrome.storage.local.get(["task", "encouragementFrequency"], (data) => {
        const task = data.task || "your goal";
        const frequency = (data.encouragementFrequency || 30) * 60 * 1000;
        const messages = [
            `Hey! Finish "${task}" and enjoy guilt free! 🍪`,
            `Keep going! "${task}" is almost done! 🚀`,
            `Don't give up! Complete "${task}" and treat yourself! 🎉`,
            `You're doing great! Focus on "${task}"! 💪`,
            `Almost there with "${task}"! Stay strong! ✨`
        ];
        encouragementIntervalId = setInterval(() => {
            createMascotBubble(messages[Math.floor(Math.random() * messages.length)], 'normal');
        }, frequency);
    });
}

// Start reminders immediately on content script load
startWellnessReminder();
startEncouragementReminder();
loadMascotSettings();

// --- YouTube Focus Reminders ---
const warningMessages = [
    "Nuhh uhhh! Focus Buddy 🫡",
    "Hey! This isn't part of your goal! 🤨",
    "Stay on track! Don't let distractions win! 🚀",
    "Distractions are for losers. Be a winner!🫡",
    "Remember your task! This video can wait. 🛑"
];

// Function to check if a YouTube ad is playing
function isAdPlaying() {
    return document.querySelector(".ytp-ad-text") || document.querySelector(".ytp-ad-skip-button-icon");
}

// Function to get the YouTube video title
function getYouTubeVideoTitle() {
    if (isAdPlaying()) return null;
    let titleElement = document.querySelector("#title h1 yt-formatted-string");
    return titleElement ? titleElement.innerText.toLowerCase().trim() : null;
}

// Function to check if the video is related to the user's task
function isVideoRelated(task) {
    const videoTitle = getYouTubeVideoTitle();
    if (!videoTitle || !task) return false;

    const stopwords = new Set(["i", "want", "to", "the", "a", "for", "and", "is", "on", "in", "of", "my", "your", "its", "it"]);
    const taskWords = task.toLowerCase().split(/\s+/).filter(word => word.length > 2 && !stopwords.has(word));

    if (taskWords.length === 0) return false;

    return taskWords.some(word => videoTitle.includes(word));
}

// Function to show the warning bubble with options (3rd warning or after snooze)
function showInteractiveWarningBubble() {
    if (mascotBubble) mascotBubble.remove();

    mascotBubble = document.createElement("div");
    mascotBubble.className = "mascot-bubble";
    mascotBubble.innerHTML = `
        <p>⚠️Warning! Change of Focus! ❌ Choose wisely!!</p>
        <button id="disableWarnings" class="bubble-button danger">Disable Warnings</button>
        <button id="snoozeWarnings" class="bubble-button">Snooze for 5 mins</button>
        <button id="continueWarnings" class="bubble-button primary">Continue Reminders</button>
        <div class="bubble-tail"></div>
    `;

    document.body.appendChild(mascotBubble);
    positionMascotBubble();

    // Set a timeout for this interactive bubble
    let interactiveBubbleTimeout = setTimeout(() => {
        if (mascotBubble && mascotBubble.parentNode) {
            mascotBubble.remove();
            mascotBubble = null;
        }
    }, (Math.random() * 2000) + 10000); // 10-12 seconds

    document.getElementById("disableWarnings").addEventListener("click", () => {
        clearTimeout(interactiveBubbleTimeout); // Clear timeout on interaction
        chrome.storage.local.set({ disableWarnings: true });
        if (mascotBubble) mascotBubble.remove();
        removeFocusReminder();
    });

    document.getElementById("snoozeWarnings").addEventListener("click", () => {
        clearTimeout(interactiveBubbleTimeout); // Clear timeout on interaction
        const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
        chrome.storage.local.set({ snoozeUntil: fiveMinutesFromNow });
        if (mascotBubble) mascotBubble.remove();
        removeFocusReminder();
    });

    document.getElementById("continueWarnings").addEventListener("click", () => {
        clearTimeout(interactiveBubbleTimeout); // Clear timeout on interaction
        chrome.storage.local.set({ disableWarnings: false, warningCount: 0 });
        if (mascotBubble) mascotBubble.remove();
    });
}

// Function to show a standard focus reminder (not interactive)
function showFocusReminder() {
    let video = document.querySelector("video");
    if (video) video.pause();

    if (!videoOverlay) {
        videoOverlay = document.createElement("div");
        videoOverlay.id = "video-overlay";
        videoOverlay.style.position = "fixed";
        videoOverlay.style.top = "0";
        videoOverlay.style.left = "0";
        videoOverlay.style.width = "100%";
        videoOverlay.style.height = "100%";
        videoOverlay.style.zIndex = "9998";
        document.body.appendChild(videoOverlay);
    } else {
        videoOverlay.style.display = "block";
    }

    warningCount++;
    chrome.storage.local.set({ warningCount: warningCount });

    if (warningCount % 3 === 0) {
        showInteractiveWarningBubble();
    } else {
        createMascotBubble(warningMessages[warningIndex], 'warning');
        warningIndex = (warningIndex + 1) % warningMessages.length;
    }

    // Hide the reminder and overlay after a set duration
    setTimeout(() => {
        if (mascotBubble && mascotBubble.parentNode && mascotBubble.className.includes('mascot-bubble') && !mascotBubble.querySelector('.bubble-button')) {
            // Only remove if it's a non-interactive bubble still present
            mascotBubble.remove();
            mascotBubble = null;
        }
        if (videoOverlay && videoOverlay.parentNode) {
            videoOverlay.style.display = "none";
        }
    }, (Math.random() * 2000) + 5000); // 5-7 seconds
}


// Function to start the repeating warning interval
function startWarningInterval() {
    clearInterval(warningInterval);

    chrome.storage.local.get(["task", "disableWarnings", "snoozeUntil", "warningCount"], (data) => {
        const task = data.task || "";
        const disableWarnings = data.disableWarnings || false;
        snoozeUntil = data.snoozeUntil || 0;
        warningCount = data.warningCount || 0;

        if (!task || disableWarnings) {
            removeFocusReminder();
            return;
        }

        if (Date.now() < snoozeUntil) {
            const timeLeft = snoozeUntil - Date.now();
            if (timeLeft > 0) {
                setTimeout(() => {
                    monitorYouTube();
                }, timeLeft + 1000);
            }
            return;
        }

        showFocusReminder();

        warningInterval = setInterval(() => {
            chrome.storage.local.get(["disableWarnings", "snoozeUntil"], (innerData) => {
                if (innerData.disableWarnings || Date.now() < innerData.snoozeUntil) {
                    removeFocusReminder();
                    return;
                }
                showFocusReminder();
            });
        }, 20000);
    });
}

// Function to remove warnings, overlays & clear interval
function removeFocusReminder() {
    if (mascotBubble) {
        mascotBubble.remove();
        mascotBubble = null;
    }
    if (videoOverlay) {
        videoOverlay.style.display = "none";
    }
    clearInterval(warningInterval);
    warningInterval = null;
    chrome.storage.local.set({ warningCount: 0, snoozeUntil: 0 });
}

// Function to monitor YouTube videos and trigger warnings
function monitorYouTube() {
    if (!window.location.hostname.includes("youtube.com") || document.readyState !== "complete") {
        removeFocusReminder();
        return;
    }

    chrome.storage.local.get(["task", "disableWarnings", "lastTask", "snoozeUntil"], (data) => {
        let task = data.task || "";
        let disableWarnings = data.disableWarnings || false;
        let lastTask = data.lastTask || "";
        snoozeUntil = data.snoozeUntil || 0;

        if (task && task !== lastTask) {
            console.log("🔄 New task detected! Resetting warnings and re-enabling.");
            chrome.storage.local.set({ disableWarnings: false, lastTask: task, warningCount: 0, snoozeUntil: 0 });
            disableWarnings = false;
            snoozeUntil = 0;
            warningCount = 0;
            removeFocusReminder();
        }

        if (disableWarnings || Date.now() < snoozeUntil) {
            removeFocusReminder();
            return;
        }

        let videoTitle = getYouTubeVideoTitle();
        if (videoTitle && videoTitle !== lastCheckedTitle) {
            lastCheckedTitle = videoTitle;

            if (!isVideoRelated(task)) {
                console.log(`🔴 Off-topic video detected: "${videoTitle}" (Task: "${task}")`);
                startWarningInterval();
            } else {
                console.log(`🟢 On-topic video: "${videoTitle}" (Task: "${task}")`);
                removeFocusReminder();
            }
        } else if (!videoTitle) {
            removeFocusReminder();
        }
    });
}


// --- Event Listeners for Communication with Popup ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "taskUpdated" || request.action === "resetYouTubeWarnings") {
        console.log("Message received:", request.action);
        // Setting lastTask to empty string ensures monitorYouTube detects a 'change'
        chrome.storage.local.set({ lastTask: "" }, () => {
            monitorYouTube();
        });
    } else if (request.action === "settingsUpdated") {
        console.log("Message received: settingsUpdated");
        startWellnessReminder();
        startEncouragementReminder();
        loadMascotSettings();
    }
});


// Run the check on YouTube every 5 seconds
if (window.location.hostname.includes("youtube.com")) {
    setTimeout(monitorYouTube, 2000);
    setInterval(monitorYouTube, 5000);
} else {
    removeFocusReminder();
}

// Initial load of mascot and reminders
loadMascotSettings();
startWellnessReminder();
startEncouragementReminder();