import _myG from "./_myG"
cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad () {

    },

    start () {

    },

    btnClick:function(event,data){
        cc.log("click!:",data);
        _myG.event.fire("showBuildDetails",data);
    }

    // update (dt) {},
});
