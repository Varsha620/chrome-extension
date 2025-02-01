document.getElementById("saveTask").addEventListener("click", () => {
    const task = document.getElementById("taskInput").value;
    const mascot = document.getElementById("mascotSelect").value;
  
    chrome.storage.local.set({ task, mascot }, () => {
      alert("Task & Mascot saved!");
    });
  });
  