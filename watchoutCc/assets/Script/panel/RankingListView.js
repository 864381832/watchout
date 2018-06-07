var GameConfig = require("GameConfig");
var AnimLayerTool = require("AnimLayerTool");
var GameTools = require("GameTools");
var GameUiTools = require("GameUiTools");
cc.Class({
    extends: cc.Component,
    // name: "RankingListView",
    properties: {
        MainModeSprite: cc.Sprite,
        SecondModeSprite: cc.Sprite,
        backButton: cc.Node,
        shareButton: cc.Node,
        rankingScrollView: cc.Sprite,//显示排行榜
        shareTicket: null,
    },
    onLoad() {
        if (GameConfig.MAIN_MENU_NUM == GameConfig.MainMenu.MainMenuNumLeft) {
            this.MainModeSprite.spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("leftMode");
        } else if (GameConfig.MAIN_MENU_NUM == GameConfig.MainMenu.MainMenuNumRight) {
            this.MainModeSprite.spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("rightMode");
        } else if (GameConfig.MAIN_MENU_NUM == GameConfig.MainMenu.MainMenuNumBoth) {
            this.MainModeSprite.spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("bothMode");
        }
        if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum1) {
            this.SecondModeSprite.spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("SunMenuNum1");
        } else if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum2) {
            this.SecondModeSprite.spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("SunMenuNum2");
        } else if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum3) {
            this.SecondModeSprite.spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("SunMenuNum3");
        }
        this.showAnimation(true);
    },
    start() {
        GameUiTools.setButtonClickEvents(this, this.backButton, "backButtonFunc");
        GameUiTools.setButtonClickEvents(this, this.shareButton, "shareButtonFunc");
        AnimLayerTool.createShowMessageBox(120, -350, "分享到群里可查看群排行榜！", 0, this.node);
        if (this.shareTicket != null) {
            let shareNode = new cc.Node();
            shareNode.addComponent(cc.Label).string = "群排行";
            shareNode.setPosition(-260, 503);
            this.node.addChild(shareNode);
        }
        if (CC_WECHATGAME) {
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;
            // 发消息给子域
            cc.log(this.shareTicket)
            if (this.shareTicket != null) {
                window.wx.postMessage({
                    messageType: 5,
                    MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                    SUN_MENU_NUM: GameConfig.SUN_MENU_NUM,
                    shareTicket: this.shareTicket
                });
            } else {
                window.wx.postMessage({
                    messageType: 1,
                    MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                    SUN_MENU_NUM: GameConfig.SUN_MENU_NUM,
                });
            }
        } else {
            let gameTypeNode = new cc.Node();
            gameTypeNode.addComponent(cc.Label).string = "暂无排行榜数据";
            this.node.addChild(gameTypeNode);
            cc.log("获取排行榜数据。" + GameConfig.MAIN_MENU_NUM + "_" + GameConfig.SUN_MENU_NUM);
        }
    },

    shareButtonFunc: function (event) {
        GameTools.playSimpleAudioEngine(4);
        setTimeout(() => {
            GameTools.sharePicture("shareTicket");
        }, 100);
    },

    backButtonFunc: function (event) {
        GameTools.playSimpleAudioEngine(0);
        GameTools.removeRankData();
        if (CC_WECHATGAME) {
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                SUN_MENU_NUM: GameConfig.SUN_MENU_NUM,
            });
        }
        this.node.destroy();
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (CC_WECHATGAME) {
            if (window.sharedCanvas != undefined) {
                this.tex.initWithElement(window.sharedCanvas);
                this.tex.handleLoadedTexture();
                this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
            }
        }
    },
    update() {
        this._updateSubDomainCanvas();
    },
    showAnimation(isShow) {
        if (isShow) {
            AnimLayerTool.bottonAnim(this.MainModeSprite.node);
            AnimLayerTool.bottonAnim(this.SecondModeSprite.node);
            AnimLayerTool.bottonAnim(this.backButton);
            AnimLayerTool.bottonAnim(this.shareButton);
        }
    }
});
