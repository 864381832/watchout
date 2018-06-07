var MainMenu = {//主选择菜单
    MainMenuNumLeft: 0,// 左手模式
    MainMenuNumRight: 1,// 右手模式
    MainMenuNumBoth: 2,// 双手模式
};

var SunMenuNum = {//二级选择菜单
    SunMenuNum1: 0,//经典
    SunMenuNum2: 1,//街机
    SunMenuNum3: 2,//禅
};

var GameConfig = {
    GameClubButton: null,//游戏圈按钮
    GameScene: null,
    GameLogic: null,

    MainMenu: MainMenu,
    SunMenuNum: SunMenuNum,

    DEVICE_WIDTH: 720, // 屏幕宽度
    DEVICE_HEIGHT: 1280,

    CARD_WIDTH: 144,// 卡片宽度
    CARD_SCALE: 1,

    MAIN_MENU_NUM: MainMenu.MainMenuNumLeft,// 主选择菜单
    SUN_MENU_NUM: SunMenuNum.SunMenuNum1,// 二级选择菜单

    GAME_CARD_CLICK_NUM: 0,//游戏点击卡片数
    AUTO_ADD_GAME_CARD_NUM: -1,//卡片旋转数
    GAME_START_TIME: 0,//游戏用时

    IS_GAME_MUSIC: true,// 游戏音效

    IS_GAME_SHARE: false,// 游戏分享
    IS_GAME_START: false, //游戏是否开始
    IS_GAME_OVER: false,// 游戏是否结束
};
module.exports = GameConfig;

