var PAYLOADS = [ 
	// ['XSS Prototype #1',  'x[__proto__][e32a5ec9c99]', 'ddcb362f1d60', ],
	// ['XSS Prototype #2',  'x.__proto__.e32a5ec9c99','ddcb362f1d60', ],
	['XSS Prototype #3',  '__proto__[e32a5ec9c99]','ddcb362f1d60', ],
	['XSS Prototype #4',  '__proto__.e32a5ec9c99','ddcb362f1d60', ],
	// ['XSS Prototype #5',   '__proto__','{\"e32a5ec9c99\":\"e32a5ec9c99\"}'],
	// ['XSS Prototype #6',   '__proto__','{\"__proto__\":{\"e32a5ec9c99\":\"e32a5ec9c99\"}}']
];
window.addEventListener('message', function(event){
		if(event.data.url && event.data.foo=="bar"){
			chrome.storage.sync.get("buster",function(data){
  				if(data.buster){
  					var url = event.data.url;
  					console.log(url)
  					if(url.search("dummy")==-1 && window.name.search("ppdeadbeef1")==-1 ){ // avooiding recursion
						var locasdf = new URL(url);
						locasdf.searchParams.append('dummy','dummy')// avoiding recursion(twitter removes window.name)
						locasdf.hash ="#dummy"
						var a = window.open(locasdf.href,"ppdeadbeef1win");
						// a.blur();
  						
  					}
  				}
  				else{
					if(window.name.search("ppdeadbeef1")==-1){ // avoiding recurssion
						var url = event.data.url;
						for(i=0;i<PAYLOADS.length; i++){
							for(j = 0; j<2;j++){

								var locasdf = new URL(url);

								// debugger;
								var iframe = document.createElement("iframe");
								j?locasdf.searchParams.append(PAYLOADS[i][1],PAYLOADS[i][2]):locasdf.hash="#"+PAYLOADS[i][1]+"="+PAYLOADS[i][2];
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
