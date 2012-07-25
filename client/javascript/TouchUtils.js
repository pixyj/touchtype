function TouchComm(baseURL,appPath) {
    this.BASE_URL = baseURL;
    this.APP_PATH = appPath;
}

TouchComm.prototype.sendData = function(type,path,data,sentCB,nopeCB) {
    
    if(type !== 'GET') {
        var cookies = document.cookie.split(';');
        for(i =0;i<cookies.length;i++) {
            if(cookies[i].indexOf("csrftoken") !== -1) {
                data.csrfmiddlewaretoken = cookies[i].split('=')[1];
            }
        }
    }
    
    var input = {
        'type' : type,
        'url'  : this.BASE_URL + this.APP_PATH + path,
        'data' :    data,
        'success'   : sentCB,
        'error'     : nopeCB,
        'datatype'  : 'json'
   }
   $.ajax(input);
}
