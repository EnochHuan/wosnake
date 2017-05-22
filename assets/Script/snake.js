cc.Class({
    extends: cc.Component,

    properties: {
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
        //引入游戏画布
        bg: {
            default: null,
            type: cc.Node
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

    //初始化蛇
    initSnake: function(){
        this.canPress = true;
        //生成蛇头
        var head = cc.instantiate(this.headPrefab);
        // 添加蛇头
        this.node.addChild(head);
        this.updateHeadPos(head);
        head.dir = "left";

        var pre;
        for(var i = 0; i < this.len; i++){
            if(i == 0){
                pre = head;
            }
            pre = this.createBody(pre,i);
            pre.dir = "left";
        }
        //用定时器定时执行刷新
        this.schedule(this.updatePos, this.snakeSpeed);
    },
    // use this for initialization
    onLoad: function () {
        this.initSnake();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    //更新位置坐标
    updatePos: function(){
        var bodys = this.node.children;
        var head;
        for(var i = 0; i < bodys.length; i++){
            var pre;
            if(i == 0){
                head = bodys[i];
                head.lastDir = head.dir;
                head.dir = this.dir;
                this.updateHeadPos(head);
                this.updatePosHand(this.dir,head);
            }else{
                pre = bodys[i-1];
                var cur = bodys[i];
                cur.lastDir = cur.dir;
                cur.dir = pre.lastDir;
                this.updatePosHand(pre.lastDir,cur);
            }
        }
        //获取食物位置，检查是否吃到了食物
    },

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
        if(!this.canPress){//按键检查
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

});
