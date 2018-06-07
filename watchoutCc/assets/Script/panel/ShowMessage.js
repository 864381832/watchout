var GameConfig = require("GameConfig");
var GameTools = require("GameTools");
var GameUiTools = require("GameUiTools");
cc.Class({
    extends: cc.Component,

    properties: {
        messageLabel: cc.Label,
        backButton: cc.Node,//返回按钮
        toastType: 0,
    },

    start() {
        let toastMessage = null;
        if (this.toastType == 0) {
            toastMessage = "欢迎进入浪漫2048";
        } else if (this.toastType == 1) {
            toastMessage = "该功能苦逼的程序员还在努力开发中，欢迎留言反馈！";
        } else if (this.toastType == 2) {
            toastMessage = "积分不足！！！您可以玩游戏来获取积分，还可以每天登录赚取积分！";
        } else if (this.toastType == 3) {
            toastMessage = "最多只能后退3步！！！";
        } else if (this.toastType == 4) {
            toastMessage = "只能后退1步！！！";
        } else if (this.toastType == 5) {
            toastMessage = "该模式暂无帮助，谢谢！！！";
        } else if (this.toastType == 6) {
            toastMessage = "积分不足！！！您需要300积分来复活。";
        } else if (this.toastType == 7) {
            toastMessage = "恭喜充值成功，感谢您对浪漫2048的支持！！！";
        } else if (this.toastType == 8) {
            toastMessage = "充值失败，谢谢支持！！！";
        } else if (this.toastType == 9) {
            toastMessage = "今天首次进入奖励100积分，每天首次进入游戏都会获取积分哟！！！";
        } else if (this.toastType == 10) {
            toastMessage = "没有找到应用市场";
        } else if (this.toastType == 11) {
            toastMessage = "恭喜获得奖励10积分，感谢您对浪漫2048的支持";
        } else if (this.toastType == 12) {
            toastMessage = "您今天已经领过奖励了，谢谢";
        } else if (this.toastType == 13) {
            toastMessage = "聚合模式暂无自动功能，谢谢";
        } else if (this.toastType == 14) {
            toastMessage = "恭喜获得奖励100积分，感谢您对浪漫2048的支持";
        } else if (this.toastType == 15) {
            toastMessage = "经典模式不能使用道具功能，您可以去试试其它玩法哟！";
        } else if (this.toastType == 16) {
            toastMessage = "上传得分失败，请检查网络";
        } else if (this.toastType == 17) {
            toastMessage = "排行榜数据失败，请检查网络";
        } else if (this.toastType == 18) {
            toastMessage = "上传得分成功，赶紧去看看排行榜吧";
        } else if (this.toastType == 19) {
            toastMessage = "视频奖励";
        } else if (this.toastType == 20) {
            toastMessage = "保存图片成功";
        } else if (this.toastType == 21) {
            toastMessage = "保存图片失败";
        } else if (this.toastType == 22) {
            toastMessage = "点击需要消除的爱心即可消除该爱心！";
        } else if (this.toastType == 23) {
            toastMessage = "点击需要换位的爱心将会选中该爱心，继续点击该爱心周边的爱心即可实现爱心的换位！";
        } else if (this.toastType == 24) {
            toastMessage = "点击需要缩小数字的爱心即可将该爱心的数字缩小2倍";
        } else if (this.toastType == 25) {
            toastMessage = "点击需要消除的爱心即可消除与该爱心同横排的爱心！";
        } else if (this.toastType == 26) {
            toastMessage = "点击需要消除的爱心即可消除与该爱心同竖排的爱心！";
        } else if (this.toastType == 27) {
            toastMessage = "视频播放失败，谢谢！！";
        } else if (this.toastType == 28) {
            toastMessage = "滑动屏幕来移动小方块，两个数字一样的小方块相撞时就会相加合成一个方块，每次操作之后会在空白的方格处随机生成一个2或4的方块，最终得到一个2048的方块就算胜利了，如果16个格子全部填满无法移动的话则游戏结束。";
        } else if (this.toastType == 29) {
            toastMessage = "点击空白爱心，爱心会向点击的位置靠拢，当两个数字相同的爱心相遇时就会合并为两数字之和，全部填满无法移动的话则游戏结束。";
        } else if (this.toastType == 30) {
            toastMessage = "选中连接在一起的相同数字，点击的数字会聚合为更大的数字，其它数字则消除，完成通关所需得分即可进入下一关，否则游戏结束。";
        } else if (this.toastType == 31) {
            toastMessage = "选中连接在一起的相同数字，选中的数字将会被消除，完成通关所需得分即可进入下一关，否则游戏结束。";
        }else {
            toastMessage = this.toastType;
        }
        this.messageLabel.string = toastMessage;

        // GameUiTools.setButtonClickEvents(this, this.backButton, "backButtonFunc");
        // GameUiTools.setButtonClickEvents(this, this.node, "backButtonFunc");
        // if (CC_WECHATGAME) {
        //     this.node.destroy();
        //     wx.showModal({title: "浪漫提示", content: toastMessage,showCancel:false});
        // }
    },

    backButtonFunc: function (event) {
        GameTools.playSimpleAudioEngine(0);
        this.node.destroy();
    },
});
