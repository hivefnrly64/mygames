const EnemyState={
    Invalid:-1,
    Running:1,
    EndPath:2,
    Dead:3
};
cc.Class({
    extends: cc.Component,

    properties: {
        spriteFrames:{
            default:[],
            type:cc.SpriteFrame
        },
        spriteNode:{
            default:null,
            type:cc.Sprite
        },
        bloodProgressBar:{
            default:null,
            type:cc.ProgressBar
        }
    },


    onLoad () {
        this.state=EnemyState.Invalid;
        //隐藏
        this.node.opacity=0;
        this.direction=cc.v2(0,0);
        this.curPathPointCount=0;
        //血条
        this.curBloodCount=0;
        this.totalBloodCount=1;
    },

    start () {

    },

    initWithData:function(type,pathPoints){
        // this.node.getComponent(cc.Sprite).spriteFrame=this.spriteFrames[type];
        this.spriteNode.spriteFrame=this.spriteFrames[type];
        this.pathPoints=pathPoints;
        this.node.position=pathPoints[0].position;

        cc.loader.loadRes("./config/enemy_config",(e,r)=>{
            if(e){
                cc.log("initWithData:",e);
            }else{
                // cc.log("enemy r::",JSON.stringify(r));
                let config=r.json["e"+type];
                this.speed=config.speed;
                this.curBloodCount=config.health;
                this.totalBloodCount=config.health;
                this.setState(EnemyState.Running);
            }
        });
    },
    update (dt) {
        if(this.state==EnemyState.Running){
            let distance=
                //cc.pDistance(this.node.position,this.pathPoints[this.curPathPointCount].position);
                this.node.position.sub(this.pathPoints[this.curPathPointCount].position).mag();
            if(distance<10){
                this.curPathPointCount++;
                if(this.curPathPointCount==this.pathPoints.length){
                    this.setState(EnemyState.EndPath);
                    return;
                }
                this.direction=this.pathPoints[this.curPathPointCount].position.sub(this.node.position).normalize();
            }else{
                this.node.position=this.node.position.add(this.direction.mul(this.speed*dt));
            }
        }
            this.bloodProgressBar.progress=this.curBloodCount/this.totalBloodCount;
    },
    setState:function(state){
        if(this.state===state)
            return;

        switch (state) {
            case EnemyState.Running:this.node.opacity=255;break;
            case EnemyState.EndPath:break;
            case EnemyState.Dead:
                let action=cc.fadeOut(0.8);
                let sequence=cc.sequence(action,cc.callFunc(()=>{
                    this.node.destroy();
                }));
                this.node.runAction(action);
                break;
            default:break;
        }

        this.state= state;
    },
    isLiving:function(){
        if(this.state==EnemyState.Running)
            return true;
        return false;
    },
    attacked:function(damage){
        this.curBloodCount-=damage;
        if(this.curBloodCount<=0){
            this.curBloodCount=0;
            this.setState(EnemyState.Dead);
        }
    },
    isDead:function(){
        if(this.state==EnemyState.Dead)
            return true;
        return false;
    }
});
