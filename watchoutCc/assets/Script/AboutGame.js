var GameUiTools = require("GameUiTools");
var GameTools = require("GameTools");
cc.Class({
    extends: cc.Component,

    properties: {
        customerButton: cc.Node,
    },
    // onLoad () {},
    start() {
        // this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
        //     cc.director.loadScene("MenuUI");
        // }, this);
        // GameUiTools.setButtonClickEvents(this, this.node, "loadingResource");
        GameUiTools.setButtonClickEvents(this, this.customerButton, "openCustomerServiceConversation");
    },
    openCustomerServiceConversation() {
        GameTools.playSimpleAudioEngine(0);
        if (CC_WECHATGAME) {
            window.wx.openCustomerServiceConversation({});
        } else {
            GameTools.toastMessage(1);
        }
    },
    loadingResource: function () {
        GameTools.playSimpleAudioEngine(0);
        cc.director.loadScene("MenuUI");
    },
});
