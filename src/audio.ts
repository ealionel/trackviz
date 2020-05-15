export async function loadBufferFromUrl(context: BaseAudioContext, url: string): Promise<AudioBuffer> {
    const audioBuffer = await fetch(url)
        .then(res => res.arrayBuffer())
        .then(buffer => context.decodeAudioData(buffer))
    
    return audioBuffer
}

export async function loadBufferFromBlob(context: BaseAudioContext, blob: Blob): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            context.decodeAudioData(<ArrayBuffer> reader.result)
                .then(audioBuffer => resolve(audioBuffer))
        }

        reader.onerror = () => {
            reader.abort()
            reject(reader.error)
        }

        reader.readAsArrayBuffer(blob)
    })
}

export async function loadAudioBuffer(context: BaseAudioContext, resource: string|Blob): Promise<AudioBuffer> {
    if (resource instanceof Blob) {
        return await loadBufferFromBlob(context, resource)
    } else {
        return await loadBufferFromUrl(context, resource)
}}