cc.Class({
    extends: cc.Component,

    properties: {
        birdParent:cc.Node,
        bird0:cc.Sprite,
        bird1:cc.Sprite,
        bird2:cc.Sprite,
        bird3:cc.Sprite,
        time:0,
        bg0:cc.Node,
        bg1:cc.Node,
        pipeP0:cc.Node,
        pipeP1:cc.Node,
        pipeP2:cc.Node,
        pWidth:52,
        bgWidth:288,
        birdWidth:34,
        py:50,
        speed:0,
        flySpeed:3,
        scoreL:cc.Label,
        score:0,
        gameOver:cc.Node,
        startBtn:cc.Button,
        autoBtn:cc.Button,
        mainBtn:cc.Button
    },

    backToMainScene:function(){
      cc.director.loadScene("main");
    },

    onLoad () {
        this.gameOver.active=false;
    },
    isStart:false,
    isAuto:false,

    resetGame(){
        this.birdParent.y=0;
        this.birdParent.x=0;
        this.score=0;
        let pipeOffsetX=200;
        let spacing=(this.bgWidth+this.pWidth)/3;
        this.pipeP0.x=pipeOffsetX+spacing*0;
        this.pipeP1.x=pipeOffsetX+spacing*1;
        this.pipeP2.x=pipeOffsetX+spacing*2;
        this.scoreL.string=this.score.toString();
        this.gameOver.active=false;
    },

    btnAuto(){
        this.isStart=true;
        this.isAuto=true;
        this.gameOver.active=false;
        this.startBtn.node.active=false;
        this.autoBtn.node.active=false;
    },

    toMain(){
        this.isStart=false;
        this.isAuto=false;
        this.gameOver.active=true;
        this.startBtn.node.active=true;
        this.autoBtn.node.active=true;
        this.resetGame();
    },

    btnStart(){
        this.isStart=true;
        this.gameOver.active=false;
        this.startBtn.node.active=false;
        this.autoBtn.node.active=false;
        this.mainBtn.node.active=false;
        this.resetGame();
    },

    gameOverFun(){
        this.isStart=false;
        this.isAuto=false;
        this.gameOver.active=true;
        this.mainBtn.node.active=true;
    },

    start () {
        //每次开始时重置管道位置
        let pipeOffsetX=200;
        // let spacing=(this.node.width+this.pipeP0.children[0].width)/3;
        let spacing=(this.bgWidth+this.pWidth)/3;
        this.pipeP0.x=pipeOffsetX+spacing*0;
        this.pipeP1.x=pipeOffsetX+spacing*1;
        this.pipeP2.x=pipeOffsetX+spacing*2;
    },

    update (dt) {
        let timeTmp=this.time+dt;
        this.time=timeTmp;

        //翅膀振动
        if(this.time>0.8){
            if ( this.bird0.node.active){
                this.bird0.node.active=false;
                this.bird1.node.active=true;
            }else if(this.bird1.node.active){
                this.bird1.node.active=false;
                this.bird2.node.active=true;
            }else if (this.bird2.node.active){
                this.bird2.node.active=false;
                this.bird3.node.active=true;
            }else if (this.bird3.node.active){
                this.bird3.node.active=false;
                this.bird0.node.active=true;
            }
            this.time=0
        }

        if(this.isStart) {
            //下坠
            this.speed = this.speed - 0.1;
            this.birdParent.y = this.birdParent.y + this.speed;

            this.birdParent.rotation = -this.speed * 10;

            //背景切换
            this.bg(this.bg0);
            this.bg(this.bg1);

            //管道重置
            this.pipe(this.pipeP0);
            this.pipe(this.pipeP1);
            this.pipe(this.pipeP2);

            //碰撞检测
            this.collideCheck(this.birdParent, this.pipeP0);
            this.collideCheck(this.birdParent, this.pipeP1);
            this.collideCheck(this.birdParent, this.pipeP2);
        }
    },

    bg(bg){
        bg.x=bg.x-1;

        if(bg.x<-this.node.width)
            bg.x=bg.x+this.node.width*2;
    },

    pipe(p){
        p.x=p.x-3;
        if(p.x<-(this.bgWidth/2+this.pWidth/2)) {
            p.x = p.x + this.bgWidth + this.pWidth;
            p.y = this.py - (Math.random() * this.py);

            this.score=this.score+1;
            this.scoreL.string=this.score.toString();
        }
    },

    click(){
        this.speed=this.flySpeed;
    },

    collideCheck(bird,pipe){
        if(
            bird.x+17<pipe.x-26
            ||bird.x-17>pipe.x+26
            || ((bird.y+12<pipe.y+50)&&(bird.y-12>pipe.y-50))
        )
            return;

        if(this.isAuto){
            if(bird.y-12<pipe.y-50) {
                this.click();
            } else{
                this.clickR();
            }
        }else{
            this.gameOverFun();
        }
    },
    clickR(){
        this.speed=-10;
        // this.speed=-this.flySpeed;
    }
});
