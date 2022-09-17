const databaseUrl = chrome.extension.getURL('/database.csv');

/*  initialize */
const found = new Set();

setBadgeCount(0);

/* setup listeners */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    sourceUrl = new URL(msg);
    found.add(JSON.stringify({ domain: sourceUrl.origin, type: 'Active Mode', file: sourceUrl.href, lineCol: 0 }));
    setBadgeCount(found.size);
});

chrome.extension.onConnect.addListener((port) => {
    console.log('[>] New Session ', port);
    if (port.name == "logger") {
        port.onMessage.addListener((msg) => {
            if (msg == 'clearLog') {
                found.clear();
                setBadgeCount(0);
            }
            port.postMessage({ found: [...found] });
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ toggle: false }, () => {
        console.log('[*] Toggle: disabled');
    });
    chrome.storage.sync.set({ buster: false }, () => {
        console.log('[*] Buster: disabled');
    });
    chrome.storage.sync.set({ passive: true }, () => {
        console.log('[*] Passive: enabled');
    });
});

chrome.storage.sync.get("toggle", ({ toggle }) => {
    if (toggle) {
        chrome.webRequest.onHeadersReceived.addListener((response) => {
            response.responseHeaders.forEach(header => {
                if (isCSPHeader(header)) {
                    header.value = `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; `;
                };
                if (isXFrameEnabled(header)) {
                    header.name = 'foo';
                };
                if (isCached(header)) {
                    header.name = 'foo';
                };
            });
            return {
                responseHeaders: response.responseHeaders,
            };
        }, {
            urls: ['<all_urls>']
        }, ['blocking', 'responseHeaders', 'extraHeaders']);
    }
});

chrome.storage.sync.get("passive", ({ passive }) => {
    if (passive) { updateDB(); }
});
