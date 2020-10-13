var port = chrome.extension.connect({
	name: "logger"
});

function logger(){
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