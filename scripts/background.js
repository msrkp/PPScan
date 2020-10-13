
var found = new Set();

function setNum(len) {
      chrome.browserAction.setBadgeText({"text": ''+len});
      if(len > 0) {
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255]});
      } else {
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 255, 0] });
      }
}



chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    console.log(msg);
    found.add(msg);
    setNum(found.size);
});



chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    console.log(found);
    port.postMessage({found:[...found]});
  });
})