var port = chrome.extension.connect({
    name: "logger"
});


function logger() {
    chrome.storage.sync.get("toggle", function(data) {
        document.getElementById("toggle").value = data.toggle ? "Disable Active Mode" : "Enable Active Mode";
    });
    chrome.storage.sync.get("buster", function(data) {
        document.getElementById("buster").value = data.buster ? "Disable Window Mode" : "Enable Window Mode";
    });
    chrome.storage.sync.get("passive", function(data) {
        document.getElementById("passive").value = data.passive ? "Disable Passive Mode" : "Enable Passive Mode";
    });
    document.getElementById("toggle").onclick = function() {
        chrome.storage.sync.get("toggle", function(data) {
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
    document.getElementById("buster").onclick = function() {
        chrome.storage.sync.get("buster", function(data) {
            if (data.buster) {
                chrome.storage.sync.set({ "buster": false });
                document.getElementById("buster").value = "Enable Window Mode";
            } else {
                chrome.storage.sync.set({ "buster": true });
                document.getElementById("buster").value = "Disable Window Mode";
            }
        });
    }

    document.getElementById("passive").onclick = function() {
        chrome.storage.sync.get("passive", function(data) {
            if (data.passive) {
                chrome.storage.sync.set({ "passive": false });
                document.getElementById("passive").value = "Enable Passive Mode";
            } else {
                chrome.storage.sync.set({ "passive": true });
                document.getElementById("passive").value = "Disable Passive Mode";
            }
        });
    }

    document.getElementById("brute").onclick = function() {
        chrome.tabs.executeScript(null, {
            code: `document.dispatchEvent(new CustomEvent('TriggerBrute'));`
        });
    }

    document.getElementById("brutehash").onclick = function() {
        chrome.tabs.executeScript(null, {
            code: `document.dispatchEvent(new CustomEvent('TriggerBruteHash'));`
        });
    }

    document.getElementById("clear").onclick = function() {
        port.postMessage('clearLog');
    }

    port.postMessage('send found urls');

    port.onMessage.addListener(function(found) {
        listFound(found.found);
    });


}

window.onload = logger

const foundLabel = document.getElementById('found-label');
const foundList = document.getElementById('found-list');

function listFound(found) {
    // foundList.innerHTML = '';
    foundLabel.style.display = foundList.style.display = found.length > 0 ? 'block' : 'none';

    found.forEach((str) => {
        const line = JSON.parse(str)
        const tr = document.createElement("tr");
        tr.innerHTML = `<td><a target="_blank" href="${line['domain']}">${new URL(line['domain']).hostname}</a></td><td>${line['type']}</td><td><a target="_blank" href="${line['file']}">${line['file']}:${line['lineCol']}</a></td>`;
        foundList.appendChild(tr);
    });
}