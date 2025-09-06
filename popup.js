document.getElementById("saveTask").addEventListener("click", () => {
    const task = document.getElementById("taskInput").value;
    const mascot = document.getElementById("mascotSelect").value;
  
    chrome.storage.local.set({ task, mascot }, () => {
      alert("Task & Mascot saved!");
    });
  });

  document.getElementById("saveTask").addEventListener("click", () => {
    const task = document.getElementById("task").value;
    chrome.storage.local.set({ task });
    document.getElementById("taskDisplay").innerText = `Task: ${task}`;
  });
  
  // Load saved task
  chrome.storage.local.get("task", (data) => {
    if (data.task) document.getElementById("taskDisplay").innerText = `Task: ${data.task}`;
  });
  
  document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const saveTaskButton = document.getElementById("saveTask");
  const taskDisplay = document.getElementById("taskDisplay");

  const mascotSelect = document.getElementById("mascotSelect");
  const wellnessFrequencyInput = document.getElementById("wellnessFrequency");
  const encouragementFrequencyInput = document.getElementById("encouragementFrequency");
  const saveSettingsButton = document.getElementById("saveSettings");

  const warningStatus = document.getElementById("warningStatus");
  const resetWarningsButton = document.getElementById("resetWarningsButton");

  // Load saved settings when popup opens
  chrome.storage.local.get(
    ["task", "mascot", "wellnessFrequency", "encouragementFrequency", "disableWarnings"],
    (data) => {
      if (data.task) {
        taskInput.value = data.task;
        taskDisplay.innerText = `Current Task: ${data.task}`;
      } else {
        taskDisplay.innerText = "No task set yet.";
      }

      if (data.mascot) {
        mascotSelect.value = data.mascot;
      }
      wellnessFrequencyInput.value = data.wellnessFrequency || 60; // Default to 60 mins
      encouragementFrequencyInput.value = data.encouragementFrequency || 30; // Default to 30 mins

      if (data.disableWarnings) {
          warningStatus.innerText = "YouTube warnings are DISABLED.";
          warningStatus.style.color = "#dc3545"; // Red color
      } else {
          warningStatus.innerText = "YouTube warnings are ENABLED.";
          warningStatus.style.color = "#28a745"; // Green color
      }
    }
  );

  // Save Task
  saveTaskButton.addEventListener("click", () => {
    const task = taskInput.value.trim();
    if (task) {
      chrome.storage.local.set({ task: task, lastTask: task }, () => { // Also update lastTask for comparison
        taskDisplay.innerText = `Current Task: ${task}`;
        alert("Task saved!");
        // Inform content script about task change to reset warnings
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "taskUpdated" });
        });
      });
    } else {
      alert("Please enter a task!");
    }
  });

  // Save Settings
  saveSettingsButton.addEventListener("click", () => {
    const mascot = mascotSelect.value;
    const wellnessFrequency = parseInt(wellnessFrequencyInput.value, 10);
    const encouragementFrequency = parseInt(encouragementFrequencyInput.value, 10);

    if (isNaN(wellnessFrequency) || wellnessFrequency < 5 ||
        isNaN(encouragementFrequency) || encouragementFrequency < 5) {
        alert("Frequencies must be numbers greater than or equal to 5 minutes.");
        return;
    }

    chrome.storage.local.set({ mascot, wellnessFrequency, encouragementFrequency }, () => {
      alert("Settings saved!");
      // Send message to content script to update intervals if needed
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { action: "settingsUpdated" });
      });
    });
  });

  // Reset YouTube Warnings
  resetWarningsButton.addEventListener("click", () => {
      chrome.storage.local.set({ disableWarnings: false, warningCount: 0, snoozeUntil: 0 }, () => {
          warningStatus.innerText = "YouTube warnings are ENABLED.";
          warningStatus.style.color = "#28a745";
          alert("YouTube warnings have been reset and re-enabled!");
          // Inform content script to remove any existing overlays/intervals
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id, { action: "resetYouTubeWarnings" });
          });
      });
  });
});
  