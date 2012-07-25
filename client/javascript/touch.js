
//quick fix
//removed!

$(document).ready(function() {
	touchApp = new TouchApp();
        t = touchApp.touchData;	
        $('#tabs').tabs();
});

$("#touch").keypress(function(evt) {
	evt.preventDefault();
	touchApp.touchData.touchType.handleKeyPress(evt.which);
});


$("#touch").keydown(function(evt) {
	touchApp.touchData.touchType.handleBackSpace(evt);
});

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}



