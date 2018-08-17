"use strict";
cc._RF.push(module, '2476f+JMK1DL50z0PSoxr0w', 'Game');
// scripts/Game.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 这个属性引用了星星预制资源
        _this.starPrefab = null;
        _this.scoreAudio = null;
        // 地面节点，用于确定星星生成的高度
        _this.background = null;
        _this.ground = null;
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        _this.player = null;
        // score label 的引用
        _this.scoreDisplay = null;
        // 星星产生后消失时间的随机范围
        _this.maxStarDuration = 0;
        _this.minStarDuration = 0;
        _this.groundY = 0;
        _this.score = 0;
        _this.timer = 0;
        _this.starDuration = 0;
        return _this;
    }
    Game.prototype.onLoad = function () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        this.initStar();
        // 生成一个新的星星
        this.spawnNewStar();
        cc.director.getPhysicsManager().enabled = true;
        // let manager = cc.director.getCollisionManager();
        // manager.enabled = true;
        // manager.enabledDrawBoundingBox = true;
        // manager.enabledDebugDraw = true;
    };
    Game.prototype.initStar = function () {
        this.star = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(this.star);
        // 在星星组件上暂存 Game 对象的引用
        var star = this.star.getComponent('Star');
        star.game = this;
    };
    Game.prototype.spawnNewStar = function () {
        // 为星星设置一个随机位置
        this.star.setPosition(this.getNewStarPosition());
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    };
    Game.prototype.getNewStarPosition = function () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var palyer = this.player.getComponent('Player');
        var randY = this.groundY + Math.random() * palyer.jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 返回星星坐标
        return cc.v2(randX, randY);
    };
    Game.prototype.start = function () {
    };
    Game.prototype.update = function (dt) {
        this.background.x -= dt * 10;
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    };
    Game.prototype.gameOver = function () {
        //停止 player 节点的跳跃动作
        this.player.stopAllActions();
        cc.director.loadScene('game');
    };
    Game.prototype.gainScore = function () {
        cc.audioEngine.playEffect(this.scoreAudio, false);
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score;
    };
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "starPrefab", void 0);
    __decorate([
        property(cc.AudioClip)
    ], Game.prototype, "scoreAudio", void 0);
    __decorate([
        property(cc.Node)
    ], Game.prototype, "background", void 0);
    __decorate([
        property(cc.Node)
    ], Game.prototype, "ground", void 0);
    __decorate([
        property(cc.Node)
    ], Game.prototype, "player", void 0);
    __decorate([
        property(cc.Label)
    ], Game.prototype, "scoreDisplay", void 0);
    __decorate([
        property
    ], Game.prototype, "maxStarDuration", void 0);
    __decorate([
        property
    ], Game.prototype, "minStarDuration", void 0);
    Game = __decorate([
        ccclass
    ], Game);
    return Game;
}(cc.Component));
exports.Game = Game;

cc._RF.pop();