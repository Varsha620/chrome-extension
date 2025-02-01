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
  setInterval(showReminder, 10 * 60 * 1000);

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