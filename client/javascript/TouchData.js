//Model

function TouchData(view,type) {
    
    this.BASE_URL = BASE_URL;
    this.APP_PATH = "touch/";
    this.MAX_LEVEL = 24;
    var records = function(levels) {
        var records = [];
        for(i=0;i<levels;i++) {
            records.push([]);
        }
        return records;
    }(this.MAX_LEVEL);
    
    this.userData = {
        records : records,
        level : 0	
    };
    this.view = view;
    this.touchType = type;
    this.levelContent = "";
    this.getUserLevel();
    this.getUserContent();
    this.getUserRecords();	
    
    
}


TouchData.prototype.getUserContent = function() {
    var content = localStorage.getItem('content');
    var getContent = (content === null);
    var that = this;
    var cb = function(content) {
        that.contentGot(content);
    }
    $.get(this.BASE_URL+'touch/content/',{
        'getContent':getContent
    },cb,'json');
    if(!getContent) {
        this.content = JSON.parse(content);
        this.cleanContent();
    }
}

TouchData.prototype.startCB = function() {
    this.getLevelContent(this.userData.level);
    this.sortCharsByLevel();
    //var text = "Hi.";
    var text = this.decideTextToType();
    this.touchType.setData(text);
    
}

TouchData.prototype.contentGot = function(content) {
    if(this.content === undefined) {
        var storedContent = {}
        storedContent.levels = content.levels;
        storedContent.words = content.words;
        localStorage.setItem('content',JSON.stringify(storedContent));
        this.content = storedContent;
        this.cleanContent();
    }
    
    this.startCB();
}

TouchData.prototype.contentFailure = function() {
    console.log('no content got');
}

TouchData.prototype.cleanContent = function() {
    var clean = function(that,oldKey,key) {
        var value = that.content.levels[oldKey];
        delete that.content.levels[oldKey]; 
        that.content.levels[key] = value;	
    }
    clean(this,'period','.');
    clean(this,'semi',';');
    clean(this,'comma',',');
	
    for(var i in this.content.levels) {
        this.content.levels.i = parseInt(this.content.levels.i);	
    }
}

TouchData.prototype.sortCharsByLevel = function() {
    this.content.sortedChars = [];
    for(var ch in this.content.levels) {
        var level = this.content.levels[ch];
        this.content.sortedChars.push({'ch':ch,'level':level});
    }
    this.content.sortedChars.sort(function(a,b) {return a.level - b.level});
}

TouchData.prototype.typedFullCB = function(data) {
    data.level = this.userData.level;
    console.log(data);
    this.userData.records[this.userData.level].push(data);
    //decide whether to take user to next level
    this.promoteUserLevel();
    //function(type,path,data,sentCB,nopeCB)
    var text = this.decideTextToType();
    this.touchType.setData(text);
    
    var payLoad = {}
    payLoad.data = JSON.stringify(data);
    this.sendData('POST','store_line/',payLoad);
    this.calcAndShowStats();
}

TouchData.prototype.promoteUserLevel = function() {
    var promote = this.isUserLevelPromoted();
    if(promote) {
        this.getLevelContent(this.userData.level);
        var postSuccess = function() {
            console.log("level posted");
        }
        var payload = {'level' : this.userData.level};
        var data = {}
        data.data = JSON.stringify(payload);
        this.sendData('POST','update_level/',data,
            postSuccess);   
    }
}

TouchData.prototype.isUserLevelPromoted = function() {

    var levelRecords = this.userData.records[this.userData.level];
    var levelXP = levelRecords.length;
    if(levelXP < 10 || this.userData.level === this.MAX_LEVEL) {
        return false;
    }
    var levelAccu = 0;
    for(i=0;i<levelXP;i++) {
        levelAccu += levelRecords[i].accuracy;
    }
    levelAccu = levelAccu/levelXP;
    var promote = false;
    if(levelAccu > 0.85) {
        this.userData.level += 1;
        promote = true;
    }
    return promote;
}


TouchData.prototype.decideTextToType = function() {
    //var levelXP = this.userData.records[this.userData.level].length;
    var text = this.getWords(this.userData.level);
    var that = this;
    var specials = {
        'shift' : function(text) {
            return text.capitalize();
        },
        '.' : function(text) {
            return text + '.';
        },
        ';' : function(text) {
            return text + ';';
        },
        ',' : function(text) {
            return text + ',';
        }
    }
    
    function embellish() {
        for(letter in specials) {
            level = parseInt(that.content.levels[letter]);
            if(that.userData.level === level) {
                for(i=0;i<text.length;i++) {
                    text[i] = specials[letter](text[i]);
                }
            }
        }

    }
    embellish();


    
    text = text.join(" ");	
    
    if(this.userData.level > this.content.levels['.']) {
        text += ".";
    }
    if(this.userData.level > parseInt(this.content.levels['shift'])) {
        text = text.capitalize();
    }
    return text;			
}

