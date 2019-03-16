import _myG from "./_myG"
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    btnClick:function(event,data){
        cc.log("ug:",data);
        _myG.event.fire(data+"Tower");
    }
});
