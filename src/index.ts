import { loadAudioBuffer }  from './audio'
import { Frame } from './waveform'
import * as PIXI from 'pixi.js'

const context = new AudioContext()

async function main() {
    const app = new PIXI.Application({
        width: 1900,
        height: 256,
        antialias: true,
        transparent: false,
        resolution: 0.5
    })

    const buffer = await loadAudioBuffer(context, './song.mp3')

    const frame = new Frame(app)

    frame.draw(buffer)

    document.body.appendChild(app.view)

}

main()