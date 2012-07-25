function TouchType(view,cb) {

	//This is set only once(not reset) assuming view params don't change
	this.touchView = view;
	this.cb = cb;
        
	
	//this.setData(text);
	
	this.resetTypedWord = function() {
		this.typedWord = "";
	}
	
}

TouchType.prototype.TypeData = function() {
	var obj = {};
	obj.accuracy = 0;
	obj.startTime = undefined;
	obj.speed = undefined;
	return obj;
}

TouchType.prototype.resetData = function() {
	this.text = "";
	this.words = undefined;
	this.index = 0;
	this.typedWord = "";
	this.errors = 0;
	this.startTime = undefined;
	this.typeData = undefined;
}

TouchType.prototype.setData = function(text) {
    
        
        this.resetData();
        this.resetting = true; //needed to switch off listening to key press
	this.text = text;
	this.words = this.text.split(" ");
	var i = 0;
	for(i=0;i<this.words.length;i++) {
		this.words[i] += " ";
	}
        this.typeData = this.TypeData();
        //remove space from the end.
	this.words[i-1] = this.words[i-1].substring(0,this.words[i-1].length-1);
        
	this.touchView.setTypeData(text);
        this.touchView.setBoldWord(this.words,this.index);
        this.touchView.resetTouchInput();
        this.resetting = false;
        
}

TouchType.prototype.handleKeyPress = function(which) {
	//console.log(which);
        if(this.resetting === true) {
            return;
        }
        
        //already handled by keydown for backspace;
        //needed for Firefox. Chrome stops event propagation 
        if(which === 8) {
            return;
        }
	
	if(this.index === 0 && this.typedWord.length === 0) {
		if(this.typeData.startTime === undefined) {
			this.typeData.startTime = new Date();
		}
	}
	
	this.typedWord += String.fromCharCode(which);
	var currWord = this.words[this.index];
	if(this.index === this.words.length-1 && this.typedWord === currWord) {
		this.resetTypedWord();
		this.processTypedFull();
	}
	else if(this.typedWord === currWord) {
		this.index++;
		this.resetTypedWord();
		this.touchView.setBoldWord(this.words,this.index);	
	}
	else if(this.typedWord === currWord.substring(0,this.typedWord.length)) {
		
	}
	else if(this.typedWord !== currWord.substring(0,this.typedWord.length)) {
		this.touchView.notifyTouchError(true);	
	}
	this.touchView.setTouchedValue(this.typedWord);	
}


TouchType.prototype.handleBackSpace = function(evt) {
        if(this.resetting === true) {
            return;
        }
	if(evt.which == 8) {
                var currWord = this.words[this.index];
		this.typedWord = this.typedWord.substring(0,this.typedWord.length-1);
		this.touchView.setTouchedValue(this.typedWord);
		this.errors += 1;
                
                if(this.typedWord === currWord.substring(0,this.typedWord.length)) {
                    this.touchView.notifyTouchError(false);
                }
                
		evt.preventDefault();
	}
}

TouchType.prototype.processTypedFull = function() {
	console.log('done');
	var endTime = new Date();
	var seconds = (endTime - this.typeData.startTime)/1000;
	this.typeData.accuracy = this.text.length/(this.text.length+this.errors);
	this.typeData.speed = (this.text.length/5/seconds)*60;
        var time = this.typeData.startTime;
        //converting time to UTC timestamp
        time = +new Date(time.toUTCString().substr(0,25));
        this.typeData.timestamp = time;
        delete this.typeData.startTime;
        
        //this line has to be called
        this.touchView.showLineStats(this.typeData);
        //before this because it resets data
	this.cb(this.typeData);
        
}


