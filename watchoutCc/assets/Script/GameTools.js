var GameConfig = require("GameConfig");
var GameTools = {
    love2048FrameCache: null,
    numberLabelAtlas: null,
    playSimpleAudioEngine: function (engineType) {
        if (GameConfig.IS_GAME_MUSIC) {
            switch (engineType) {
                case 0:
                    cc.audioEngine.play(cc.url.raw('resources/audios/sfx_button.wav'), false, 0.5);
                    break;
                case 1:
                    cc.audioEngine.play(cc.url.raw('resources/audios/sfx_highscore.wav'), false, 0.5);
                    break;
                case 2:
                    cc.audioEngine.play(cc.url.raw("resources/audios/sfx_player_die.wav"), false, 0.5);
                    break;
                case 3:
                    cc.audioEngine.play(cc.url.raw("resources/audios/sfx_player_jump.wav"), false, 0.5);
                    break;
                case 4:
                    cc.audioEngine.play(cc.url.raw("resources/audios/sfx_score.wav"), false, 0.5);
                    break;
                default:
                    break;
            }
        }
    },
    getItemByLocalStorage: function (key, value) {
        let values = cc.sys.localStorage.getItem(key);
        if (values === undefined || values === null || values === '') {
            cc.sys.localStorage.setItem(key, value);
            return value;
        }
        if (typeof value === 'boolean') {
            if (typeof values === 'boolean') {
                return values;
            }
            return "true" == values;
        } else if (typeof value === 'number') {
            return Number(values);
        }
        return values;
    },
    setItemByLocalStorage: function (key, value) {
        cc.sys.localStorage.setItem(key, value);
    },
    toastMessage(toastType) {
        cc.loader.loadRes("panel/ShowMessage", (err, prefab) => {
            if (!err) {
                var node = cc.instantiate(prefab);
                node.getComponent(cc.Component).toastType = toastType;
                cc.director.getScene().getChildByName('Canvas').addChild(node);
            }
        });
    }
    , showSpotAds(type) { //显示插屏广告
    }
    , autoShowSpotAds(times) {
    }
    , showAddInteardlView() { //显示获取积分窗口
    }
    , showGameHelp() //显示游戏帮助
    {
    }
    , sharePicture(pictureName) {
        let titleStr = '快来跟我一起挑战大鸟撞小鸟吧。';
        if ("shareTicket" == pictureName) {
            titleStr = "看看你在群里排第几？快来和我挑战大鸟撞小鸟吧。";
        } else if (pictureName != undefined && pictureName != null) {
            // titleStr = "我得了" + pictureName + "分," + titleStr;
        }
        if (CC_WECHATGAME) {
            window.wx.shareAppMessage({
                title: titleStr,
                query: "x=" + GameConfig.MAIN_MENU_NUM,
                imageUrl: canvas.toTempFilePathSync({
                    destWidth: 500,
                    destHeight: 400
                }),
                success: (res) => {
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        if ("shareTicket" == pictureName) {
                            window.wx.postMessage({
                                messageType: 5,
                                MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                                shareTicket: res.shareTickets[0]
                            });
                        }
                    }
                }
            });
        } else {
            this.toastMessage(1);
            cc.log("执行了截图" + titleStr);
        }
    },
    getGameIntegral() { //获取积分
        return this.getItemByLocalStorage("GameIntegral", 0);
    },
    setGameIntegral(intrgral) { // 设置积分
        cc.sys.localStorage.setItem("GameIntegral", intrgral);
        // if (GameConfig.GameScene != undefined || GameConfig.GameScene != null) {
        //     GameConfig.GameScene.gameIntegral.string = intrgral;
        // }
    }
    , commentGame() { //评论
        if (CC_WECHATGAME) {
            window.wx.openCustomerServiceConversation({});
        } else {
            this.toastMessage(1);
            cc.log("执行了评论")
        }
    }
    , checkFirstLoginGame() { //检查是否首次登录
        let loginDate = Math.floor((new Date().getTime() - new Date(2018, 3, 18, 0, 0, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
        if (loginDate > this.getItemByLocalStorage("FirstEnterGameDate", 0)) {
            cc.sys.localStorage.setItem("FirstEnterGameDate", loginDate);
            this.setGameIntegral(this.getGameIntegral() + 100);
            this.toastMessage(9)
        }
    }

    , getRankData(shareTicket) { //获取排行榜
        cc.loader.loadRes("panel/RankingListView", (err, prefab) => {
            if (!err) {
                var node = cc.instantiate(prefab);
                if (shareTicket != undefined) {
                    node.getComponent(cc.Component).shareTicket = shareTicket;
                }
                cc.director.getScene().children[0].addChild(node);
            }
        });
    }
    , removeRankData() {//移除排行榜数据
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 0,
            });
        } else {
            cc.log("移除排行榜数据。");
        }
    }
    , submitScore(score) { //提交得分
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                score: score,
            });
        } else {
            cc.log("提交得分:" + GameConfig.MAIN_MENU_NUM + " : " + score)
        }
    }
};

module.exports = GameTools;