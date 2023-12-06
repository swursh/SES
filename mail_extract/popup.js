// popup.js
chrome.runtime.sendMessage({ action: "getPageContent" }); // Trigger the script execution

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "updatePopup") {
    let combinedTextArea = document.getElementById('combinedText');

    // Remove line breaks, tabs, and normalize spaces
    let combinedTextContent = message.result.combinedText.replace(/[\n\t]/g, '').replace(/\s+/g, ' ').trim();

    combinedTextArea.textContent = combinedTextContent;
  }
});
