const {ccclass, property} = cc._decorator;
import { Star } from './Star';
import { Player } from './Player';

@ccclass
export class Game extends cc.Component {
    // 这个属性引用了星星预制资源
    @property (cc.Prefab)
    starPrefab: cc.Prefab = null
    @property(cc.AudioClip)
    scoreAudio: cc.AudioClip = null;
    // 地面节点，用于确定星星生成的高度
    @property (cc.Node)
    background: cc.Node = null
    @property (cc.Node)
    ground: cc.Node = null
    // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
    @property (cc.Node)
    player: cc.Node = null
    // score label 的引用
    @property (cc.Label)
    scoreDisplay: cc.Label = null
    // 星星产生后消失时间的随机范围
    @property
    maxStarDuration = 0
    @property
    minStarDuration = 0

    groundY = 0
    score = 0
    star: cc.Node;
    timer = 0;
    starDuration = 0;

    onLoad () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;

        this.initStar();

        // 生成一个新的星星
        this.spawnNewStar();

        cc.director.getPhysicsManager().enabled = true;

        // let manager = cc.director.getCollisionManager();
        // manager.enabled = true;
        // manager.enabledDrawBoundingBox = true;
        // manager.enabledDebugDraw = true;
    }

    initStar () {
        this.star = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(this.star);
        // 在星星组件上暂存 Game 对象的引用
        let star = this.star.getComponent('Star') as Star
        star.game = this;
    }

    spawnNewStar () {
        // 为星星设置一个随机位置
        this.star.setPosition(this.getNewStarPosition());

        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    getNewStarPosition () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        let palyer = this.player.getComponent('Player') as Player
        var randY = this.groundY + Math.random() * palyer.jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 返回星星坐标
        return cc.v2(randX, randY);
    }

    start () {

    }

    update (dt) {
        this.background.x -= dt * 10;
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }

    gameOver () {
        //停止 player 节点的跳跃动作
        this.player.stopAllActions();
        cc.director.loadScene('game');
    }

    gainScore () {
        cc.audioEngine.playEffect(this.scoreAudio, false);
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score;
    }
}
