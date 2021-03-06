
//判断当前渲染模式是WebGL还是Canvas
if (Laya.Render.isWebGL) {
    Laya.init(800, 600, Laya.WebGL);
    Config.isAlpha = true; //设置画布是否透明，只对2D(WebGL)、3D有效。
    Laya.stage.bgColor = "none"; //背景透明
} else {
    Laya.init(800, 600);
    Laya.stage.bgColor = null; //背景透明
}
Laya.stage.scaleMode = "showall";
Laya.stage.screenMode = "horizontal";
Laya.stage.alignH = "center";
Laya.stage.alignV = "middle";

var bg = null;



var images = [


    // "RoundParticle.part",

    "res/atlas/commen.atlas",

    "res/atlas/symbols.atlas",
    "res/atlas/fuzzy.atlas",
    "res/atlas/side.atlas",
    "res/atlas/setting.atlas",
    "res/atlas/number.atlas",
    "res/atlas/border.atlas",

    "res/atlas/bead.atlas",
    "res/atlas/dragon.atlas",
    "res/atlas/fire.atlas",
    "res/atlas/golden.atlas",
    "res/atlas/money.atlas",
    "res/atlas/line.atlas",

    "res/atlas/firework.atlas",
    "res/atlas/kuang.atlas",
    "res/atlas/particle.atlas"

    ];

var gameType = 7;
this.soundEnable = false;
this.index = 0;
this.loaded = false;

var player;
Laya.loader.load(images,laya.utils.Handler.create(this,onLoaded),Laya.Handler.create(this,loading,null,false),Laya.loader.JSON);

function loading(num){
    // /*
    if(!this.load){
        this.load = new LoadingView();
        Laya.stage.addChild(load);
    }
    this.index++;
    counter(num,this.index);
    // */
}
function counter(num,i){
    // /*
    Laya.timer.once(100 * i,this,function(){
        this.load.value = num;
        this.load.progress.bar.width = num * this.load.progress.width;
        this.load.percent.text = (num * 100).toFixed() + "%";
        if(num == 1 && this.loaded){
            initViews();
            this.load.removeSelf();
        }
    });
    // */
}

function initViews(){
    bg = new Laya.Image("commen/bg.png");
    bg.scale(800/bg.width,600/bg.height);
    bg.width = 800;
    bg.height = 600;
    Laya.stage.addChild(bg);

    main = new MainView();
    Laya.stage.addChild(main);
}

function onLoaded (setting){
    this.loaded = true;
    cacheFrameAnimation();
    
    player = document.createElement('audio');
    player.src = "mp3/dpmusic_main.mp3";
    player.loop = true;

    // initViews();

    // var ani = new Laya.Animation();
    // ani.loadAnimation("Particle.ani");
    // Laya.stage.addChild(ani);
    // ani.play();


/*
    var clip = new AcountImage(0);
    Laya.stage.addChild(clip);
    this.soundEnable = true;
    clip.startCounter(1.005 * 10,10);
    clip.y = 200;
    clip.x = 200;
    */
/*
    var prizeDraw = [
    {
		value:800,//次数
		type:"money"//免费游戏
	},{
		value:200,//数量
		type:"money"//现金
	},{
		value:100,
		type:"money"
	}
    ];
    var award = new AwardView(prizeDraw);
    Laya.stage.addChild(award);
    // 抽奖结束后，缩放
    award.mouseDown(function(){
        console.log('抽奖结束');
    });
	*/
}


function formatCurrency(num) {  
    num = num.toString().replace(/\$|\,/g,'');  
    if(isNaN(num))  
        num = "0";  
    sign = (num == (num = Math.abs(num)));  
    num = Math.floor(num*100+0.50000000001);  
    cents = num%100;  
    num = Math.floor(num/100).toString();  
    if(cents<10)  
    cents = "0" + cents;  
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)  
    num = num.substring(0,num.length-(4*i+3))+','+  
    num.substring(num.length-(4*i+3));  
    return (((sign)?'':'-') + num + '.' + cents);  
}  


Array.prototype.contains = function (obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
}

function playSound(url,isLoop){
    if(this.soundEnable){
        if(isLoop){
            Laya.SoundManager.playSound("mp3/" + url + ".mp3",0);
        }else{
            Laya.SoundManager.playSound("mp3/" + url + ".mp3");
        }
    }
}
function stopSound(url){
     Laya.SoundManager.stopSound("mp3/" + url + ".mp3");
}

function backgroundMusicPlay(enable){
    if(enable){
        if(isApp){
            window.webkit.messageHandlers.play.postMessage('play');
        }else{
            playBackgroundMusic();
        }
    }else{
        if(isApp){
            window.webkit.messageHandlers.pause.postMessage('pause');
        }else{
            stopBackgroundMusic();
        }
    }
}



/*
* 与 native 交互部分 在APP模式下可直接连接APP内的socket，在浏览器模式下连接webSocket，需要自己创建一个账号登录 
* socket 返回数据格式与 webSocket 接收到的数据格式完全一样
*/
var main;//游戏主界面
var isApp = false;//是否是APP登录
var playerAmount = 0;//玩家金额
//获取玩家金额
function getAccountInfoFromNative(amount){
    isApp = true;
    playerAmount = amount;
}
// 返回投注数据
function recieveMassage(message){
    main.onMessageReveived(message);//此处我是直接调用main下接收到webSocket的函数
}
// 退出游戏界面
function closeWindow(){
    window.isApp ? window.webkit.messageHandlers.slot.postMessage(JSON.stringify({cmd:"ExitGame", gameId:7})):socket.send(JSON.stringify({cmd:"ExitGame", gameId:7}));
    window.close();
    if(isApp){
        window.webkit.messageHandlers.close.postMessage('close');
    }
}
/*
 在发送投注信息的函数内做判断，betObj即为投注信息
if(window.isApp){
    window.webkit.messageHandlers.slot.postMessage(JSON.stringify(betObj));
}else{
    socket.send(JSON.stringify(betObj));
}
*/
// 此处两个函数可选，在Laya内部无法开启、关闭背景音乐情况下，可通过APP开启和关闭背景音乐
function playBackgroundMusic(){
    player.play();
}
function stopBackgroundMusic(){
    player.pause();
}
/************************************************************************************************************************************/

function cacheFrameAnimation (){
    Laya.Animation.createFrames("res/atlas/bead.atlas","bead");
    Laya.Animation.createFrames("res/atlas/dragon.atlas","dragon");
    Laya.Animation.createFrames("res/atlas/fire.atlas","fire");
    Laya.Animation.createFrames("res/atlas/golden.atlas","golden");
    Laya.Animation.createFrames("res/atlas/money.atlas","money");
}

// webSocket 信息
var socketUrl = '';
var hr = new Laya.HttpRequest();
hr.once(Laya.Event.PROGRESS, this, function(e) {});
hr.once(Laya.Event.COMPLETE, this, function(e) {
    switch (typeof e) {
        case "string":
            var data = JSON.parse(e);
            socketUrl = data.luck_localhost;
            console.log(e);
            break;
        case "object":
            socketUrl = e.luck_localhost;
            console.log(e);
            break;
        default:
            alert('config.json 配置错误');
            break;
    }
});
hr.once(Laya.Event.ERROR, this, function(e) {});
hr.send('/config.json', null, 'get', 'text');


function getQueryString(name) {//JS获取URL参数
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}