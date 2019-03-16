import _myG from "./_myG"
const TowerPosNodeState={
    Invalid:-1,
    Null:1,
    BuildMenu:2,
    Tower:3,
    Upgrade:4
};

cc.Class({
    extends: cc.Component,

    properties: {
        enemyPathNodes:{
            default:[],
            type:cc.Node
        },
        towerPosNodes:{
            default: [],
            type: cc.Node
        },
        buildMenuPrefab:{
            default:null,
            type:cc.Prefab
        },
        towerPrefabs:{
            default: [],
            type: cc.Prefab
        },
        upgradePrefab:{
            default:null,
            type:cc.Prefab
        },
        enemyPrefab:{
            default:null,
            type:cc.Prefab
        },
        bulletPrefab:{
            default:null,
            type:cc.Prefab
        }
    },
    onLoad () {
        this.towerPosNodes.forEach(e=>{
            let node=e;
            this.setState(node,TowerPosNodeState.Null);
            this.setTouchEvent(node);
        });
        _myG.event.on("showBuildDetails",this.buildTower.bind(this));
        _myG.event.on("upgradeTower",this.upgradeTower.bind(this));
        _myG.event.on("sellTower",this.sellTower.bind(this));
        _myG.event.on("gameStart",this.gameStart.bind(this));
        _myG.event.on("shoot",this.addBullet.bind(this));
        _myG.event.on("sellTower",this.sellTower.bind(this));

        //当前波数
        this.curWaveCount=0;
        //当前怪物数量
        this.curEnemyCount=0;
        //加怪物的时间
        this.addCurEnemyTime=0;
        //当前加波数
        this.addCurWaveTime=0;
        //怪物列表
        this.enemyNodeList=[];
        //防御塔列表
        // this.towerNodeList=[];
        //子弹列表
        this.bulletNodeList=[];

    },
    //开始游戏
    gameStart:function(){
        //加载配置
        cc.loader.loadRes("./config/level_config",(err,res)=>{
            if(err){
                cc.log("gameStart--error:",err);
            }else{
                cc.log("level_config:",JSON.stringify(res));
            }

            let config=res["json"].level_1;
            this.levelConfig=config;
            // let wavesConfig=config["waves"];
            // this.wavesConfig=wavesConfig;
            // this.curWaveConfig=wavesConfig[0];
        });
    },
    //出怪
    addEnemy:function(type){
        let enemy=cc.instantiate(this.enemyPrefab);
        enemy.getComponent("enemy").initWithData(type,this.enemyPathNodes);
        enemy.parent=this.node;
        this.enemyNodeList.push(enemy);
    },
    addWave:function(){

    },
    //触摸事件
    setTouchEvent:function(node){
        node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            cc.log("node name:",event.target.name);
            if(node.state==TowerPosNodeState.Null){
                this.showBuildMenu(event.target);
            }else if(node.state==TowerPosNodeState.Tower){
                this.showUpgradeMenu(event.target);
            }
        });
    },
    // 展示菜单
    showBuildMenu:function(node){
        this.closeBuildMenu();
        //非空才能建造
        // if(node.state===TowerPosNodeState.Null) {
            let menu = cc.instantiate(this.buildMenuPrefab);
            menu.parent = this.node;
            menu.position = node.position;

            this.setState(node, TowerPosNodeState.BuildMenu);
            node.menu = menu;
        // }
    },
    //关闭菜单
    closeBuildMenu:function(){
        for(let i in this.towerPosNodes){
            let node=this.towerPosNodes[i];
            if(node.state===TowerPosNodeState.BuildMenu){
                node.menu.destroy();
                this.setState(node,TowerPosNodeState.Null);
                return node;
            }
            if(node.state==TowerPosNodeState.Upgrade){
                node.menu.destroy();
                this.setState(node,TowerPosNodeState.Tower);
                return node;

            }
        }
    },
    setState:function(node,state){
        if(node){
            if(node.state==state)
                return;

            switch (state) {
                case TowerPosNodeState.Null:break;
                case TowerPosNodeState.BuildMenu:break;
                default:break;
            }

            node.state=state;
        }else{
            return;
        }

    },
    //建造
    buildTower:function(data){
        cc.log("listen:",data);
        let node=this.closeBuildMenu();
        let tower=cc.instantiate(this.towerPrefabs[data]);
        tower.parent=this.node;
        tower.position=node.position;
        this.setState(node,TowerPosNodeState.Tower);
        node.tower=tower;
        // this.towerNodeList.push(tower);
    },
    //升级
    upgradeTower:function(){
        let node =this.closeBuildMenu();
        node.tower.getComponent("tower").updateTower();
    },
    //出售
    sellTower:function(){
        let node =this.closeBuildMenu();
        if(node) {
            this.setState(node, TowerPosNodeState.Null);
            node.tower.getComponent("tower").sellTower();
            node.tower = undefined;
        }
    },
    //展示升级菜单
    showUpgradeMenu:function(node){
        this.closeBuildMenu();
        let menu=cc.instantiate(this.upgradePrefab);
        menu.parent=this.node;
        menu.position=node.position;
        this.setState(node,TowerPosNodeState.Upgrade);
        node.menu=menu;
    },
    onDestroy:function(){
        _myG.event.off("showBuildDetails",this.buildTower);
    },
    start () {

    },
    update (dt) {
        if(this.curWaveConfig){
            if(this.addCurEnemyTime>this.curWaveConfig.dt){
                this.addCurEnemyTime=0;
                this.curEnemyCount++;
                this.addEnemy(this.curWaveConfig.type);
                if(this.curEnemyCount===this.curWaveConfig.count){
                    this.curWaveConfig=undefined;
                    this.curEnemyCount=0;
                }
            }else{
                this.addCurEnemyTime+=dt;
            }
        }else{
            if(this.levelConfig){
                if(this.addCurWaveTime>this.levelConfig.dt){
                    this.curWaveConfig=this.levelConfig.waves[this.curWaveCount];
                    if(this.curWaveCount<this.levelConfig.waves.length){
                        this.curWaveCount++;
                    }else{
                        this.curWaveConfig=undefined;
                    }
                }else{
                    this.addCurWaveTime+=dt;
                }
            }
        }

        for(let i=0;i<this.towerPosNodes.length;i++){
            let tower=this.towerPosNodes[i].tower;
            if(tower&&tower.getComponent("tower").isFree()){
                for(let j=0;j<this.enemyNodeList.length;j++){
                    let enemy=this.enemyNodeList[j];
                    if(enemy.getComponent("enemy").isLiving()){
                        tower.getComponent("tower").setEnemy(enemy);
                    }else if(enemy.getComponent("enemy").isDead()){
                        this.enemyNodeList.splice(j,1);
                    }
                }
            }
        }
    },
    addBullet:function(tower,pos){
        let bullet=cc.instantiate(this.bulletPrefab);
        // bullet.position=tower.position;
        bullet.parent=this.node;
        bullet.getComponent("bullet").initWithData(tower,pos,this.enemyNodeList);
    }
});
