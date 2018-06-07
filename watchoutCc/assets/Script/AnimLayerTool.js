var CardSprite = require("CardSprite");
var GameConfig = require("GameConfig");
var GameTools = require("GameTools");
var DEVICE_WIDTH = GameConfig.DEVICE_WIDTH;
var DEVICE_HEIGHT = GameConfig.DEVICE_HEIGHT;
var MoveButtonAnimType = {
    up: 0,//向上
    down: 1,//向下
    left: 2,//向左
    right: 3,//向右
    leftUp: 4,//左上
    leftDown: 5,//左下
    rightUp: 6,//右上
    rightDown: 7,//右下
};
var AnimLayerTool = {
    moveButtonAnimTime: 0.3,// 按钮动画移动时间
    MoveButtonAnimType: MoveButtonAnimType,
    bottonAnim: function (button) {// 创建按钮特效
        let arrayNode = new Array();
        if (button.length == undefined) {
            arrayNode[0] = button;
        } else {
            arrayNode = button;
        }
        for (let i = 0; i < arrayNode.length; i++) {
            let time = cc.random0To1() * 5 + 1;
            let width = arrayNode[i].height / 20.0;
            let anim1 = cc.jumpBy(time, cc.p(width, 0), width, 1);
            let anim2 = cc.jumpBy(time, cc.p(-width, 0), -width, 1);
            let anim3 = cc.scaleBy(0.3, 1.1, 0.9);
            let anim4 = cc.delayTime(time);
            let actions = cc.sequence(anim1, anim2, anim3, anim3.reverse(), anim4);
            arrayNode[i].runAction(actions.repeatForever());
        }
    },
    createShowMessageBox(x, y, name, rotation, parentNode) {
        let messageBack = new cc.Node();
        messageBack.addComponent(cc.Sprite).spriteFrame = GameTools.love2048FrameCache.getSpriteFrame("messageBox0");
        messageBack.setPosition(x, y);
        messageBack.rotation = rotation;
        messageBack.opacity = 0;
        parentNode.addChild(messageBack);
        let message = new cc.Node();
        message.setPosition(0, 30);
        if (name.indexOf("messageBox") != -1) {
            message.addComponent(cc.Sprite).spriteFrame = GameTools.love2048FrameCache.getSpriteFrame(name);
        } else {
            let lableNode = new cc.Node();
            let lable = lableNode.addComponent(cc.Label);
            lable.string = name;
            lable.fontSize = 30;
            lable.overflow = cc.Label.Overflow.CLAMP;
            lable.enableWrapText = true;
            lable.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            lable.verticalAlign = cc.Label.VerticalAlign.CENTER;
            lableNode.width = 220;
            lableNode.height = 300;
            message.addChild(lableNode);
        }
        messageBack.addChild(message);
        let action1 = cc.fadeIn(0.2);
        let action2 = cc.delayTime(1);
        let action3 = cc.fadeOut(0.2);
        let moveFinish = cc.callFunc(this.callFuncAddScore, this, messageBack);
        let action4 = cc.sequence(action1, action2, action3, moveFinish);
        messageBack.runAction(action4);
    },

    callFuncAddScore(sender, node) //创建加分动画监听
    {
        sender.destroy();
    },

    createPopStarAnim(from, dTime) //创建卡片爆炸特效
    {
        let moveFinish2 = cc.callFunc(this.callFuncPopStarAnim, this, from);
        // from.runAction(cc.sequence(cc.delayTime(dTime), moveFinish2, cc.hide()));
        from.runAction(cc.sequence(cc.delayTime(dTime), moveFinish2, cc.fadeOut()));
    },
    callFuncPopStarAnim(sender, from) //卡片爆炸特效监听
    {
        GameTools.playSimpleAudioEngine(0);
        let emitterNode = new cc.Node();
        emitterNode.setPosition(from.getPosition());
        let move_emitter = emitterNode.addComponent(cc.ParticleSystem);
        move_emitter.texture = "res/raw-assets/resources/stars.png";
        // let move_emitter = ParticleExplosion.createWithTotalParticles(30);
        // let move_emitter = new cc.ParticleSystem(30);
        switch (from.getNumber()) {
            case 2:
                move_emitter.startColor = cc.color(254, 9, 109);
                break;
            case 4:
                move_emitter.startColor = cc.color(252, 14, 252);
                break;
            case 8:
                move_emitter.startColor = cc.color(226, 17, 251);
                break;
            case 16:
                move_emitter.startColor = cc.color(162, 15, 255);
                break;
            case 32:
                move_emitter.startColor = cc.color(71, 222, 255);
                break;
            case 64:
                move_emitter.startColor = cc.color(0, 204, 255);
                break;
            case 128:
                move_emitter.startColor = cc.color(184, 255, 48);
                break;
            case 256:
                move_emitter.startColor = cc.color(253, 44, 129);
                break;
            case 512:
                move_emitter.startColor = cc.color(254, 170, 47);
                break;
            case 1024:
                move_emitter.startColor = cc.color(253, 44, 129);
                break;
            case 2048:
                move_emitter.startColor = cc.color(31, 214, 254);
                break;
            case 4096:
                move_emitter.startColor = cc.color(255, 28, 121);
                break;
            case 8192:
                move_emitter.startColor = cc.color(17, 64, 139);
                break;
            case 16384:
                move_emitter.startColor = cc.color(131, 32, 254);
                break;
            case 32768:
                move_emitter.startColor = cc.color(41, 122, 255);
                break;
            case 65536:
                move_emitter.startColor = cc.color(190, 50, 129);
                break;
            case 131072:
                move_emitter.startColor = cc.color(30, 170, 45);
                break;
            default:
                move_emitter.startColor = cc.color(253, 44, 129);
                break;
        }
        move_emitter.startColorVar = cc.color(0, 0, 0, 0);
        move_emitter.endColorVar = cc.color(0, 0, 0, 0);
        move_emitter.endColor = move_emitter.startColor;
        move_emitter.autoRemoveOnFinish = true;

        move_emitter.duration = 0.1;
        move_emitter.emissionRate = 100;
        move_emitter.life = 2;
        move_emitter.lifeVar = 0.5;
        move_emitter.angle = 90;
        move_emitter.angleVar = 360;
        move_emitter.custom = true;
        move_emitter.playOnLoad = true;
        from.getParent().addChild(emitterNode);
    },
    /*
    *显示二级菜单动画
    */
    ShowSunMenuNumButton: function (MainMenuButton, SunMenuNumButton, customEventData) {
        let move1 = cc.moveTo(0.2, MainMenuButton[customEventData].getPosition());
        for (let i = 0; i < 3; i++) {
            if (i != customEventData) {
                MainMenuButton[i].runAction(move1.clone());
            }
        }
        let moveFinish1 = cc.callFunc(this.callFuncSunMenuNumButton, this, [MainMenuButton, SunMenuNumButton, customEventData]);
        MainMenuButton[customEventData].runAction(cc.sequence(cc.delayTime(0.2), moveFinish1));
    },
    callFuncSunMenuNumButton(sender, funData) {
        let MainMenuButton = funData[0];
        let SunMenuNumButton = funData[1];
        let customEventData = funData[2];
        let move = [];
        if (customEventData == 0) {
            move[0] = cc.moveTo(0.3, 70, 380);
            move[1] = cc.moveTo(0.3, 181, 230);
            move[2] = cc.moveTo(0.3, 70, 80);
        } else if (customEventData == 1) {
            move[0] = cc.moveTo(0.3, -70, 380);
            move[1] = cc.moveTo(0.3, -181, 230);
            move[2] = cc.moveTo(0.3, -70, 80);
        } else if (customEventData == 2) {
            move[0] = cc.moveTo(0.3, -200, 145);
            move[1] = cc.moveTo(0.3, 0, 225);
            move[2] = cc.moveTo(0.3, 200, 145);
        }
        let move4 = cc.fadeIn();
        for (let i = 0; i < 3; i++) {
            if (i != customEventData) {
                MainMenuButton[i].active = false;
            }
            SunMenuNumButton[i].active = true;
            SunMenuNumButton[i].setPosition(MainMenuButton[customEventData].getPosition());
            move[i].easing(cc.easeBackOut());
            let move3 = cc.delayTime(i * 0.05);
            SunMenuNumButton[i].runAction(cc.sequence(move3, move4.clone(), move[i]));
        }
    },

    /*
   *显示主菜单动画
   */
    ShowMainMenuButton: function (MainMenuButton, SunMenuNumButton, customEventData) {
        let move1 = cc.moveTo(0.2, MainMenuButton[customEventData].getPosition());
        let moveFinish1 = cc.callFunc(this.callFuncMainMenuButton, this, [MainMenuButton, SunMenuNumButton, customEventData]);
        let move4 = cc.fadeOut();
        for (let i = 1; i < 3; i++) {
            let move3 = cc.delayTime((2 - i) * 0.05);
            SunMenuNumButton[i].runAction(cc.sequence(move3, move1.clone(), move4.clone()));
        }
        SunMenuNumButton[0].runAction(cc.sequence(cc.delayTime(2 * 0.05), move1, move4, moveFinish1));
    },
    callFuncMainMenuButton: function (sender, funData) {
        let MainMenuButton = funData[0];
        let SunMenuNumButton = funData[1];
        let customEventData = funData[2];
        let move = [];
        move[0] = cc.moveTo(0.3, -180, 230);
        move[1] = cc.moveTo(0.3, 180, 230);
        move[2] = cc.moveTo(0.3, 0, -120);
        for (let i = 0; i < 3; i++) {
            SunMenuNumButton[i].active = false;
            if (i != customEventData) {
                MainMenuButton[i].active = true;
                move[i].easing(cc.easeBackOut());
                MainMenuButton[i].runAction(move[i]);
            }
        }
    },
};

module.exports = AnimLayerTool;