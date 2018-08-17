const {ccclass, property} = cc._decorator;

@ccclass
export class Player extends cc.Component {
    @property(cc.AudioClip)
    jumpAudio: cc.AudioClip = null;
    // 主角跳跃高度
    @property
    jumpHeight = 0;
    // 主角跳跃持续时间
    @property
    jumpDuration = 0;
    // 最大移动速度
    @property
    maxMoveSpeed = 0;
    // 加速度
    @property
    accel = 0;

    // 加速度方向开关
    accLeft = false;
    accRight = false;
    // 主角当前水平方向速度
    xSpeed = 0;
    
    onLoad () {
        // 初始化跳跃动作
        let jumpAction = this.setJumpAction();
        this.node.runAction(jumpAction);

        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this); 
    }

    start () {

    }

    setJumpAction() {
        // 跳跃上升
        let jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        let jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        var callback = cc.callFunc(this.playJumpSound, this);
        // 不断重复
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    }

    playJumpSound () {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    }

    onKeyDown (event: cc.Event.EventKeyboard) {
        // set a flag when key pressed
        switch(event.keyCode) {
            case cc.KEY.a:
                this.accLeft = true;
                break;
            case cc.KEY.d:
                this.accRight = true;
                break;
        }
    }

    onKeyUp (event: cc.Event.EventKeyboard) {
        // unset a flag when key released
        switch(event.keyCode) {
            case cc.KEY.a:
                this.accLeft = false;
                break;
            case cc.KEY.d:
                this.accRight = false;
                break;
        }
    }

    onDestroy () {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    update (dt: number) {
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt * 5;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt * 5;
        }
        // 限制主角的速度不能超过最大值
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;
    }
}
