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
            window.wx.showShareMenu({withShareTicket: true});
            window.wx.onShareAppMessage(function () {
                // 用户点击了“转发”按钮
                return {
                    title: '快来跟我一起挑战大鸟撞小鸟吧。',
                    imageUrl: canvas.toTempFilePathSync({
                        destWidth: 500,
                        destHeight: 400
                    })
                }
            });
            let LaunchOption = wx.getLaunchOptionsSync();
            if (LaunchOption.shareTicket != undefined) {
                setTimeout(() => {
                    console.log("shareTicket", LaunchOption)
                    GameTools.getRankData(LaunchOption.shareTicket);
                }, 3000);
            }
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
});
