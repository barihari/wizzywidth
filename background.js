// Initialize the extension state
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ isActive: false });
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    chrome.storage.local.get(['isActive'], function(result) {
        const newState = !result.isActive;
        chrome.storage.local.set({ isActive: newState }, function() {
            // Send message to content script
            chrome.tabs.sendMessage(tab.id, { 
                action: 'toggle', 
                isActive: newState 
            });
        });
    });
});