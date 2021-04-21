const request = indexedDB.open('report', 2);
let db;

const PASV_STORE = 'pasv_report';

request.onupgradeneeded = (event) => {
    db = request.result;

    const pasv_store = db.createObjectStore(PASV_STORE, { keyPath: "index", autoIncrement: true });

    pasv_store.createIndex("initiator", "initiator", { unique: false });
    pasv_store.createIndex("type", "type", { unique: false });
    pasv_store.createIndex("file", "file", { unique: false });
    pasv_store.createIndex("linecol", "linecol", { unique: false });
    pasv_store.createIndex("updated_at", "updated_at", { unique: false });
    pasv_store.createIndex("signature", ["type", "file", "linecol"], { unique: true });
    // pasv_store.createIndex("checked", "checked", { unique: false });

};

request.onsuccess = (event) => {
    db = request.result;
};

request.onerror = (event) => {
    console.log('indexDB error', event);
};

const selectByIndex = (store_name, index, offset) => {
    const store = db.transaction([store_name], 'readonly').objectStore(store_name);
    const request = store.getAll(IDBKeyRange.bound(index, index + offset - 1));

    request.onsuccess = () => {
        console.log(request.result);
    }
};

const InsertQuery = (store_name, data) => {
    return new Promise((resolve) => {
        const store = db.transaction([store_name], 'readwrite').objectStore(store_name);

        data = data instanceof Array ? data : [data];

        data.forEach((element) => {
            const index = store.index('signature');
            const range = IDBKeyRange.only([element.type, element.file, element.linecol]);

            const cursor = index.openCursor(range);
            cursor.onsuccess = (event) => {
                if (event.target.result !== null) {
                    console.log('Already Exists ', element);
                    return;
                }
                store.add(element);
            }

        });

        const req = store.count();

        req.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
};