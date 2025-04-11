let isActive = false;
let tooltip = null;

// Function to create the tooltip
function createTooltip() {
    tooltip = document.createElement('div');
    tooltip.id = 'width-inspector-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px;
        border-radius: 4px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 12px;
        pointer-events: none;
        display: none;
    `;
    document.body.appendChild(tooltip);
}

// Function to calculate the nesting level
function getNestingLevel(element) {
    let level = 0;
    while (element.parentElement) {
        level++;
        element = element.parentElement;
    }
    return level;
}

// Function to get the outline style based on nesting level
function getOutlineStyle(level) {
    switch (level) {
        case 0: return '2px solid red';
        case 1: return '2px solid orange';
        case 2: return '2px solid yellow';
        case 3: return '2px solid lightgreen';
        case 4: return '2px solid blue';
        case 5: return '2px solid teal';
        case 6: return '2px solid darkcyan';
        default: return '2px solid mediumpurple';
    }
}

// Function to show tooltip
function showTooltip(event, element) {
    if (!isActive || !tooltip) return;
    
    const computedStyle = window.getComputedStyle(element);
    const nestingLevel = getNestingLevel(element);
    
    tooltip.innerHTML = `
        Element: <code>${element.tagName.toLowerCase()}</code><br>
        Width: ${computedStyle.width}<br>
        Max Width: ${computedStyle.maxWidth}<br>
        Min Width: ${computedStyle.minWidth}<br>
        Nesting Level: ${nestingLevel}
    `;
    
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
    tooltip.style.display = 'block';
    
    // Apply outline
    if (window.lastHighlightedElement) {
        window.lastHighlightedElement.style.outline = '';
    }
    element.style.outline = getOutlineStyle(nestingLevel);
    window.lastHighlightedElement = element;
}

// Function to hide tooltip
function hideTooltip() {
    if (tooltip) {
        tooltip.style.display = 'none';
    }
    if (window.lastHighlightedElement) {
        window.lastHighlightedElement.style.outline = '';
        window.lastHighlightedElement = null;
    }
}

// Initialize the tooltip
createTooltip();

// Event listeners
document.addEventListener('mouseover', function(event) {
    if (isActive) {
        showTooltip(event, event.target);
    }
});

document.addEventListener('mouseout', function() {
    if (isActive) {
        hideTooltip();
    }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggle') {
        isActive = message.isActive;
        if (!isActive) {
            hideTooltip();
        }
    }
});

// Get initial state from storage
chrome.storage.local.get(['isActive'], function(result) {
    isActive = result.isActive || false;
});