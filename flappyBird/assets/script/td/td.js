cc.Class({
    extends: cc.Component,

    properties: {
        levelPrefabs:{
            default:[],
            type:cc.Prefab
        },
        gameLayerNode:{
            default:null,
            type:cc.Node
        },
        gameUiLayerNode:{
            default:null,
            type:cc.Node
        }
    },
    backToMainScene:function(){
        cc.director.loadScene("main");
    },

    onLoad () {
        let level=cc.instantiate(this.levelPrefabs[0]);
        level.parent=this.gameLayerNode;
    },

    start () {

    },

    // update (dt) {},
});
