cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        //入口列表
    },

    start () {

    },

    flappyBird:function(){
        cc.director.loadScene("bird");
    },
    td:function(){
        cc.director.loadScene("td");
    /*    cc.director.preloadScene("td",(e,r)=>{
            cc.director.loadScene("td");
        });*/
    }

    // update (dt) {},
});
