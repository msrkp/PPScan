chrome.storage.sync.get("toggle",function(data){
    if(data.toggle){
		var inject = function check(){
			var logger = function(found) {
				var asdf = new CustomEvent('PPLog', {'detail':found});
				document.dispatchEvent(asdf);
			};

			window.onload = function(){
				if((Object.prototype.e32a5ec9c99 == "ddcb362f1d60")){
						console.log(`%c--------------------Found one------------------\n${location.href}`, `color:red`);
						logger(location.href);
				}

				var timerID = setInterval(function() {
					if((Object.prototype.e32a5ec9c99 == "ddcb362f1d60")){
						console.log(`%c--------------------Found one------------------\n${location.href}`, `color:red`);
						logger(location.href);
						clearInterval(timerID);
					}	
				}, 30 * 1000); 
				
				
			}
		}
		if(window.name.search("ppdeadbeef")==-1){
			var iframe = document.createElement('iframe');
			iframe.addEventListener('load', () => {
				iframe.contentWindow.postMessage({
					url: location.href
				},'*');

			},false);
			iframe.src = chrome.runtime.getURL('/pages/iframe.html');
			iframe.name = "ppdeadbeef";
			iframe.id  = "ppbada55";
			document.body.appendChild(iframe);
		}

		document.addEventListener('PPLog', function(event) {
			chrome.runtime.sendMessage(event.detail);
		});

		inject = '(' + inject + ')()';
		var script = document.createElement("script");
		script.setAttribute('type', 'text/javascript')
		script.appendChild(document.createTextNode(inject));
		document.documentElement.appendChild(script);
	}
	else{
		console.log('disabled');
	}

});

