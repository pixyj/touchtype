//View

function TouchView() {
	this.textDiv = document.getElementById("text-div");
	this.currColor = "blue";
	this.touch = document.getElementById("touch");
}

TouchView.prototype.setBoldWord = function(words,index) {
	var l = words.length;
	var display = "";
	for(var i=0;i<l;i++) {
		if(i==index) {
			display += "<span style=\"color:"+this.currColor+"\";>" + words[i] + "</span>";
		}
		else {
			display += words[i] + " ";
		}
	}
	this.textDiv.innerHTML = display;	
}

TouchView.prototype.setCaretPosition = function(pos){

	var target = this.touch;
	if(target.setSelectionRange)
	{
		target.focus();
		target.setSelectionRange(pos,pos);
	}

	else if (target.createTextRange) {
		var range = target.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}

}

TouchView.prototype.resetTouchInput = function() {
    this.touch.value = "";
    this.notifyTouchError(false);
    this.setCaretPosition(0);
}

TouchView.prototype.getTouchedValue = function() {
	return this.touch.value;
}

TouchView.prototype.setTouchedValue = function(val) {
	this.touch.value = val;
	this.setCaretPosition(val.length);
}

TouchView.prototype.notifyTouchError = function(error) {
        var color = error === true ? 'red' : 'white';
        $('#touch').css('background-color',color);
}

TouchView.prototype.setTypeData = function(text) {
	this.textDiv.innerText = text;	
}

/////////////////////////////////////////////////////////
//  Tab stuff
/////////////////////////////////////////////////////////
TouchView.prototype.showLevelContent = function(data) {
    $('#content-div').text(data.content);    
}

TouchView.prototype.updateStats = function(allStats) {
    var html = "<tr><td>Level</td><td>Lines Typed</td><td>Average Accuracy</td><td>Average Speed</td></tr>";
    for(var i=0;i<allStats.length;i++) {
        var levelStats = allStats[i];
        html += "<tr>";
        for(var k in levelStats) {
            if(levelStats.hasOwnProperty(k)) {
                html += "<td>" + levelStats[k] + "</td>";
            }
        }
        html += "</tr>";
    }
    document.getElementById("stats-table").innerHTML = html;
}

///////////////////////////////////////////////////////
// End of Tab stuff
///////////////////////////////////////////////////////


TouchView.prototype.showLineStats = function(data) {
    $('#speed_msg').text(data.speed);
    $('#accuracy_msg').text(data.accuracy*100);
    console.log(data);
    
}
