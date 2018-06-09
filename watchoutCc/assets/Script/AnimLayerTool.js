var GameConfig = require("GameConfig");
var GameTools = require("GameTools");
var AnimLayerTool = {
    moveButtonAnimTime: 0.3,// 按钮动画移动时间
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
        from.runAction(cc.sequence(cc.delayTime(dTime), moveFinish2, cc.fadeOut()));
    },
    callFuncPopStarAnim(sender, from) //卡片爆炸特效监听
    {
        // GameTools.playSimpleAudioEngine(0);
        let emitterNode = new cc.Node();
        emitterNode.setPosition(from.getPosition());
        let move_emitter = emitterNode.addComponent(cc.ParticleSystem);
        move_emitter.texture = "res/raw-assets/resources/stars.png";
        switch (from.number) {
            case 0:
                move_emitter.startColor = cc.color(255,226,0);
                break;
            case 1:
                move_emitter.startColor = cc.color(235,110,165);
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
        move_emitter.emissionRate = 200;
        move_emitter.life = 2;
        move_emitter.lifeVar = 0.5;
        move_emitter.angle = 90;
        move_emitter.angleVar = 360;
        move_emitter.custom = true;
        move_emitter.playOnLoad = true;
        from.getParent().addChild(emitterNode);
        from.active = false;
    },
};

module.exports = AnimLayerTool;