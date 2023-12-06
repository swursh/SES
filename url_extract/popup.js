// popup.js
chrome.runtime.sendMessage({ action: "getPageSource" }); // Trigger the script execution

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "updatePopup") {
    let scriptsTextArea = document.getElementById('scripts');
    if (message.resultText) {
      scriptsTextArea.value = message.resultText;
    } else {
      scriptsTextArea.value = "Matching text not found.";
    }
  }
});