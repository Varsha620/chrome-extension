# Mascot Reminder 🎯


## Basic Details
### Team Name: Varsha Sabu

### Hosted Project Link
[(https://github.com/Varsha620/chrome-extension)](https://github.com/Varsha620/chrome-extension)

### Project Description
The project mainly focuses on productivity and wellness. 

### The Problem statement
The major problem faced:<br/>
-Mindless surfing or screen time<br/>
-Burning out<br/>
-Distractions(especially while watching youtube tutorials)

### The Solution
**Introducing the mascots**:The mascots are there when you need them. They come up with:<br/>
-Infinite wellness reminders(per hr)<br/>
-Motivate you and keep up your spirit to complete the task(every 30 min)<br/>
-Stops you from doom-scrolling through youtube video when you have a task to complete<br/>
&nbsp;&nbsp;&nbsp;&nbsp;-Freezes the page for 15sec and sent warning msgs.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;-Every third warning providing choice to "disable warnings" and "keep reminding".<br/>

## Technical Details
### Technologies/Components Used
For Software:
- **Languages:** JavaScript, HTML, CSS  
- **Frameworks & APIs:** Chrome Extensions API  
- **Libraries:** None (Pure JavaScript!)  
- **Tools:** VS Code, GitHub, Chrome DevTools 


### Implementation
For Software:
# Installation
1.Clone the Repository:

    ```bash
    git clone https://github.com/your-username/mascot-reminder.git
    cd mascot-reminder

2.Load the Extension in Chrome:

    -Open Chrome and go to chrome://extensions/.
    -Enable Developer mode (toggle in the top right corner).
    -Click Load unpacked and select the mascot-reminder directory.

3.Set Your Task:

    -Click on the extension icon in the Chrome toolbar.
    -Enter your task in the input field and click Save Task.


### Project Documentation
For Software:

# Screenshots 
![Screenshot wellness-reminder](https://github.com/user-attachments/assets/87e4b346-3828-4751-9d0e-e12cb537ba13)
*An example of wellness reminders generated every hour*

![Screenshot warnings](https://github.com/user-attachments/assets/504e5a7e-d3e3-4f9c-8b56-73aca3cd4f10)
*Freezing the screen with grayscale for abou 15s with warnings*

![Screenshot encouragements](https://github.com/user-attachments/assets/c4c24573-0fa5-443f-a1e4-7859d8e16079)
hot2]
*Frequent Encouragements given for task provided*

![Screenshot warning](https://github.com/user-attachments/assets/091f19fe-04a6-407e-aceb-d18f42876a16)
enshot3](Add screenshot 3 here with proper name)
*Every 3rd warning when an off-topic video is opened, provides with a choice to "disable warning" or "continue with the warnings"*

# Diagrams
1. User Interaction<br/>
&nbsp;&nbsp;&nbsp;&nbsp;The user opens the extension popup by clicking the extension icon in the Chrome toolbar.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;The user enters their task in the input field and clicks Save Task.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;The task is saved to Chrome's local storage using chrome.storage.local.set.<br/>
2. Background Script (background.js)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;Listens for tab updates using chrome.tabs.onUpdated.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;When a YouTube video page (youtube.com/watch) is fully loaded (changeInfo.status === "complete"), the background script injects the content.js script into the page.<br/>
3. Content Script (content.js)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;Mascot Initialization:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Creates a div element for the mascot and positions it at the top-right corner of the page.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sets the mascot's icon using the ghosty.png image.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;Wellness Reminders:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays a random wellness message every hour using setInterval.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Messages include reminders to stretch, drink water, and take breaks.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;Encouragement Messages:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays a task-related encouragement message every 30 minutes.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Messages are fetched from Chrome's local storage and displayed in a speech bubble.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;Focus Reminders:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Monitors the currently playing YouTube video title using getYouTubeVideoTitle.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Checks if the video title matches the user's task using isVideoRelated.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If the video is unrelated:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pauses the video using video.pause().<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays a warning message in a speech bubble.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Adds a semi-transparent grey overlay to the video.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cycles through different warning messages every 30 seconds.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If the video is related, removes any existing warnings and resumes normal browsing.<br/>
4. Popup Interface (popup.html and popup.js)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;Task Input:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The user enters their task in the input field.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The task is saved to Chrome's local storage when the Save Task button is clicked.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;Task Display:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The saved task is displayed below the input field.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The task is retrieved from Chrome's local storage when the popup is opened.<br/>
5. Storage Management<br/>
&nbsp;&nbsp;&nbsp;&nbsp;The user's task is stored in Chrome's local storage using chrome.storage.local.set.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;The task is retrieved using chrome.storage.local.get and displayed in the popup and content script.<br/>
6. Error Handling<br/>
&nbsp;&nbsp;&nbsp;&nbsp;If the extension context is invalid (e.g., chrome.storage.local is unavailable), the extension logs a warning and skips encouragement messages.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;If the YouTube video title cannot be retrieved, the extension logs an error and skips focus reminders.<br/>


## Team Contributions
- All contributions: Varsha Sabu

---
Made with ❤️ at TinkerHub