TouchData.prototype.getWords = function(level) {
    var wordCount = this.content.words[level].length;
    if(wordCount == 0) {
        return this.getWords(level-1);
    }
    var words = [];
    var currLevelWords = this.content.words[level];
    for(var i=0;i<5;i++) {
        var index = Math.floor(Math.random()*wordCount);
        words.push(currLevelWords[index]);
    }
    return words;
		 
}

TouchData.prototype.getLetters = function(level) {
    var userLetters = [];
    for(var i=0;i<this.content.sortedChars.length;i++) {
        if(i.level > this.userData.level) {
            break;
        }
        userLetters.push(i);
    }
    var letters = [];
    for(i=userLetters.length-1;i>=0;i++) {
        if(userLetters[i].level == 0 || userLetters.level == 1) {
            letters.push(userLetters[i].ch);
        }
    }
    
    
}

TouchData.prototype.getLevelContent = function(level) { 
    //(type,path,data,sentCB,nopeCB)
    var payload = {'level' : level};
    var data = {}
    data.data = JSON.stringify(payload);
    var that = this;
    var cb = function(data) {
        that.showLevelContent(data);
    }
    this.sendData('GET','get_level_content/',data,cb);
}

TouchData.prototype.getUserRecords = function() {
    var that = this;
    var cb = function(data) {
        console.info('records got');
        console.log(data);
        data = data.records;
        var l = data.length;
        for(i=0;i<l;i++) {
            var record = {};
            record.speed = data[i][0];
            record.accuracy = data[i][1];
            record.level = data[i][2];
            record.timestamp = data[i][3];
            that.userData.records[record.level].push(record);
        }
        that.calcAndShowStats();
    }
    var nope = function(data) {
        console.error("Didn't fetch user records");
    }
    //type,path,data,sentCB,nopeCB
    this.sendData('GET','get_line_data/',{},cb,nope);
}

TouchData.prototype.getUserLevel = function() {
	var that = this;
	var cb = function(data) {
		that.userData.level = data.level;
		//that.startCB();
	}
	var nope = function(data) {
		console.error('didn\'t get user level Setting to 0');
		that.userData.level = 0;
	}
	
	this.sendData('GET','get_user_level/',{},cb,nope);
	
}

/////////////////////////////////////////////////////////////////////
//Showing Stuff interface
////////////////////////////////////////////////////////////////////
TouchData.prototype.showLevelContent = function(data) {
    console.log(data);
    document.getElementById('content-div').innerHTML = data.content;
}
TouchData.prototype.calcAndShowStats = function() {
    var records = this.userData.records;
    var l = records.length;
    var allStats = [];
    var levelStats;
    for(i=0;i<l;i++) {
        if(records[i].length === 0) {
            continue;
        }
        levelStats = {};
        allStats.push(levelStats);
        levelStats.level = i;
        levelStats.lines = records[i].length;
        levelStats.accuracy = 0;
        levelStats.speed = 0;
        $.each(records[i],function() {
           levelStats.accuracy += this.accuracy;
           levelStats.speed += this.speed;
        });
        levelStats.speed /= levelStats.lines; 
        levelStats.speed = levelStats.speed.toFixed(2);
        levelStats.accuracy /= levelStats.lines/100; //%        
        levelStats.accuracy = levelStats.accuracy.toFixed(2);
    }
    this.view.updateStats(allStats);
}

//////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////
//Communication With Servers
//////////////////////////////////////////////////////////////

TouchData.prototype.sendData = function(type,path,data,sentCB,nopeCB) {
    
    if(type !== 'GET') {
        var cookies = document.cookie.split(';');
        for(i =0;i<cookies.length;i++) {
            if(cookies[i].indexOf("csrftoken") !== -1) {
                data.csrfmiddlewaretoken = cookies[i].split('=')[1];
            }
        }
    }
    
    //$.ajaxSetup({'data' : csrf});
    
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

///////////////////////////////////////////////////////////////
//				Debugging
///////////////////////////////////////////////////////////////


function Foo() {
    this.tD = touchApp.touchData;
}

Foo.prototype.contentGot = function() {
    console.log(this);
}

Foo.prototype.getUserContent = function() {
	
    var that = this;
    var cb = function() {
        that.contentGot();
    }
    $.get(BASE_URL +'touch/content/',{
        'getContent':true
    },cb,'json');

}


Foo.prototype.debugSendData = function() {
    var postSuccess = function() {
        console.log("level posted");
    }
    this.tD.sendData('POST','update_level/',
        {'level' : this.tD.userData.level},
        postSuccess);
    
    for(var i=0;i<20;i++) {
        this.tD.sendData('POST','update_level/',
        {'level' : i},
        postSuccess);
    }
    
}

Foo.prototype.debugTypeData = function() {
    var typeData = {'timestamp'  :   +new Date(),
            'accuracy' : 0.98,
            'speed'    : 77,
            'level'    : 1 }
    var data = {};
    data.data = JSON.stringify(typeData);
        
   this.tD.sendData('POST','store_line/',data);
}

