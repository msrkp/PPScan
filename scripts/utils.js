const DEBUG = false;

const blacklist = [
    "https://www.google.com/pagead/conversion_async.js:19:76",
    "https://www.google.com/pagead/conversion.js:28:76",
    "https://www.googleadservices.com/pagead/conversion_async.js:19:76",
    "https://www.googleadservices.com/pagead/conversion.js:28:76",
    "https://fast.wistia.com/assets/external/E-v1.js", // not vulnerable
];

let database = [];

const patternMatch = (response, database) => {
    const result = [];
    const matches = [];

    database.forEach((pattern) => {
        const { name, type, chunk } = pattern;

        switch (type) {
            case "regex":
                const re = new RegExp(chunk, "i");
                const match = re.exec(response);

                if (match) {
                    result.push(name);
                    matches.push(match);
                }
                break;
            case "text":
                const position = response.indexOf(chunk);

                if (position != -1) {
                    result.push(name);
                    matches.push({ index: position });
                }
                break;
        }
    });

    return [result, matches];
};

const fetchDB = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => response.text())
            .then((res) => {
                const ret = res
                    .split("\n")
                    .map((line) => {
                        line = line.trim();
                        if (line.startsWith("#") || line == "") {
                            return;
                        }

                        let data = line.split("|");
                        let name, type, chunk;

                        name = data[0].trim();
                        type = data[1].trim();
                        chunk = data.slice(2).join("|").trim();

                        return { name, type, chunk };
                    })
                    .filter((notnull) => notnull);

                resolve(ret);
            })
            .catch((err) => {
                console.log(err);
                reject(new Error("Error downloading " + url));
            });
    });
};

const download = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => response.text())
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(new Error("Error downloading " + url));
            });
    });
};

const checkResource = ({ requestUri, initiator }) => {
    if (DEBUG) {
        console.log(`[%] ${requestUri}`);
    }

    const url = new URL(requestUri);

    if (blacklist.indexOf(url.hostname + url.pathname) != -1) {
        return;
    }
    if (!url.hostname || !url.pathname) {
        return;
    }
    if (url.protocol == "http:" || url.protocol == "https:") {
        download(url).then((res) => {
            const [result, match] = patternMatch(res, database);

            result.forEach((name, i) => {
                const preChunk = res.substr(0, match[i].index).split(/\n/);
                const line = preChunk.length;
                const column = preChunk[preChunk.length - 1].length;
                const linecol = `${line}:${column}`;

                if (blacklist.indexOf(requestUri + ":" + linecol) != -1) {
                    return;
                }

                InsertQuery(PASV_STORE, { initiator, type: name, file: requestUri, linecol, updated_at: Date.now(), checked: false })
                    .then(count => {
                        setBadgeCount(count);
                    });
            });
        });
    }
};

const filter = {
    urls: ["<all_urls>"],
    types: ["script"],
};

const scan = ({ method, url, initiator }) => {
    // if (method == "GET") {
    checkResource({ requestUri: url, initiator });
    // }
};

const updateDB = () => {
    if (!database.length) {
        fetchDB(databaseUrl)
            .then((_database) => {
                database = _database;
                chrome.webRequest.onCompleted.addListener(scan, filter, []);
            })
            .catch((e) => console.log(e));
    }
};

const setBadgeCount = (len) => {
    if (len != 0) {
        chrome.browserAction.setBadgeText({ text: "" + len });
        chrome.browserAction.setBadgeBackgroundColor({ color: "#f00" });
    } else {
        chrome.browserAction.setBadgeText({ text: "" });
    }
};

const maybeSame = (a, b) => {
    return a.touppercase().trim() == b.touppercase().trim();
};

const isCSPHeader = ({ header: name }) => {
    return maybeSame(name, "Content-Security-Policy");
};

const isXFrameEnabled = ({ header: name }) => {
    return maybeSame(name, "X-Frame-Options");
};

const isCached = ({ header: name }) => {
    return maybeSame(name, "If-None-Match");
};