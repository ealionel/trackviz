import { loadAudioBuffer }  from './audio'
import { Frame } from './waveform'
import * as PIXI from 'pixi.js'

const context = new AudioContext()

async function main() {
    const app = new PIXI.Application({
        width: 1000,
        height: 256,
        antialias: true,
        transparent: false,
        resolution: 1
    })

    const buffer = await loadAudioBuffer(context, './song.mp3')

    const frame = new Frame(app)

    frame.loadBuffer(buffer)
    frame.draw()

    document.body.appendChild(app.view)

    const offset = document.createElement('input')
    offset.id = 'offset'
    offset.type = 'range'
    offset.min = '0'
    offset.max = Math.ceil(buffer.length / frame.sampleWindow).toString()
    offset.step = '50'

    offset.oninput = ev => {
        frame.offset = parseInt(offset.value)
        frame.draw()
    }

    document.body.appendChild(offset)



}

main()