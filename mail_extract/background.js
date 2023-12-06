// background.js
chrome.runtime.onMessage.addListener((message, sender, callback) => {
    if (message.action === "getPageContent") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let tabId = tabs[0].id;
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: fetchMailContentAndRedirect,
          args: []
        }, (injectionResults) => {
          for (let frameResult of injectionResults) {
            callback(frameResult.result);
          }
        });
      });
      return true;
    }
  });
  
  function fetchMailContentAndRedirect() {
    let h2Text = document.querySelector('h2.hP');
    let divText = document.querySelector('div.a3s.aiL');
  
    let result = {
      combinedText: "",
    };
  
    // Combine h2.hP and div.a3s.aiL text
    if (h2Text) {
      result.combinedText += h2Text.textContent.trim();
    }
  
    if (divText) {
      result.combinedText += " " + divText.textContent.trim();
    }
  
    // Update popup with the extracted content
    chrome.runtime.sendMessage({ action: "updatePopup", result: result });
  
    return result;
  }
  