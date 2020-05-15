import * as audio from '../src/audio'

const context = new AudioContext()

test('Loads audio from link', async () => {
    const buffer = await audio.loadBufferFromUrl(context, './test_audio_sample.wav')
    expect(buffer).toBeInstanceOf(AudioBuffer)
})