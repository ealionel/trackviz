import * as PIXI from 'pixi.js'

export class Frame {
    app: PIXI.Application

    constructor(app: PIXI.Application) {
        this.app = app
    }

    draw(buffer: AudioBuffer) {
        const line = new PIXI.Graphics()

        const data = buffer.getChannelData(0)

        line.lineStyle(1, 0xFFFFFF, 1)
        line.x = 0

        this.app.stage.addChild(line)

        for (let i = 0; i < this.app.renderer.width * 2; i++) {
            const y = this.app.renderer.height/(this.app.renderer.resolution*2) + data[i+64000] * 128
            if (i == 0) {
                line.moveTo(i, y)
            } else {
                line.lineTo(i, y)
            }
        }
    }

}