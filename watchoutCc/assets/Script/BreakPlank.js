var CardSprite = require("CardSprite");
var GameConfig = require("GameConfig");
var GameTools = require("GameTools");

var BreakPlank = cc.Class({
    extends: cc.Node,
    properties: {
        firstY: 0, endY: 0,
        number: 0,//显示数字
        showCardNum: 0,//显示当前卡片
        cardArr: new Array(4),//储存卡片类
        startCard: CardSprite,//开始卡片
    },
    ctor: function () {
        this.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        // this.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
    },
    statics: {
        createBreakPlank: function (numbers, CardSpriteX, CardSpriteY) {
            let breakPlank = new BreakPlank();
            breakPlank.initUI(numbers, CardSpriteX, CardSpriteY);
            return breakPlank;
        }
    },
    initUI(numbers, CardSpriteX, CardSpriteY) {
        this.number = numbers;
        this.setContentSize(GameConfig.DEVICE_WIDTH, GameConfig.DEVICE_WIDTH);
        if (this.number == 0) {
            this.cardArr[0] = CardSprite.createCardSprite(0, GameConfig.DEVICE_WIDTH / 2.0 - GameConfig.CARD_WIDTH, 0);
            this.cardArr[1] = CardSprite.createCardSprite(1, 0, GameConfig.DEVICE_WIDTH / 2 - GameConfig.CARD_WIDTH / 2);
            this.cardArr[2] = CardSprite.createCardSprite(1, -GameConfig.DEVICE_WIDTH / 2.0 + GameConfig.CARD_WIDTH / 2, 0);
            this.cardArr[3] = CardSprite.createCardSprite(1, 0, -GameConfig.DEVICE_WIDTH / 2.0 + GameConfig.CARD_WIDTH / 2);
            this.startCard = CardSprite.createCardSprite(2, GameConfig.DEVICE_WIDTH / 2.0 - GameConfig.CARD_WIDTH, 0);
        } else if (this.number == 1) {
            this.cardArr[0] = CardSprite.createCardSprite(0, -GameConfig.DEVICE_WIDTH / 2.0 + GameConfig.CARD_WIDTH, 0);
            this.cardArr[1] = CardSprite.createCardSprite(1, 0, GameConfig.DEVICE_WIDTH / 2 - GameConfig.CARD_WIDTH / 2);
            this.cardArr[2] = CardSprite.createCardSprite(1, GameConfig.DEVICE_WIDTH / 2.0 - GameConfig.CARD_WIDTH / 2, 0);
            this.cardArr[3] = CardSprite.createCardSprite(1, 0, -GameConfig.DEVICE_WIDTH / 2.0 + GameConfig.CARD_WIDTH / 2);
            this.startCard = CardSprite.createCardSprite(2, -GameConfig.DEVICE_WIDTH / 2.0 + GameConfig.CARD_WIDTH, 0);
        }

        for (let i = 1; i < 4; i++) {
            let j = Math.floor(cc.random0To1() * 2);
            this.cardArr[i].setNumber(j);
            this.addChild(this.cardArr[i], 1, 1);
        }
        this.addChild(this.cardArr[0], 1, 1);
        let scale = cc.scaleBy(0.5, 2);
        // this.cardArr[0].runAction(scale);
        this.cardArr[0].scale = 2;
        this.addChild(this.startCard, 1, 1);
        this.startCard.runAction(cc.repeatForever(cc.sequence(scale.clone(), scale.clone().reverse())));
        this.setPosition(cc.p(CardSpriteX, CardSpriteY));
    },

    onTouchBegan(event) {
        this.firstY = event.touch.getLocation().y;
        // let touchPoint = event.touch.getLocation();
        let touchPoint = this.convertToNodeSpaceAR(event.touch.getLocation());
        if (!this.cardArr[this.showCardNum].getBoundingBox().contains(touchPoint)) {
            if (GameConfig.IS_GAME_START) {
                GameConfig.GameScene.gameOverScene(false);
            }
            return;
        }
        this.isMove = false;
    },
    onTouchEnded(event) {
        this.endY = this.firstY - event.touch.getLocation().y;
        let touchPoint = this.convertToNodeSpaceAR(event.touch.getLocation());
        if (!GameConfig.IS_GAME_START) {
            if (this.cardArr[this.showCardNum].getBoundingBox().contains(touchPoint)) {
                GameConfig.IS_GAME_START = true;
                GameConfig.GameScene.startTimer();
                if (GameConfig.GameScene.breakPlank[0] != undefined) {
                    GameConfig.GameScene.breakPlank[0].rotatePlank();
                    GameConfig.GameScene.breakPlank[0].setVisibleStartCard();
                }
                if (GameConfig.GameScene.breakPlank[1] != undefined) {
                    GameConfig.GameScene.breakPlank[1].rotatePlank();
                    GameConfig.GameScene.breakPlank[1].setVisibleStartCard();
                }
            }
            return;
        }
        if (this.cardArr[this.showCardNum].getNumber() == 0) {
            // if (!(this.endY > GameConfig.CARD_WIDTH / 2.0)) {
            if (Math.abs(this.endY) < 10) {
                if (GameConfig.SUN_MENU_NUM != GameConfig.SunMenuNum.SunMenuNum2) {
                    this.rotatePlank();
                }
                GameConfig.GAME_CARD_CLICK_NUM++;
            } else {
                GameConfig.GameScene.gameOverScene(false);
            }
        } else if (this.cardArr[this.showCardNum].getNumber() == 1) {
            // if (this.endY > GameConfig.CARD_WIDTH / 2.0) {
            if (this.endY > 10) {
                if (GameConfig.SUN_MENU_NUM != GameConfig.SunMenuNum.SunMenuNum2) {
                    this.rotatePlank();
                }
                GameConfig.GAME_CARD_CLICK_NUM++;
            } else {
                GameConfig.GameScene.gameOverScene(false);
            }
        }
    },

    setVisibleStartCard() {
        let hideAction = cc.hide();
        this.startCard.runAction(hideAction);
    },
    rotatePlank()//设置旋转
    {
        let func = cc.callFunc(() => {
            this.cardChange();
        });
        if (this.number == 0) {
            if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum1) {
                let rotateBy = cc.rotateBy(0.1, 90);
                this.runAction(cc.spawn(rotateBy, func));
            } else if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum2) {
                let rotateBy = cc.rotateBy((1 - GameConfig.GAME_START_TIME / 30.0 > 0.4 ? 1 - GameConfig.GAME_START_TIME / 30.0 : 0.4), 90);
                let moveFinish1 = cc.callFunc(this.callFuncCard1, this);
                this.runAction(cc.sequence(cc.spawn(rotateBy, func), moveFinish1));
            } else if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum3) {
                let rotateBy = cc.rotateBy(0.1, 90);
                this.runAction(cc.spawn(rotateBy, func));
            }
        } else if (this.number == 1) {
            if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum1) {
                let rotateBy = cc.rotateBy(0.1, -90);
                this.runAction(cc.spawn(rotateBy, func));
            } else if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum2) {
                let rotateBy = cc.rotateBy((1 - GameConfig.GAME_START_TIME / 30.0 > 0.4 ? 1 - GameConfig.GAME_START_TIME / 30.0 : 0.4), -90);
                let moveFinish1 = cc.callFunc(this.callFuncCard1, this);
                this.runAction(cc.sequence(cc.spawn(rotateBy, func), moveFinish1));
            } else if (GameConfig.SUN_MENU_NUM == GameConfig.SunMenuNum.SunMenuNum3) {
                let rotateBy = cc.rotateBy(0.1, -90);
                this.runAction(cc.spawn(rotateBy, func));
            }
        }
    },

    callFuncCard1(sender) {
        let rotateBy = null;
        if (this.number == 0) {
            rotateBy = cc.rotateBy((1 - GameConfig.GAME_START_TIME / 30.0 > 0.4 ? 1 - GameConfig.GAME_START_TIME / 30.0 : 0.4), 90);
        } else if (this.number == 1) {
            rotateBy = cc.rotateBy((1 - GameConfig.GAME_START_TIME / 30.0 > 0.4 ? 1 - GameConfig.GAME_START_TIME / 30.0 : 0.4), -90);
        }
        let moveFinish1 = cc.callFunc(this.callFuncCard1, this);
        let func = cc.callFunc(() => {
            this.cardChange();
        });
        this.runAction(cc.sequence(cc.spawn(rotateBy, func), moveFinish1));
    },

    cardChange() {
        GameTools.playSimpleAudioEngine(1);
        GameConfig.AUTO_ADD_GAME_CARD_NUM++;
        let moveBy1 = null;
        let moveBy2 = null;
        let moveByTime;
        if (GameConfig.SUN_MENU_NUM != GameConfig.SunMenuNum.SunMenuNum2) {
            moveByTime = 0.1;
        } else {
            moveByTime = (1 - GameConfig.GAME_START_TIME / 30.0) / 2.0 > 0.2 ? (1 - GameConfig.GAME_START_TIME / 30.0) / 2.0 : 0.2;
        }
        if (this.number == 0) {
            if (this.showCardNum == 0) {
                moveBy1 = cc.moveBy(moveByTime, cc.v2(GameConfig.CARD_WIDTH / 2.0, 0));
                moveBy2 = cc.moveBy(moveByTime, cc.v2(0, -GameConfig.CARD_WIDTH / 2.0));
            } else if (this.showCardNum == 1) {
                moveBy1 = cc.moveBy(moveByTime, cc.v2(0, GameConfig.CARD_WIDTH / 2.0));
                moveBy2 = cc.moveBy(moveByTime, cc.v2(GameConfig.CARD_WIDTH / 2.0, 0));
            } else if (this.showCardNum == 2) {
                moveBy1 = cc.moveBy(moveByTime, cc.v2(-GameConfig.CARD_WIDTH / 2.0, 0));
                moveBy2 = cc.moveBy(moveByTime, cc.v2(0, GameConfig.CARD_WIDTH / 2.0));
            } else if (this.showCardNum == 3) {
                moveBy1 = cc.moveBy(moveByTime, cc.v2(0, -GameConfig.CARD_WIDTH / 2.0));
                moveBy2 = cc.moveBy(moveByTime, cc.v2(-GameConfig.CARD_WIDTH / 2.0, 0));
            }
        } else if (this.number == 1) {
            if (this.showCardNum == 0) {
                moveBy1 = cc.moveBy(moveByTime, cc.v2(-GameConfig.CARD_WIDTH / 2.0, 0));
                moveBy2 = cc.moveBy(moveByTime, cc.v2(0, -GameConfig.CARD_WIDTH / 2.0));
            } else if (this.showCardNum == 1) {
                moveBy1 = cc.moveBy(moveByTime, cc.v2(0, GameConfig.CARD_WIDTH / 2.0));
                moveBy2 = cc.moveBy(moveByTime, cc.v2(-GameConfig.CARD_WIDTH / 2.0, 0));
            } else if (this.showCardNum == 2) {
                moveBy1 = cc.moveBy(moveByTime, cc.v2(GameConfig.CARD_WIDTH / 2.0, 0));
                moveBy2 = cc.moveBy(moveByTime, cc.v2(0, GameConfig.CARD_WIDTH / 2.0));
            } else if (this.showCardNum == 3) {
                moveBy1 = cc.moveBy(moveByTime, cc.v2(0, -GameConfig.CARD_WIDTH / 2.0));
                moveBy2 = cc.moveBy(moveByTime, cc.v2(GameConfig.CARD_WIDTH / 2.0, 0));
            }
        }
        let scale2 = cc.scaleBy(moveByTime, 0.5);
        this.cardArr[this.showCardNum].runAction(cc.spawn(scale2, moveBy1));
        this.showCardNum = (++this.showCardNum) % 4;
        let scale = cc.scaleBy(moveByTime, 2);
        this.cardArr[this.showCardNum].runAction(cc.spawn(scale, moveBy2));
        let j = Math.floor(cc.random0To1() * 2);
        if (this.showCardNum == 0 || this.showCardNum == 2) {
            this.cardArr[2 - this.showCardNum].setNumber(j);
        } else {
            this.cardArr[4 - this.showCardNum].setNumber(j);
        }
    },
});
module.exports = BreakPlank;