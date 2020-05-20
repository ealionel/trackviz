import * as PIXI from 'pixi.js'

interface FrameOptions {
    offset?: number,
    sampleWindow?: number,
    buffer?: AudioBuffer
}

export class Frame {
    app: PIXI.Application

    offset: number
    sampleWindow: number

    buffer: AudioBuffer | null
    overview: Float32Array | null

    line: PIXI.Graphics

    constructor(app: PIXI.Application, options: FrameOptions = {}) {
        this.app = app

        this.offset = options.offset || 0
        this.sampleWindow = options.sampleWindow || 440

        this.buffer = null
        this.overview = null

        this.line = new PIXI.Graphics()
    }

    get actualWidth(): number {
        return this.app.renderer.width / this.app.renderer.resolution
    }

    get actualHeight(): number {
        return this.app.renderer.height / this.app.renderer.resolution
    }

    loadBuffer(buffer: AudioBuffer) {
        this.buffer = buffer
        
        this.overview = peaks(this.buffer.getChannelData(0), this.sampleWindow)
    }

    draw() {
        if (this.overview == null) {
            return;
        }

        this.line.clear()
        this.line.lineStyle(1, 0xFFFFFF, 1)
        this.app.stage.addChild(this.line)


        this.line.x = 0


        for (let i = 0; i < this.actualWidth; i++) {
            const y = this.actualHeight * (this.overview[i + this.offset] + 1) / 2
            const my = this.actualHeight * (-this.overview[i + this.offset] + 1) / 2

            // line.moveTo(i + 0.5, this.actualHeight / 2)
            this.line.moveTo(i + 0.5, my)
            this.line.lineTo(i + 0.5, y)
        }
    }
}

const averager: Resampler = (data: Float32Array, windowSize: number): Float32Array => {
    const newLength = Math.ceil(data.length / windowSize)
    const arr = new Float32Array(newLength)
    
    for (let i = 0; i < newLength; i++) {
        let average = 0
        for (let j = 0; j < windowSize; j++) {
            average += data[i * windowSize + j]
        }
        arr[i] = average / windowSize
    }

    return arr
}

const peaks: Resampler = (data: Float32Array, windowSize: number): Float32Array => {
    const newLength = Math.ceil(data.length / windowSize)
    const arr = new Float32Array(newLength)
    
    for (let i = 0; i < newLength; i++) {
        let max = 0
        for (let j = 0; j < windowSize; j++) {
            if (Math.abs(data[i * windowSize + j]) > Math.abs(max)) {
                max = data[i * windowSize + j]
            }
        }
        arr[i] = max
    }

    return arr
}

type Resampler = (data: Float32Array, windowSize: number) => Float32Array