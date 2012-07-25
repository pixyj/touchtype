//Controller

function TouchApp() {
	this.touchView = new TouchView();
        var that = this;
        function cb(data) {
            that.touchData.typedFullCB(data);
        }
        this.touchType = new TouchType(this.touchView,cb);
        this.touchData = new TouchData(this.touchView,this.touchType);
        
        //DEBUGGING;
        
        
}




