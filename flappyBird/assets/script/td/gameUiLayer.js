import _myG from "./_myG";
cc.Class({
    extends: cc.Component,

    properties: {
        timeLable:{
            default:null,
            type:cc.Label
        }
    },

    onLoad () {
        this.nowTime=4;
    },

    start () {

    },

    update (dt) {
        //出怪倒计时
        if(this.nowTime>0){
            this.nowTime-=dt;
            if((this.nowTime-Math.floor(this.nowTime))<0.1){
                this.timeLable.string=(Math.floor(this.nowTime)-1);
                if(Math.floor(this.nowTime)==0){
                    cc.log("begin");
                    this.timeLable.string="";
                    this.nowTime=0;
                    _myG.event.fire("gameStart");
                }
            }
        }
    }
});
