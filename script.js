const button = document.getElementById('button');
const audioElement = document.getElementById('audio');

function test() {
    VoiceRSS.speech({
        key: '83cad11a89d34667a4e3e59968eb945b',
        src: 'Hello, world!',
        hl: 'en-us',
        v: 'Linda',
        r: 0, 
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
}
test();