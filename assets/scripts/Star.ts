
const {ccclass, property} = cc._decorator;
import { Game } from './Game';

@ccclass
export class Star extends cc.Component {
    // 星星和主角之间的距离小于这个数值时，就会完成收集
    @property
    pickRadius = 0;

    game: Game;

    // onLoad () {}

    getPlayerDistance () :number {
        // 根据 player 节点位置判断距离
        var playerPos = this.game.player.getPosition();
        // 根据两点位置计算两点之间距离
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    }

    onPicked () {
        // 当星星被收集时，调用 Game 脚本中的接口，生成一个新的星星
        this.game.spawnNewStar();
        // 调用 Game 脚本的得分方法
        this.game.gainScore();
    }

    start () {

    }

    onCollisionEnter (other: cc.Node, self: cc.Collider) {
        let action = cc.moveBy(0.1, cc.v2(0, 100)).easing(cc.easeCubicActionOut());
        let finished = cc.callFunc(this.animationFinished, this);
        let a = cc.sequence(action, finished);
        this.node.runAction(a);
        // self.node.y += 50;
    }

    animationFinished () {
        this.onPicked();
    }

    onBeginContact (contact, selfCollider, otherCollider) {
        console.log("aaa");
    }
    

    update (dt: number) {
        // 根据 Game 脚本中的计时器更新星星的透明度
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));

        // 每帧判断和主角之间的距离是否小于收集距离
        // if (this.getPlayerDistance() < this.pickRadius) {
        //     // 调用收集行为
        //     this.onPicked();
        //     return;
        // }
    }
}
