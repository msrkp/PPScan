const databaseUrl = chrome.extension.getURL("/database.csv");

/*  initialize */
// const found = new Set();
const found = {
    get() {
        return new Promise((resolve) => {
            return chrome.storage.local.get("found", ({ found }) => {
                resolve(found ? found : []);
            });
        });
    },
    add(obj) {
        return new Promise((resolve) => {
            this.get().then((res) => {
                if (!res || !res instanceof Array) {
                    res = [];
                }
                res.push(obj);
                chrome.storage.local.set({
                    found: res,
                });

                resolve(res.length);
            });
        });
    },
    clear() {
        chrome.storage.local.set({
            found: [],
        });
    },
};

setBadgeCount(0);

/* setup listeners */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    // found.add(msg);
    found.get().then((res) => {
        console.log(res);
        setBadgeCount(res.length);
    });
});

chrome.extension.onConnect.addListener((port) => {
    console.log("New Session ", port);
    if (port.name == "logger") {
        port.onMessage.addListener((msg) => {
            if (msg == "clearLog") {
                found.clear();
                setBadgeCount(0);
            }
            found.get().then((items) => {
                port.postMessage({
                    items,
                });
            });
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
            toggle: false,
        },
        () => {
            console.log("[*] Toggle: disabled");
        }
    );
    chrome.storage.sync.set({
            buster: false,
        },
        () => {
            console.log("[*] Buster: disabled");
        }
    );
    chrome.storage.sync.set({
            passive: true,
        },
        () => {
            console.log("[*] Passive: enabled");
        }
    );
});

chrome.storage.sync.get("toggle", ({ toggle }) => {
    if (toggle) {
        chrome.webRequest.onHeadersReceived.addListener(
            (response) => {
                response.forEach((header) => {
                    if (isCSPHeader(header)) {
                        header.value = `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; `;
                    }
                    if (isXFrameEnabled(header)) {
                        header.name = "foo";
                    }
                    if (isCached(header)) {
                        header.name = "foo";
                    }
                });
                return {
                    responseHeaders: header.responseHeaders,
                };
            }, {
                urls: ["<all_urls>"],
            }, ["blocking", "responseHeaders", "extraHeaders"]
        );
    }
});

chrome.storage.sync.get("passive", ({ passive }) => {
    if (passive) {
        updateDB();
    }
});