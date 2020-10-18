



var found = new Set();

function setNum(len) {
      chrome.browserAction.setBadgeText({"text": ''+len});
      if(len > 0) {
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255]});
      } else {
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 255, 0] });
      }
}
function isCSPHeader(headerName) {
  return (headerName === 'CONTENT-SECURITY-POLICY');
}

function isXFrame(headerName) {
  return (headerName === 'X-FRAME-OPTIONS');
}

function isCaching(headerName){
  return (headerName === 'If-None-Match')
}

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({toggle: true}, function() {
      console.log('toggle on');
    });
    chrome.storage.sync.set({buster: false}, function() {
      console.log('window mode off');
    });
});
chrome.storage.sync.get("toggle",function(data){
  if(data.toggle){


    // Listens on new request
    chrome.webRequest.onHeadersReceived.addListener((details) => {
      for (let i = 0; i < details.responseHeaders.length; i += 1) {
        if (isCSPHeader(details.responseHeaders[i].name.toUpperCase())) {
          const csp = 'default-src * \'unsafe-inline\' \'unsafe-eval\' data: blob:; ';
          details.responseHeaders[i].value = csp;
        }
        if(isXFrame(details.responseHeaders[i].name.toUpperCase())){
          details.responseHeaders[i].name ='foo';
          
        }
        if(isCaching(details.responseHeaders[i].name.toUpperCase())){
          details.responseHeaders[i].name ='foo';
          
        }
      }
      return { // Return the new HTTP header
        responseHeaders: details.responseHeaders,
      };
    }, {
      urls: ['<all_urls>']
    }, ['blocking', 'responseHeaders','extraHeaders']);


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

  }
    
});