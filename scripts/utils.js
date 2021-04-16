const blacklist = [
    'https://www.googleadservices.com/pagead/conversion_async.js'
];

let database = [];

const patternMatch = (response, database) => {
    const result = [];
    const matches = [];

    database.forEach((pattern) => {
        const { name, type, chunk } = pattern;

        switch (type) {
            case 'regex':
                const re = new RegExp(atob(chunk));
                const match = re.exec(response);

                if (match) {
                    result.push(name);
                    matches.push(match);
                };
                break;
            case 'text':
                const position = response.indexOf(chunk);

                if (position != -1) {
                    result.push(name);
                    matches.push({ index: position });
                };
                break;
        }
    });

    return [result, matches];
};

const downloadDb = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url).then(
                response => response.text()
            ).then(res => {
                const ret = res.split('\n').map(line => {
                    const [name, type, chunk] = line.split('|', 3);
                    return { name, type, chunk };
                });
                resolve(ret);
            })
            .catch(err => {
                console.log(err);
                reject(new Error('Error downloading ' + url))
            })
    });
};

const download = (url) => {
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
};

const check = ({ requestUri, initiator }) => {
    const url = new URL(requestUri);

    if (blacklist.indexOf(url.origin + url.pathname) != -1) {
        return;
    };
    if (!url.hostname || !url.pathname) {
        return;
    };
    if (url.protocol == "http:" || url.protocol == "https:") {
        download(url).then(res => {
            const [result, match] = patternMatch(res, database);

            result.forEach((name, i) => {
                found.add(`[${name}] ${initiator}\n${requestUri}:${match[i].index}`)
                setBadgeCount(found.size);
            });
        })
    }
};

const filter = {
    urls: ["<all_urls>"],
    types: ["script"]
};

const scan = ({ method, url, initiator }) => {
    if (method == "GET") {
        check({ requestUri: url, initiator });
    }
};

const updateDB = () => {
    if (!database.length) {
        downloadDb(databaseUrl).then((_database) => {
            database = _database;
            chrome.webRequest.onCompleted.addListener(scan, filter, []);
        }).catch(e => console.log(e));
    }
};

const setBadgeCount = (len) => {
    chrome.browserAction.setBadgeText({ "text": '' + len });
    chrome.browserAction.setBadgeBackgroundColor({ color: len > 0 ? [255, 0, 0, 255] : [0, 0, 255, 0] });

    return;
};

const maybeSame = (a, b) => {
    return a.touppercase().trim() == b.touppercase().trim();
};

const isCSPHeader = ({ header: name }) => {
    console.log(name);
    return maybeSame(name, 'Content-Security-Policy');
};

const isXFrameEnabled = ({ header: name }) => {
    return maybeSame(name, 'X-Frame-Options');
};

const isCached = ({ header: name }) => {
    return maybeSame(name, 'If-None-Match');
};