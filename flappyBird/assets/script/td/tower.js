import _myG from "./_myG"
cc.Class({
    extends: cc.Component,

    properties: {
        spriteFrames:{
            default:[],
            type:cc.SpriteFrame
        },
        spriteNode:{
            default: null,
            type:cc.Sprite
        },
        towerType:""
    },


    onLoad () {
        this.levelCount=0;
        //伤害
        this.curDamage=0;
        // 识别范围
        this.curLook=0;
        // 攻击范围
        this.curRange=0;
        //攻速
        this.curShootDt=0;
        //当前射击时间
        this.curShootTime=0;
        cc.loader.loadRes("./config/tower_config",(e,r)=>{
            if(e){
                cc.log("tower onload error:",e);
            }else{
                cc.log("tower load config:",JSON.stringify(r));
                this.towerConfig=r.json[this.towerType];
                //更新防御塔数值
                this.curDamage=this.towerConfig.damage[this.levelCount];
                this.curRange=this.towerConfig.range[this.levelCount];
                this.curLook=this.towerConfig.look;
                this.curShootDt=this.towerConfig.shootDt[this.levelCount];
            }
        });
    },

    start () {

    },
    updateTower:function(){
        cc.log("updateTower");
        if(this.levelCount<this.spriteFrames.length-1){
            this.levelCount++;
            this.spriteNode.spriteFrame= this.spriteFrames[this.levelCount];
            //更新防御塔数值
            this.curDamage=this.towerConfig.damage[this.levelCount];
            this.curRange=this.towerConfig.range[this.levelCount];
            this.curLook=this.towerConfig.look;
            this.curShootDt=this.towerConfig.shootDt[this.levelCount];
        }else{
            cc.log("已经是最高级");
        }
    },
    sellTower:function(){
        // _myG.event.fire("sellTower");
        this.node.destroy();
    },
    isFree:function(){
        if(this.enemy)
            return false;
        return true;
    },
    setEnemy:function (enemy) {
        let distance=enemy.position.sub(this.node.position).mag();
        if(distance<this.curLook){
            this.enemy=enemy;
        }
    },

    update (dt) {
        if(this.enemy){
            let direction=this.enemy.position.sub(this.node.position);
            let angle=direction.signAngle(cc.v2(0,1))
            //弧度转角度
            this.node.rotation=(180/Math.PI)*angle;

            if(this.curShootTime>this.curShootDt){
                this.curShootTime=0;
                this.shoot();
            }else{
                this.curShootTime+=dt;
            }

            let distance=this.enemy.position.sub(this.node.position).mag();
            //如果超出攻击范围，重新寻找攻击范围内的敌人
            if(distance>this.curRange||!this.enemy.getComponent("enemy").isLiving()){
                this.enemy=undefined;
            }

        }
    },
    shoot:function(){
        _myG.event.fire("shoot",this.node,this.enemy.position);
    },
    /**
     * 返回当前防御塔攻击力
     * @returns {number|*}
     */
    getDamage:function(){
        return this.curDamage;
    }
});
