var port = chrome.extension.connect({
	name: "logger"
});
port.onDisconnect.addListener(obj => {
	console.log('disconnected port');
})

function logger(){
	chrome.storage.sync.get("toggle",function(data){
			document.getElementById("toggle").value = data.toggle?"Disable":"Enable";
	});
	chrome.storage.sync.get("buster",function(data){
			document.getElementById("buster").value = data.buster?"Disable Window Mode":"Enable Window Mode";
	});
	document.getElementById("toggle").onclick = function(){
		chrome.storage.sync.get("toggle",function(data){
            if(data.toggle){
                chrome.storage.sync.set({ "toggle": false });
                document.getElementById("toggle").value = "Enable";
            }
            else{
                chrome.storage.sync.set({ "toggle": true });
                document.getElementById("toggle").value = "Disable";
            }
        });
	}
	document.getElementById("buster").onclick = function(){
		chrome.storage.sync.get("buster",function(data){
            if(data.buster){
                chrome.storage.sync.set({ "buster": false });
                document.getElementById("buster").value = "Enable Window Mode";
            }
            else{
                chrome.storage.sync.set({ "buster": true });
                document.getElementById("buster").value = "Disable Window Mode";
            }
        });
	}

	port.postMessage('send found urls');
	console.log('send');
	port.onMessage.addListener(function(found){
		listFound(found.found);
	})


}

window.onload = logger

function listFound(found){
	 	var x = document.getElementById("list")
		for(i = 0; i < found.length;i++){
			var li = document.createElement("li");
			var url = document.createElement("b");
			url.innerText  = found[i];
			li.appendChild(url)
			x.appendChild(li);
		}

}