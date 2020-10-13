window.addEventListener('message', function(event){


		if(event.data.url){
			console.log(event.data.url);
			var PAYLOADS = [ 
				// ['XSS Prototype #1',  'x[__proto__][e32a5ec9c99]', 'ddcb362f1d60', ],
				// ['XSS Prototype #2',  'x.__proto__.e32a5ec9c99','ddcb362f1d60', ],
				['XSS Prototype #3',  '__proto__[e32a5ec9c99]','ddcb362f1d60', ],
				['XSS Prototype #4',  '__proto__.e32a5ec9c99','ddcb362f1d60', ],
				// ['XSS Prototype #5',   '__proto__','{\"e32a5ec9c99\":\"e32a5ec9c99\"}'],
				// ['XSS Prototype #6',   '__proto__','{\"__proto__\":{\"e32a5ec9c99\":\"e32a5ec9c99\"}}']
			];
			if(window.name.search("ppdeadbeef1")==-1){ // avoiding recurssion
				var url = event.data.url;
				for(i=0;i<PAYLOADS.length; i++){
					for(j = 0; j<2;j++){
						var loc = new URL(url);
						var iframe = document.createElement("iframe");
						j?loc.searchParams.append(PAYLOADS[i][1],PAYLOADS[i][2]):loc.hash="#"+PAYLOADS[i][1]+"="+PAYLOADS[i][2];
						iframe.name = "ppdeadbeef1"
						iframe.src = loc.href;
						document.documentElement.appendChild(iframe);
					}
				}	
			}
		}
		else{
			console.log(event.data);
		}

	});