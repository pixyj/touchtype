$(document).ready(function() {
    touchAdmin = new TouchAdmin();	
});


$("#preview-button").click(function() {
    touchAdmin.previewContent();
});

$("#save-button").click(function() {
    var level = $("#level-input").val();
    touchAdmin.storeLevelContent(level);
    
});

$("#get-button").click(function() {
    var level = $("#level-input").val();
    touchAdmin.getLevelContent(level);
    
});


$("#level-input").keypress(function(evt) {
    if(evt.which == 13) {
        evt.preventDefault();
        touchAdmin.getLevelContent(this.value);
    }
});

$("#content-input").keydown(function(evt) {
    if(evt.which == 8) {
        touchAdmin.previewContent();
    }
});

$("#content-input").keypress(function() {
    touchAdmin.previewContent();
});


function TouchAdmin() {
    this.BASE_URL = BASE_URL;
    this.APP_PATH = "touch/";
    this.comm = new TouchComm(this.BASE_URL,this.APP_PATH);
    this.editor = new nicEditor({'iconsPath':'http://touchtype20cdn.appspot.com/images/nicEditorIcons.gif'});
    this.editor.panelInstance('text');
    this.getLevelContent(0);
}

TouchAdmin.prototype.previewContent = function() {
    var contentInput = this.editor.instanceById('text').getContent();
    document.getElementById("preview-div").innerHTML = contentInput;
}

TouchAdmin.prototype.getLevelContent = function(level) {
    //function(type,path,data,sentCB,nopeCB)
    var that = this;
    var cb = function(data) {
        that.editor.instanceById('text').setContent(data.content);
        $('#level-input').val(data.level);
        that.previewContent();
    }
    var data = {};
    data.level = level;
    this.comm.sendData('GET','edit_level_content/',data,cb);
}
TouchAdmin.prototype.storeLevelContent = function() {
    var data = {}
    data.level = $("#level-input").val();
    data.content = this.editor.instanceById('text').getContent();
    data = JSON.stringify(data);
    var payload = {};
    payload.data = data;
    this.comm.sendData('POST','edit_level_content/',payload);
}

