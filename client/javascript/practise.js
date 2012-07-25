function Hi() {
	this.hi = "hi";
}


Hi.prototype.so = function() {
	var x = function() {
		console.log(this.hi);
	}
	x();
	
}



Hi.prototype.contentGot = function() {
console.log('content got');
}


Hi.prototype.getUserContent = function() {
	var that = this;
	$.get('http://localhost:8000/'+'touch/content/',{'getContent':true},that.contentGot,'json');

}
