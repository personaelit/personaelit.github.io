chrome.runtime.onInstalled.addListener(() => {
    console.log('Annotator installed! ' + Date.now());
  });
  
  chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { command: 'toggleSidebar' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message:', chrome.runtime.lastError.message);
      } else {
        console.log('Message sent, response:', response);
      }
    });
  });
  