var BreakPlank = require("BreakPlank");
var GameTools = require("GameTools");
var GameUiTools = require("GameUiTools");
var GameConfig = require("GameConfig");
cc.Class({
    extends: cc.Component,

    properties: {
        layerBack: cc.Node,
        showHelpSprite: [cc.Node],
        startTime: 0,
        timerLabel: cc.Label,
        isCountDownMusic: true,//是否倒计时
        breakPlank: new Array(2),
    },

    ctor() {
        GameConfig.IS_GAME_START = false;
        GameConfig.GAME_CARD_CLICK_NUM = 0;
        GameConfig.GAME_START_TIME = 0;
        GameConfig.AUTO_ADD_GAME_CARD_NUM = -1;

        GameConfig.GameScene = this;
    },
    onLoad() {
        if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum1) {
            this.timerLabel.string = "0.000''";
        }
        if (GameConfig.MAIN_MENU_NUM == GameConfig.MainMenu.MainMenuNumLeft) {
            this.breakPlank[0] = BreakPlank.createBreakPlank(0, -GameConfig.DEVICE_WIDTH / 2.0, -GameConfig.DEVICE_WIDTH / 2.0 + GameConfig.CARD_WIDTH / 2);
            this.node.addChild(this.breakPlank[0], 1, 1);
        } else if (GameConfig.MAIN_MENU_NUM == GameConfig.MainMenu.MainMenuNumRight) {
            this.breakPlank[1] = BreakPlank.createBreakPlank(1, GameConfig.DEVICE_WIDTH / 2.0, -GameConfig.DEVICE_WIDTH / 2 + GameConfig.CARD_WIDTH / 2);
            this.node.addChild(this.breakPlank[1], 1, 1);
        } else if (GameConfig.MAIN_MENU_NUM == GameConfig.MainMenu.MainMenuNumBoth) {
            this.breakPlank[0] = BreakPlank.createBreakPlank(0, -GameConfig.DEVICE_WIDTH / 2, -GameConfig.DEVICE_WIDTH / 2 + GameConfig.CARD_WIDTH / 2);
            this.breakPlank[1] = BreakPlank.createBreakPlank(1, GameConfig.DEVICE_WIDTH / 2.0, -GameConfig.DEVICE_WIDTH / 2 + GameConfig.CARD_WIDTH / 2);
            this.node.addChild(this.breakPlank[0], 1, 1);
            this.node.addChild(this.breakPlank[1], 1, 1);
        }
        this.showHelpView(true);
    },

    start() {
    },

    update(dt) {
        if (!GameConfig.IS_GAME_START) {
            return;
        }
        GameConfig.GAME_START_TIME = (new Date().getTime() - this.startTime) / 1000;
        if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum1) {
            this.timerLabel.string = GameConfig.GAME_START_TIME.toFixed(3) + "''";
            if (GameConfig.MAIN_MENU_NUM == GameConfig.MainMenu.MainMenuNumBoth) {
                if (GameConfig.GAME_CARD_CLICK_NUM == 36) {
                    this.gameOverScene(true);
                }
            } else {
                if (GameConfig.GAME_CARD_CLICK_NUM == 24) {
                    this.gameOverScene(true);
                }
            }
        } else if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum2) {
            this.timerLabel.string = GameConfig.GAME_CARD_CLICK_NUM;
            if (GameConfig.MAIN_MENU_NUM == GameConfig.MainMenu.MainMenuNumBoth) {
                if (GameConfig.AUTO_ADD_GAME_CARD_NUM - 2 > GameConfig.GAME_CARD_CLICK_NUM) {
                    this.gameOverScene(false);
                }
            } else {
                if (GameConfig.AUTO_ADD_GAME_CARD_NUM - 1 > GameConfig.GAME_CARD_CLICK_NUM) {
                    this.gameOverScene(false);
                }
            }
        } else if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum3) {
            this.timerLabel.string = GameConfig.GAME_CARD_CLICK_NUM;
            if (this.isCountDownMusic && GameConfig.GAME_START_TIME > 9.7) {
                this.isCountDownMusic = false;
                this.schedule(this.CountDownMusic, 1.0, 3, 0);
            }
            if (GameConfig.GAME_START_TIME > 15) {
                this.gameOverScene(true);
            }
        }
    },

    showHelpView(isShow) {
        this.showHelpSprite[0].active = isShow;
        this.showHelpSprite[1].active = isShow;
    },

    CountDownMusic(dt) {//倒计时声音
        GameTools.playSimpleAudioEngine(3);
    },

//开始计时
    startTimer() {
        this.showHelpView(false);
        this.startTime = new Date().getTime();
    },

//游戏结束
    gameOverScene(skipType) {
        GameTools.playSimpleAudioEngine(5);
        GameConfig.IS_GAME_OVER = skipType;
        GameConfig.IS_GAME_START = false;
        GameUiTools.loadingScene("GameOver");
    }
});
