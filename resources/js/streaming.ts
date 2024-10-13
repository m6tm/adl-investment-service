
const videoElement = document.getElementById('video')! as HTMLVideoElement;
const websockethost = `ws://${location.hostname}${location.port === "" ? '' : `:${location.port}`}/streaming`
const websocket = new WebSocket(websockethost);
const mediaSource = new MediaSource();

videoElement.src = URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', () => {
    const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    let queue: Array<any> = [];
    let isAppending = false;

    async function appendNextBuffer() {
        if (queue.length > 0 && !isAppending) {
            isAppending = true;
            const buffer = queue.shift();
            try {
                await new Promise((resolve, reject) => {
                    sourceBuffer.appendBuffer(buffer);
                    sourceBuffer.addEventListener('updateend', resolve, { once: true });
                    sourceBuffer.addEventListener('error', reject, { once: true });
                });
            } catch (error) {
                console.error('Error appending buffer:', error);
            }
            isAppending = false;
            appendNextBuffer();
        }
    }


    websocket.onmessage = async (event: MessageEvent) => {
        const arrayBuffer = await event.data.arrayBuffer();
        console.log('ok', arrayBuffer);
        queue.push(arrayBuffer);
        appendNextBuffer();
    };
});
