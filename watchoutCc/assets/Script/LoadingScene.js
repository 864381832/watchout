var GameTools = require("GameTools");
var GameConfig = require("GameConfig");
cc.Class({
    extends: cc.Component,
    properties: {},

    start() {
        setTimeout(() => {
            this.loadingResource();
        }, 10);
    },

    loadingResource() {
        GameConfig.IS_GAME_MUSIC = GameTools.getItemByLocalStorage("IS_GAME_MUSIC", true);
        GameConfig.GameHeightScore = GameTools.getItemByLocalStorage("GameHeightScore", 0);
        this.initFrameCache();
        this.initWxSetting();
        cc.director.preloadScene("MenuUI", function () {
            cc.director.loadScene("MenuUI");
        });
    },
    initFrameCache: function () {
        cc.loader.loadRes("watchout", cc.SpriteAtlas, function (err, atlas) {
            GameTools.love2048FrameCache = atlas;
        });
    },
    initWxSetting: function () {
        if (CC_WECHATGAME) {
            window.wx.onHide(function () {//监听小游戏隐藏到后台事件
                // if (GameConfig.loadingSceneType == GameConfig.LoadingSceneType.LoadingSceneEnterGame && !GameConfig.IS_GAME_OVER) {
                //     cc.sys.localStorage.setItem("MAIN_MENU_NUM", GameConfig.MAIN_MENU_NUM);
                // }
            });
            window.wx.showShareMenu({withShareTicket: true});
            window.wx.onShareAppMessage(function () {
                // 用户点击了“转发”按钮
                return {
                    title: '快来跟我一起挑战踩你妹。',
                    imageUrl: canvas.toTempFilePathSync({
                        destWidth: 500,
                        destHeight: 400
                    })
                }
            });
            let LaunchOption = wx.getLaunchOptionsSync();
            // if (LaunchOption.query != {} && LaunchOption.query.x != undefined) {
            // GameConfig.MAIN_MENU_NUM = Number(LaunchOption.query.x);
            // }
            if (LaunchOption.shareTicket != undefined) {
                setTimeout(() => {
                    console.log("shareTicket", LaunchOption)
                    GameTools.getRankData(LaunchOption.shareTicket);
                }, 3000);
            }
            // window.wx.removeUserCloudStorage({keyList: ["x0_0"]});
            if (GameTools.getItemByLocalStorage("UserPlayGame", true)) {
                cc.sys.localStorage.setItem("UserPlayGame", false);
                // 对用户托管数据进行写数据操作
                window.wx.setUserCloudStorage({
                    KVDataList: [{key: "UserPlayGame", value: "1"}],
                });
            }
            let info = window.wx.getSystemInfoSync();
            GameConfig.GameClubButton = window.wx.createGameClubButton({
                icon: 'green',
                style: {
                    left: info.windowWidth / 6,
                    top: info.windowHeight * 91 / 100,
                    width: 40,
                    height: 40
                }
            });
            GameConfig.GameClubButton.hide()
        }
    },
    loadingGame: function () {
        // cc.sys.localStorage.setItem("MAIN_MENU_NUM", -1000);
        // if (GameConfig.MAIN_MENU_NUM == 1) {
        //     GameConfig.CAED_LINES = 4;
        //     GameConfig.mainMenu = GameConfig.MainMenu.MainMenuNumBoth;
        // } else {
        //     GameConfig.CAED_LINES = 5;
        //     GameConfig.GameChallengeType = -GameConfig.MAIN_MENU_NUM;
        //     GameConfig.mainMenu = GameConfig.MainMenu.MainMenuNumLeft;
        // }
        // GameConfig.CARD_WIDTH = (GameConfig.DEVICE_WIDTH - GameConfig.DEVICE_WIDTH / 10.0) / (GameConfig.CAED_LINES + 1);
    }
});
