cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.direction=cc.v2(0,0);
        this.speed=700;
        this.screenSize=cc.winSize;
    },
    initWithData:function(t,p,enemyNodeList){
        this.direction=p.sub(t.position).normalize();
        this.node.position=t.position.add(this.direction.mul(50));

        //子弹角度调整
        let angle=this.direction.angle(cc.v2(0,1));
        this.node.rotation=(180/Math.PI)*angle;
        this.enemyNodeList=enemyNodeList;

        this.damage=t.getComponent("tower").getDamage();
    },

    start () {

    },

    update (dt) {

        this.node.position=this.node.position.add(this.direction.mul(this.speed*dt));

        for (let i=0;i<this.enemyNodeList.length;i++){
            let enemy=this.enemyNodeList[i];
            if(enemy.getComponent("enemy").isLiving()){
                let distance=enemy.position.sub(this.node.position).mag();
                if(distance<(enemy.width/2+this.node.width/2)){
                    //将攻击力传给当前被攻击的怪物
                    enemy.getComponent("enemy").attacked(this.damage);
                    this.node.destroy();
                }
            }
        }

        if(this.node.position.x<-(this.screenSize.width/2)
        ||this.node.position.x>(this.screenSize.width/2)
        ||this.node.position.y>(this.screenSize.height/2)
        ||this.node.position.y<-(this.screenSize.height/2)
        ){
            this.node.destroy();
        }
    },
});
