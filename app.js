const Actx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new Actx();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

class Os {
    constructor(opt) {
        this._opt = Object.assign({}, {
            type: 'sine',
            min: 0,
            max: 100,
            step: 10,
            color: '#000'
        }, opt);
        this._enabled = false;
        this._init = false;
        this.update = this.update.bind(this);
        /**
         * audio
         */
        this.audioCtx = this.o.audioCtx;
        const oscillator = this.audioCtx.createOscillator();
        oscillator.type = this.o.type;
        oscillator.connect(analyser);
        analyser.connect(this.audioCtx.destination);
        this.oscillator = oscillator;
        /**
         * ui
         */
        const elInput = document.createElement('input');
        elInput.setAttribute('type', 'range');
        elInput.setAttribute('min', this.o.min - 1);
        elInput.setAttribute('max', this.o.max);
        elInput.setAttribute('value', this.o.min - 1);
        elInput.setAttribute('step', this.o.step);
        elInput.addEventListener('input', this.update);
        elInput.style.accentColor = this.o.color;
        document.body.appendChild(elInput);
    }
    get o() {
        return this._opt;
    }
    update(e) {
        const hz = (e.target.value * 1);
        if (hz >= this.o.min) {
            this.start();
        } else {
            this.stop();
            return;
        }
        this.hz(hz);

    }
    hz(v) {
        this.oscillator.frequency.setValueAtTime(v, this.audioCtx.currentTime);
    }
    start() {
        if (this.enabled) {
            return;
        }
        if (!this._init) {
            this.oscillator.start();
            this._init = true;
        }
        this.enabled = true;
    }

    stop() {
        if (!this.enabled) {
            return;
        }
        this.hz(0);
        this.enabled = false;
    }
}

for (let i = 1; i < 3; i++) {
    new Os({
        audioCtx: audioCtx,
        type: 'sine',
        min: 10,
        max: 80,
        step: 5,
        color: 'DeepPink'
    });
    new Os({
        audioCtx: audioCtx,
        type: 'triangle',
        min: 10,
        max: 80,
        step: 5,
        color: 'DarkMagenta'
    });

    new Os({
        audioCtx: audioCtx,
        type: 'square',
        min: 1,
        max: 5,
        step: 1,
        color: 'Black'
    });

    new Os({
        audioCtx: audioCtx,
        type: 'sawtooth',
        min: 1,
        max: 5,
        step: 1,
        color: 'Green'
    });


}



var canvas = document.getElementById("c");
var canvasCtx = canvas.getContext("2d");

function draw() {

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = "rgb(200, 200, 200)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0, 0, 0)";

    canvasCtx.beginPath();

    var sliceWidth = canvas.width * 1.0 / bufferLength;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * canvas.height / 2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
}

//draw();




