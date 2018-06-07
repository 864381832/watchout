var GameConfig = require("GameConfig");
var GameTools = require("GameTools");
var GameUiTools = {
    newSprite: function (spriteName,isCache) {
        let sprite = new cc.Node();
        if(isCache){
            spriteName = spriteName.split('.')[0];
            sprite.addComponent(cc.Sprite).spriteFrame = GameTools.love2048FrameCache.getSpriteFrame(spriteName);
        }else {
            sprite.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame("res/raw-assets/resources/" + spriteName);
        }
        return sprite;
    },
    setNodeSpriteFrame: function (node, spriteName) {
        node.getComponent(cc.Sprite).spriteFrame = GameTools.love2048FrameCache.getSpriteFrame(spriteName);
    },
    setButtonClickEvents: function (component, menu, handler, customEventData,isScale) {
        let arrayMenu = new Array();
        if (menu.length == undefined) {
            arrayMenu[0] = menu;

        } else {
            arrayMenu = menu;
        }
        for (let i = 0; i < arrayMenu.length; i++) {
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = component.node; //这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = component.node.name;//这个是代码文件名
            clickEventHandler.handler = handler;
            if (menu.length == undefined) {
                clickEventHandler.customEventData = customEventData;
            } else {
                clickEventHandler.customEventData = i;
            }
            let button = arrayMenu[i].addComponent(cc.Button);
            button.clickEvents.push(clickEventHandler);
            if(isScale == undefined || isScale) {
                button.transition = cc.Button.Transition.SCALE;
                button.duration = 0.1;
                button.zoomScale = 1.2;
            }
        }
    },
    scheduleOnce: function (node, callFunc, delay) {//事件调度
        node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(callFunc, node)));
    },
    loadingScene(sceneName, isShowLayer) {//加载场景
        if (isShowLayer) {
            cc.loader.loadRes("panel/LoadingLayer", (err, prefab) => {
                var node = cc.instantiate(prefab);
                cc.director.getScene().children[0].addChild(node);
                cc.director.preloadScene(sceneName, () => {
                    cc.director.loadScene(sceneName);
                });
            });
        } else {
            cc.director.preloadScene(sceneName, () => {
                cc.director.loadScene(sceneName);
            });
        }
    },
    loadingLayer(panelName) {//加载图层
        cc.loader.loadRes(panelName, (err, prefab) => {
            if (!err) {
                let node = cc.instantiate(prefab);
                cc.director.getScene().children[0].addChild(node);
            }
        });
    }
};
module.exports = GameUiTools;