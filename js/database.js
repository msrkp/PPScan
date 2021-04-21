const request = indexedDB.open('report', 3);
let db;

const PASV_STORE = 'pasv_report';
const ACTV_STORE = 'actv_report';

request.onupgradeneeded = (event) => {
    db = request.result;

    const pasv_store = db.createObjectStore(PASV_STORE, { keyPath: "index", autoIncrement: true });

    pasv_store.createIndex("initiator", "initiator", { unique: false });
    pasv_store.createIndex("type", "type", { unique: false });
    pasv_store.createIndex("file", "file", { unique: false });
    pasv_store.createIndex("linecol", "linecol", { unique: false });
    pasv_store.createIndex("updated_at", "updated_at", { unique: false });
    pasv_store.createIndex("checked", "checked", { unique: false });

    pasv_store.createIndex("signature", ["type", "file", "linecol"], { unique: true });

    const actv_store = db.createObjectStore(ACTV_STORE, { keyPath: "index", autoIncrement: true });

    actv_store.createIndex("initiator", "initiator", { unique: false });
    actv_store.createIndex("type", "type", { unique: false });
    actv_store.createIndex("link", "link", { unique: false });
    actv_store.createIndex("updated_at", "updated_at", { unique: false });
    actv_store.createIndex("checked", "checked", { unique: false });
};

request.onerror = (event) => {
    console.log('indexDB error', event);
};

request.onsuccess = (event) => {
    db = request.result;
};

const setBadgeCount = (len) => {
    if (len != 0) {
        chrome.browserAction.setBadgeText({ text: "" + len });
        chrome.browserAction.setBadgeBackgroundColor({ color: "#f00" });
    } else {
        chrome.browserAction.setBadgeText({ text: "" });
    }
};

const selectByLimit = (store_name, limit) => {
    return new Promise((resolve) => {
        const store = db.transaction([store_name], 'readonly').objectStore(store_name);
        const result = [];

        store.openCursor(null, 'prev').onsuccess = (event) => {
            const cursor = event.target.result;

            if (cursor === null || result.length >= limit) {
                return resolve(result);
            }

            result.push(cursor.value);
            cursor.continue();
        }
    });
};

const selectByIndex = (store_name, index, limit) => {
    return new Promise((resolve) => {
        const store = db.transaction([store_name], 'readonly').objectStore(store_name);
        const result = [];

        store.openCursor(IDBKeyRange.bound(index, index + limit - 1), 'prev').onsuccess = (event) => {
            const cursor = event.target.result;

            if (cursor === null) {
                return resolve(result);
            }

            result.push(cursor.value);
            cursor.continue();
        }
    });
};

const InsertOne = (store_name, data) => {
    return new Promise((resolve) => {
        const store = db.transaction([store_name], 'readwrite').objectStore(store_name);
        const index = store.index('signature');
        const range = IDBKeyRange.only([data.type, data.file, data.linecol]);

        index.openCursor(range).onsuccess = (event) => {
            if (event.target.result !== null) {
                console.warn('Already Exists ', data);
                return resolve();
            } else {
                store.add(data).onsuccess = () => {
                    return resolve();
                }
            }
        }
    });
};

const queryNewCount = (store_name) => {
    return new Promise((resolve) => {
        const store = db.transaction([store_name], 'readonly').objectStore(store_name);
        const index = store.index('checked');

        index.count(IDBKeyRange.only(0)).onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
};

const updateToChecked = (store_name) => {
    return new Promise((resolve) => {
        const store = db.transaction([store_name], 'readwrite').objectStore(store_name);
        const index = store.index('checked');
        const range = IDBKeyRange.only(0);
        let count = 0;

        index.openCursor(range).onsuccess = (event) => {
            const cursor = event.target.result;

            if (cursor === null) {
                return resolve(count);
            }

            const updateData = cursor.value;
            updateData.checked = 1;
            count++;

            cursor.update(updateData);
            cursor.continue();
        };
    });
};

const updateBadgeCount = (store_name) => {
    queryNewCount(store_name).then(result => {
        setBadgeCount(result);
    });
};