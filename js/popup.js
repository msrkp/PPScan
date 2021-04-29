var port = chrome.extension.connect({
    name: "logger"
});

var currentHost;

chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
    function(tabs) {
        currentHost = new URL(tabs[0].url).hostname;
    }
);

window.onload = () => {
    chrome.storage.sync.get("toggle", (data) => {
        document.getElementById("toggle").value = data.toggle ? "Disable Active Mode" : "Enable Active Mode";
    });
    chrome.storage.sync.get("buster", (data) => {
        document.getElementById("buster").value = data.buster ? "Disable Window Mode" : "Enable Window Mode";
    });
    chrome.storage.sync.get("passive", (data) => {
        document.getElementById("passive").value = data.passive ? "Disable Passive Mode" : "Enable Passive Mode";
    });
    document.getElementById("toggle").onclick = () => {
        chrome.storage.sync.get("toggle", (data) => {
            if (data.toggle) {
                chrome.storage.sync.set({ "toggle": false });
                chrome.storage.sync.set({ "buster": false });
                document.getElementById("toggle").value = "Enable Active Mode";
                document.getElementById("buster").style.display = "none";
            } else {
                chrome.storage.sync.set({ "toggle": true });
                document.getElementById("buster").style.display = "block";
                document.getElementById("toggle").value = "Disable Active Mode";
            }
        });
    }
    document.getElementById("buster").onclick = () => {
        chrome.storage.sync.get("buster", (data) => {
            if (data.buster) {
                chrome.storage.sync.set({ "buster": false });
                document.getElementById("buster").value = "Enable Window Mode";
            } else {
                chrome.storage.sync.set({ "buster": true });
                document.getElementById("buster").value = "Disable Window Mode";
            }
        });
    }

    document.getElementById("passive").onclick = () => {
        chrome.storage.sync.get("passive", (data) => {
            if (data.passive) {
                chrome.storage.sync.set({ "passive": false });
                document.getElementById("passive").value = "Enable Passive Mode";
            } else {
                chrome.storage.sync.set({ "passive": true });
                document.getElementById("passive").value = "Disable Passive Mode";
            }
        });
    }

    document.getElementById("brute").onclick = () => {
        chrome.tabs.executeScript(null, {
            code: `document.dispatchEvent(new CustomEvent('TriggerBrute'));`
        });
    }

    document.getElementById("brutehash").onclick = () => {
        chrome.tabs.executeScript(null, {
            code: `document.dispatchEvent(new CustomEvent('TriggerBruteHash'));`
        });
    }

    document.getElementById("clear").onclick = () => {
        port.postMessage('clearLog');
    }
}

const table = document.getElementById('found-list');

request.onsuccess = (event) => {
    db = request.result;

    selectByLimit(PASV_STORE, 1000)
        .then(items => {
            items.sort(item => {
                var hostname = new URL(item['initiator']).hostname;
                if (hostname == currentHost) {
                    return -1;
                } else {
                    return 1;
                }
            });
            items.forEach((element) => {
                var tr = document.createElement("tr");

                var hostname = new URL(element['initiator']).hostname;
                if (hostname == currentHost) {
                    element.index = '-';
                }

                var td = document.createElement("td");
                td.innerText = element.index;
                tr.appendChild(td);

                var td = document.createElement("td");
                var anchor = document.createElement("a");
                anchor.target = '_blank';
                anchor.href = element.initiator;
                anchor.innerText = new URL(element['initiator']).hostname;
                td.appendChild(anchor);
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerText = element.type;
                tr.appendChild(td);

                var td = document.createElement("td");
                var anchor = document.createElement("a");
                anchor.target = '_blank';
                anchor.href = element['file'];
                anchor.innerText = element['file'] + ':' + element['linecol'];
                td.appendChild(anchor);
                tr.appendChild(td);

                table.appendChild(tr);
            });
        });

    updateToChecked(PASV_STORE)
        .then(() => {
            updateBadgeCount(PASV_STORE);
        });
};