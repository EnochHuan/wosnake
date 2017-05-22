cc.Class({
    extends: cc.Component,

    properties: {
       applePrefab: {//苹果预制资源
            default: null,
            type: cc.Prefab
        },

    },

    // use this for initialization
    onLoad: function () {
        this.createFood();
    },

    //创建食物
    createFood: function(){
        //初始化资源，并加到游戏主界面
        var applePre = cc.instantiate(this.applePrefab);
        this.node.addChild(applePre);
        //设置位置
        applePre.setPosition(this.initFoodPos());
    },

    //初始化食物的位置
    initFoodPos: function(){
        return cc.p((cc.random0To1()-1)*this.node.width/2,(cc.random0To1()-1)*this.node.height/2);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
