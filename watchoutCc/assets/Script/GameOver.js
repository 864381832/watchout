var GameConfig = require("GameConfig");
var AnimLayerTool = require("AnimLayerTool");
var GameTools = require("GameTools");
var GameUiTools = require("GameUiTools");
cc.Class({
    extends: cc.Component,
    // name: 'GameOver',
    properties: {
        backColor: cc.Node,
        MainModeSprite: cc.Sprite,
        SecondModeSprite: cc.Sprite,
        scoreLabel: cc.Label,
        gameOverSprite: cc.Node,
        bestScoreLabel: cc.Label,
        newGameScoreNode: cc.Node,
        rankButton: cc.Node, //排行榜按钮
        shareButton: cc.Node, //分享按钮
        backButton: cc.Node, //返回按钮
        restartButton: cc.Node, //重新开始按钮
        rankingScrollView: cc.Sprite,//显示排行榜
    },

    onLoad() {
        if (GameConfig.IS_GAME_OVER) {
            this.backColor.color = cc.Color.GREEN;
        } else {
            this.backColor.color = cc.Color.RED;
        }
        if (GameConfig.MAIN_MENU_NUM == GameConfig.MainMenu.MainMenuNumLeft) {
            this.MainModeSprite.spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("leftMode");
        } else if (GameConfig.MAIN_MENU_NUM == GameConfig.MainMenu.MainMenuNumRight) {
            this.MainModeSprite.spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("rightMode");
        } else if (GameConfig.MAIN_MENU_NUM == GameConfig.MainMenu.MainMenuNumBoth) {
            this.MainModeSprite.spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("bothMode");
        }
        let gameDataName = "GAME_BEST_SCORE_" + GameConfig.MAIN_MENU_NUM + "_" + GameConfig.SUN_MENU_NUM;
        let gameDate = GameTools.getItemByLocalStorage(gameDataName, 0);
        if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum1) {
            if (GameConfig.IS_GAME_OVER) {
                if (GameConfig.GAME_START_TIME < gameDate || gameDate == 0) {
                    GameTools.playSimpleAudioEngine(2);
                    gameDate = GameConfig.GAME_START_TIME;
                    GameTools.setItemByLocalStorage(gameDataName, GameConfig.GAME_START_TIME);
                    this.newGameScoreNode.active = true;
                } else {
                    this.bestScoreLabel.node.getParent().active = true;
                    this.bestScoreLabel.string = gameDate.toFixed(3) + "''";
                }
                this.scoreLabel.node.active = true;
                this.scoreLabel.string = GameConfig.GAME_START_TIME.toFixed(3) + "''";
                GameTools.submitScore(gameDate); //提交得分
            } else {
                this.gameOverSprite.active = true;
                this.bestScoreLabel.node.getParent().active = true;
                this.bestScoreLabel.string = gameDate.toFixed(3) + "''";
            }
            this.SecondModeSprite.spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("SunMenuNum1");
        } else if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum2) {
            if (GameConfig.GAME_CARD_CLICK_NUM > gameDate) {
                GameTools.playSimpleAudioEngine(2);
                gameDate = GameConfig.GAME_CARD_CLICK_NUM;
                GameTools.setItemByLocalStorage(gameDataName, GameConfig.GAME_CARD_CLICK_NUM);
                this.newGameScoreNode.active = true;
            } else {
                this.bestScoreLabel.node.getParent().active = true;
                this.bestScoreLabel.string = gameDate;
            }
            this.scoreLabel.node.active = true;
            this.scoreLabel.string = GameConfig.GAME_CARD_CLICK_NUM;
            this.SecondModeSprite.spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("SunMenuNum2");
            GameTools.submitScore(gameDate); //提交得分
        } else if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum3) {
            if (GameConfig.IS_GAME_OVER) {
                if (GameConfig.GAME_CARD_CLICK_NUM > gameDate) {
                    GameTools.playSimpleAudioEngine(2);
                    gameDate = GameConfig.GAME_CARD_CLICK_NUM;
                    GameTools.setItemByLocalStorage(gameDataName, GameConfig.GAME_CARD_CLICK_NUM);
                    this.newGameScoreNode.active = true;
                } else {
                    this.bestScoreLabel.node.getParent().active = true;
                    this.bestScoreLabel.string = gameDate;
                }
                this.scoreLabel.node.active = true;
                this.scoreLabel.string = GameConfig.GAME_CARD_CLICK_NUM;
                GameTools.submitScore(gameDate); //提交得分
            } else {
                this.gameOverSprite.active = true;
                this.bestScoreLabel.node.getParent().active = true;
                this.bestScoreLabel.string = GameTools.getItemByLocalStorage(gameDataName, 0);
            }
            this.SecondModeSprite.spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("SunMenuNum3");
        }

        if (CC_WECHATGAME) {
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                SUN_MENU_NUM: GameConfig.SUN_MENU_NUM,
            });
        } else {
            cc.log("获取排行榜数据。" + GameConfig.MAIN_MENU_NUM + "_" + GameConfig.SUN_MENU_NUM);
            this.rankButton.getParent().active = false;
        }

        GameUiTools.setButtonClickEvents(this, this.rankButton, "buttonFunc");
        GameUiTools.setButtonClickEvents(this, this.shareButton, "buttonFunc");
        GameUiTools.setButtonClickEvents(this, this.backButton, "buttonFunc");
        GameUiTools.setButtonClickEvents(this, this.restartButton, "buttonFunc");
        this.showAnimation(true);
    },

    buttonFunc: function (event) {
        let button = event.target;
        if (this.rankButton == button) {
            GameTools.playSimpleAudioEngine(0);
            GameTools.getRankData();
        } else if (this.shareButton == button) {
            GameTools.playSimpleAudioEngine(4);
            setTimeout(() => {
                GameTools.sharePicture();
            }, 100);
        } else if (this.restartButton == button) {
            GameTools.playSimpleAudioEngine(0);
            this.restartResource("GameScene");
        } else if (this.backButton == button) {
            GameTools.playSimpleAudioEngine(0);
            this.restartResource("MenuUI");
        }
        return true;
    },
    restartResource(sceneName) {
        GameTools.removeRankData();
        GameUiTools.loadingScene(sceneName)
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
            AnimLayerTool.bottonAnim(this.shareButton);
            AnimLayerTool.bottonAnim(this.restartButton);
            AnimLayerTool.bottonAnim(this.backButton);
        }
    }
});
