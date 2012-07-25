$(document).ready(function() {
    touchComm = new TouchComm(BASE_URL,'/login/')
});

$('#login-button').click(function(evt) {
    evt.preventDefault();
    if($('#login-username').val().length == 0 || $('#login-password').val().length == 0) {
        return;
    }
    var payload = {
        'username' : $('#login-username').val(),
        'password' : $('#login-password').val(),
        'signup'   : false
    }
    var data = {}
    data.data = JSON.stringify(payload);
    var nopeCB = function() {
        $('#login-msg').val('Unable to connect to server');
    }
    var successCB = function(data) {
        if(data.success === false) {
            document.getElementById('login-msg').innerHTML = 'Wrong username/password combination';
        }
        else {
            window.location.href = '/touch/';
        }
    }
    
    touchComm.sendData('POST','',data,successCB,nopeCB);
    
});

$('#signup-button').click(function(evt) {
    evt.preventDefault();
    if($('#signup-username').val().length == 0 || $('#signup-password').val().length == 0) {
        return;
    }
    var payload = {
        'username' : $('#signup-username').val(),
        'password' : $('#signup-password').val(),
        'signup'   : true  
    }
    var data = {};
    data.data = JSON.stringify(payload);
    var nopeCB = function() {
        $('#signup-msg').val('Unable to connect to server');
    }
    var successCB = function(data) {
        if(data.success === false) {
            document.getElementById('signup-msg').innerHTML = 'Username not available';
        }
        else {
            window.location.href = '/touch/';
        }
    }
    touchComm.sendData('POST','',data,successCB,nopeCB);
    
});
