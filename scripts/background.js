const dbUrl = "https://raw.githubusercontent.com/msrkp/PPScan/main/db.json";
var passiveFound = {}
var db;
var found = new Set();

var download = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url).then(
                response => response.text()
            ).then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(new Error('Error downloading ' + url))
            })
    });
}

var downloadDb = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url).then(
                response => response.json()
            ).then(data => {
                db = data;
                resolve('success');
            })
            .catch(err => {
                reject(new Error('Error downloading ' + url))
            })
    });
}

var check = (req) => {
    var url = new URL(req.url);
    if (url.protocol == "http:" || url.protocol == "https:") {
        download(url).then(resp => {
            var tmp = patternMatch(resp, db);
            if (tmp.length > 0) {
                console.log(req, req["initiator"]);
                found.add("Script from " + new URL(req["url"]).origin + " using " + tmp + " at " + req["initiator"] + " is vulnerable!")
                setNum(found.size);
                return;
            }
        })
    }

}



function setNum(len) {
    chrome.browserAction.setBadgeText({ "text": '' + len });
    if (len > 0) {
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
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

function isCaching(headerName) {
    return (headerName === 'IF-NONE-MATCH');
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    console.log(msg);
    found.add(msg);
    setNum(found.size);
});

chrome.extension.onConnect.addListener(function(port) {
    console.log('connected ', port);
    if (port.name == "logger") {
        port.onMessage.addListener(function(msg) {
            console.log(msg)
            console.log(found);
            port.postMessage({ found: [...found] });
        });
    }
});

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({ toggle: false }, function() {
        console.log('toggle off');
    });
    chrome.storage.sync.set({ buster: false }, function() {
        console.log('window mode off');
    });
    chrome.storage.sync.set({ passive: true }, function() {
        console.log('passive mode on');
    });
});
chrome.storage.sync.get("toggle", function(data) {
    if (data.toggle) {


        // Listens on new request
        chrome.webRequest.onHeadersReceived.addListener((details) => {
            for (let i = 0; i < details.responseHeaders.length; i += 1) {
                if (isCSPHeader(details.responseHeaders[i].name.toUpperCase())) {
                    const csp = 'default-src * \'unsafe-inline\' \'unsafe-eval\' data: blob:; ';
                    details.responseHeaders[i].value = csp;
                }
                if (isXFrame(details.responseHeaders[i].name.toUpperCase())) {
                    details.responseHeaders[i].name = 'foo';

                }
                if (isCaching(details.responseHeaders[i].name.toUpperCase())) {
                    details.responseHeaders[i].name = 'foo';

                }
            }
            return { // Return the new HTTP header
                responseHeaders: details.responseHeaders,
            };
        }, {
            urls: ['<all_urls>']
        }, ['blocking', 'responseHeaders', 'extraHeaders']);

    }

});

chrome.storage.sync.get("passive", function(data) {
    if (data.passive) {
        downloadDb(dbUrl).then(() => {
                var filter = {
                    urls: ["<all_urls>"],
                    types: ["script"]
                };
                var scan = (req) => {
                    if (req.method == "GET") {
                        check(req);
                    }
                }

                chrome.webRequest.onCompleted.addListener(scan, filter, []);
            })
            .catch(e => console.log(e));
    }
});