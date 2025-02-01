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
  
  