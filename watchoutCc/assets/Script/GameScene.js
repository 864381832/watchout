var GameTools = require("GameTools");
var GameUiTools = require("GameUiTools");
var GameConfig = require("GameConfig");
var AnimLayerTool = require("AnimLayerTool");
cc.Class({
    extends: cc.Component,

    properties: {
        layerBack: cc.Node,
        bestLabel: cc.Label,
        scoreLabel: cc.Label,
        yuanyuan: cc.Node,
        fangfang: cc.Node,
        yuanyuanWing: cc.Node,
        fangfangWing: cc.Node,
    },

    ctor() {
        GameConfig.IS_GAME_START = false;
        GameConfig.GameScene = this;
    },
    onLoad() {
    },

    start() {
        this.layerBack.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.startGame();
        cc.director.getCollisionManager().enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;
    },

    onTouchBegan(event) {
        if (!GameConfig.IS_GAME_START) {
            return;
        }
        GameTools.playSimpleAudioEngine(3);
        let touchPoint = event.touch.getLocation();
        if (touchPoint.x < cc.director.getWinSize().width / 2) {
            if (this.yuanyuan.y < -106) {
                this.yuanyuan.rotation = -30;
                let jumpBy = cc.jumpBy(0.4, 30 - GameConfig.GameCore, 0, 140, 1);
                let rotateTo = cc.rotateTo(0.4, 0);
                this.yuanyuan.runAction(cc.spawn(jumpBy, rotateTo));
            }
        } else {
            if (this.fangfang.y < -106) {
                this.fangfang.rotation = 30;
                let jumpBy = cc.jumpBy(0.4, -30 + GameConfig.GameCore, 0, 140, 1);
                let rotateTo = cc.rotateTo(0.4, 0);
                this.fangfang.runAction(cc.spawn(jumpBy, rotateTo));
            }
        }
    },

    update(dt) {
        // if (!GameConfig.IS_GAME_START) {
        //     return;
        // }
        // if (this.yuanyuan.getBoundingBox().intersects(this.fangfang.getBoundingBox())) {
        //     this.gameOverScene();
        // }
    },
    gameCollision:function(){
        if (this.yuanyuan.scale == 0.5) {
            // this.yuanyuan.active = false;
            this.yuanyuan.number = 0;
            AnimLayerTool.createPopStarAnim(this.yuanyuan, 0);
            this.fangfang.pauseAllActions();
        } else {
            // this.fangfang.active = false;
            this.fangfang.number = 1;
            AnimLayerTool.createPopStarAnim(this.fangfang, 0);
            this.yuanyuan.pauseAllActions();
        }
        this.gameOverScene();
    },

//开始游戏
    startGame() {
        GameConfig.IS_GAME_START = true;
        GameConfig.GameCore = 0;
        this.scoreLabel.string = GameConfig.GameCore;
        this.bestLabel.string = GameConfig.GameHeightScore;
        this.resetRunner();
    },

    //随机产生身体小的
    resetRunner: function () {
        let random = Math.random();
        if (random < 0.5) {
            this.yuanyuan.setScale(0.5);
            this.fangfang.setScale(1);
        } else {
            this.fangfang.setScale(0.5);
            this.yuanyuan.setScale(1);
        }
        this.yuanyuan.x = -360 - 218;
        this.fangfang.x = 360 + 218;
        let move1 = cc.moveBy(2 - GameConfig.GameCore / 50, 720 + 218, 0);
        let move2 = cc.moveBy(2 - GameConfig.GameCore / 50, -720 - 218, 0);
        let moveFinish = cc.callFunc(this.callFuncCard, this);
        this.yuanyuan.runAction(cc.sequence(move1, moveFinish))
        this.fangfang.runAction(move2)
    },
    callFuncCard: function (sender) {
        GameTools.playSimpleAudioEngine(4);
        this.scoreLabel.string = ++GameConfig.GameCore;
        if (GameConfig.GameCore > GameConfig.GameHeightScore) {
            GameConfig.GameHeightScore = GameConfig.GameCore;
            this.bestLabel.string = GameConfig.GameHeightScore;
            GameTools.setItemByLocalStorage("GameHeightScore", GameConfig.GameHeightScore);
        }
        this.resetRunner();
    },
//游戏结束
    gameOverScene() {
        GameTools.playSimpleAudioEngine(2);
        GameConfig.IS_GAME_START = false;
        GameUiTools.loadingLayer("panel/GameOver");
    }
});
