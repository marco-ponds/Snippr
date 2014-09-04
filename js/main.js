/*chrome.extension.onMessage.addListener(function(request, sender) {
	if (request.action == "getSource") {
		message.innerText = request.source.text;
	}
});*/

function startScan() {

	var message = document.querySelector('#message');
	message.innerText = "Injecting script..";

	chrome.tabs.executeScript(null, {
		file: "js/getSource.js"
	}, function() {
		// If you try and inject into an extensions page or the webstore/NTP you'll get an error
		if (chrome.extension.lastError) {
		message.innerText = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
		}
	});

}

function startPage() {
	$('.gui').css({'opacity':'1'});
	$('#scan-button').click(function() {
		startScan();
	});
}

window.onload = startPage;