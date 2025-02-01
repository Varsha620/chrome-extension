chrome.storage.local.get(["mascot"], (data) => {
    const mascotEmoji = data.mascot || "🦉";
    
    // Inject Mascot
    const mascot = document.createElement("div");
    mascot.innerText = mascotEmoji;
    mascot.id = "mascot";
    document.body.appendChild(mascot);
  
    // Style Mascot
    mascot.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      font-size: 40px;
      cursor: pointer;
      transition: transform 0.2s;
    `;
  
    mascot.addEventListener("click", () => {
      mascot.style.transform = "scale(1.2)";
    });
  
    // Show Wellness Reminder Every 10 Minutes
    const reminders = [
      "Take a break! 🧘",
      "Drink water! 💧",
      "Stretch for a bit! 🤸",
      "Relax your eyes! 👀"
    ];
  
    function showReminder() {
      const message = reminders[Math.floor(Math.random() * reminders.length)];
      alert(message);
    }
  
    setInterval(showReminder, 600000); // 10 minutes
  });
  