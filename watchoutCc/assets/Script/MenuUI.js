var GameTools = require("GameTools");
var GameUiTools = require("GameUiTools");
var GameConfig = require("GameConfig");
var AnimLayerTool = require("AnimLayerTool");
cc.Class({
    extends: cc.Component,

    properties: {
        layerBack: cc.Node,
        startGameButton: cc.Node,
        musicButton: cc.Node,
        anbotButton: cc.Node,//关于按钮
    },

    onLoad() {
        if (!GameConfig.IS_GAME_MUSIC) {
            this.musicButton.getComponent(cc.Sprite).spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("music2");
        }
        GameUiTools.setButtonClickEvents(this, this.startGameButton, "startGameButtonFunc", 1, false);
        GameUiTools.setButtonClickEvents(this, this.musicButton, "musicButtonFunc");
        GameUiTools.setButtonClickEvents(this, this.anbotButton, "anbotButtonFunc");
    },

    start() {
        if (CC_WECHATGAME) {
            if (GameConfig.GameClubButton != null) {
                GameConfig.GameClubButton.show();
            }
        }
    },

    startGameButtonFunc: function (event, customEventData) {
        GameTools.playSimpleAudioEngine(0);
        cc.log("开始")
    },

    musicButtonFunc: function () {
        GameTools.playSimpleAudioEngine(0);
        GameConfig.IS_GAME_MUSIC = !GameConfig.IS_GAME_MUSIC;
        GameTools.setItemByLocalStorage("IS_GAME_MUSIC", GameConfig.IS_GAME_MUSIC);
        if (GameConfig.IS_GAME_MUSIC) {
            this.musicButton.getComponent(cc.Sprite).spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("music1");
        } else {
            this.musicButton.getComponent(cc.Sprite).spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("music2");
        }
    },

    anbotButtonFunc: function (event) {
        GameTools.playSimpleAudioEngine(0);
        cc.director.loadScene("AboutGame");
    },

    loadingResource: function () {
        cc.director.loadScene('GameScene');
    },

    onDestroy() {
        if (CC_WECHATGAME) {
            if (GameConfig.GameClubButton != null) {
                GameConfig.GameClubButton.hide();
            }
        }
    },
});
