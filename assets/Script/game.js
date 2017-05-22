cc.Class({
    extends: cc.Component,

    properties: {
       applePrefab: {//苹果预制资源
            default: null,
            type: cc.Prefab
        },
        //蛇头prefab
        headPrefab: {
            default: null,
            type: cc.Prefab
        },
        //蛇身prefab
        bodyPrefab: {
            default: null,
            type: cc.Prefab
        },
        //蛇的移动方向
        dir: "left",
        //蛇的长度
        len : 3,
        //蛇的移动速度
        snakeSpeed : 0.4,
        //蛇的移动距离
        snakeLen : 22,

    },

    // use this for initialization
    onLoad: function () {
        //初始化蛇
        this.initSnake();
        //绑定按键
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        //创建食物
        this.createFood();
         //用定时器定时执行刷新
        this.schedule(this.updatePos, this.snakeSpeed);
    },

    //更新位置坐标
    updatePos: function(){
        //获取蛇头，需要先判断蛇头是否变换了位置
        var head = this.node.getChildByName("head");
        head.lastDir = head.dir;
        head.dir = this.dir;
        if(head.dir != this.dir){//蛇头方向和当前方向不一致时需要调整蛇头
            head.lastDir = head.dir;
            head.dir = this.dir;
            this.updateHeadPos(head);
        }
        this.updatePosHand(this.dir,head);

        debugger;

        //获取所有蛇身，这块的主要逻辑是，每个蛇身记录它上一次的方向和当前的方向，
        //每次移动时，更新上一次方向为当前方向，更新当前方向为前一个蛇身的上一次方向
        var bodys = this.node.getComponentsInChildren("body");
        for(var i = 0; i < bodys.length; i++){
            var pre;
            if(i == 0){
                pre = head;
            }else{
                pre = bodys[i-1].node;
            }
             
            var cur = bodys[i].node;
            cur.lastDir = cur.dir;
            cur.dir = pre.lastDir;
            this.updatePosHand(pre.lastDir,cur);
        }
        if(this.isAdd){//是否需要添加身体
            this.isAdd = false;
            var len = bodys.length-1;
            this.createBody(bodys[len].node,len);
        }
    },

    //更新位置方法，传递一个方向和节点（蛇头或蛇身）计算需要移动的位置
    updatePosHand: function(dir,node){
        if(dir == "down"){
            node.y -= this.snakeLen;
        }else if(dir == "left"){
            node.x -= this.snakeLen;
        }else if(dir == "right"){
            node.x += this.snakeLen;
        }else{
            node.y += this.snakeLen;
        }
    },

    /**蛇相关代码-start*/
    //初始化蛇
    initSnake: function(){
        this.canPress = true;
        //生成蛇头
        var head = cc.instantiate(this.headPrefab);
        // 添加蛇头
        this.node.addChild(head);
        this.updateHeadPos(head);
        head.dir = "left";

        //批量生产蛇身
        var pre;
        for(var i = 0; i < this.len; i++){
            if(i == 0){
                pre = head;
            }
            pre = this.createBody(pre,i);
            pre.dir = "left";
        }
       
    },

    //更新蛇头位置
    updateHeadPos: function(head){
        //蛇头旋转方向
        var rotation = 0;
        if(this.dir == "down"){
            rotation = 180;
        }else if(this.dir == "left"){
            rotation = -90;
        }else if(this.dir == "right"){
            rotation = 90;
        }else{
            rotation = 0;
        }
        head.rotation = rotation;
        head.setPosition(cc.p(head.x, head.y));
    },

    //更新蛇身的位置
    updateBodyPos: function(pre,body){
        var x = pre.x;
        var y = pre.y;
        var w = pre.width;
        var h = pre.height;
        if(pre.dir == "up"){
            y = y - h;
        }else if(pre.dir == "down"){
            y = y + h;
        }else if(pre.dir == "left"){
            x = x + w;
        }else if(pre.dir == "right"){
            x = x - w;
        }
        body.dir = pre.dir;
        // 设置位置
        body.setPosition(cc.p(x, y));
    },

    //创建蛇身体
    createBody: function(pre,i){
         //生成蛇身
        var body = cc.instantiate(this.bodyPrefab);
        // 添加蛇身
        this.node.addChild(body);
        this.updateBodyPos(pre,body);
        return body;
    },

    onKeyDown: function(event) {
        if(!this.canPress){//按键检查,在释放按键前，不允许按键
            return;
        }
        this.canPress = false;
        switch (event.keyCode) {
            case cc.KEY.left:
                if(this.dir != "right"){
                    this.dir = "left";
                }
                break;
            case cc.KEY.right:
                if(this.dir != "left"){
                    this.dir = "right";
                }
                break;
            case cc.KEY.up:
                if(this.dir != "down"){
                    this.dir = "up";
                }
                break;
            case cc.KEY.down:
                if(this.dir != "up"){
                    this.dir = "down";
                }
                break;
        }
    },

    onKeyUp: function(event) {
        switch (event.keyCode) {
            case cc.KEY.left:
                break;
            case cc.KEY.right:
                break;
            case cc.KEY.up:
                break;
            case cc.KEY.down:
                break;
        }
        this.canPress = true;
    },
    /**蛇相关代码-end */

    /**食物相关代码-start */
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
    /**食物相关代码-end */

    update: function(dt){
        //获取食物位置，检查是否吃到了食物
        this.isEat();
    },
    //是否吃到食物检查
    isEat: function(){
        var head = this.node.getChildByName("head");
        var apple = this.node.getChildByName("apple");
        //头和食物的距离小于等于蛇的中心点到食物的中心点时则认为吃到了食物
        if (cc.pDistance(head.getPosition(),apple.getPosition()) <= 22){
            //这块不需要销毁食物，直接改变食物的位置即可
            //apple.destroy();
            //this.createFood();
            apple.setPosition(this.initFoodPos());
            this.isAdd = true;
        }
    },
});
