define({
    generateToneBuffer: function(sampleRate) {
        var toneTime = 1.8,
            n = toneTime * sampleRate,
            buffer = new Array(n),
            t, fade, fadeSqr, freq = 110.0;
        //A2, Concert pitch A4 = 440Hz

        for (var i = 0; i < n; i++) {
            t = i / sampleRate;
            fade = (n - i) / n;
            fadeSqr = fade * fade;
            //prime harmonics
            buffer[i] = fade * Math.sin(freq * t * Math.PI * 2);
            buffer[i] += fadeSqr * Math.sin(freq * 2 * t * Math.PI * 2) / 2;
            buffer[i] += fadeSqr * fade * Math.sin(freq * 3 * t * Math.PI * 2) / 3;
            buffer[i] += fadeSqr * fadeSqr * Math.sin(freq * 4 * t * Math.PI * 2) / 4;
            buffer[i] += fadeSqr * fadeSqr * fade * Math.sin(freq * 5 * t * Math.PI * 2) / 5;
            buffer[i] += fadeSqr * fadeSqr * fadeSqr * Math.sin(freq * 6 * t * Math.PI * 2) / 6;

        }
        //attack - smooth out the first bit...
        var smoothSamples = 164;
        for (var i = 0; i < smoothSamples; i++) {
            buffer[i] *= i / smoothSamples;
        }

        return buffer;
    },
    initAudio: function(outputAudioNode) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var AudioComponent = {};
        AudioComponent.audioSupported = false;

        if (AudioContext) {
            audioCtx = new AudioContext();

            if (audioCtx) {

                AudioComponent.audioSupported = true;
                var audioCtx, toneBuffer, mainVol, compressor;

                var sampleRate = audioCtx.sampleRate;
                mainVol = audioCtx.createGainNode();
                // Connect MainVol to final destination (will throw error if outputAudioNode incorrect type )
                if (outputAudioNode !== undefined) mainVol.connect(outputAudioNode);
                else mainVol.connect(audioCtx.destination);
                mainVol.gain.value = 0.5;
                compressor = audioCtx.createDynamicsCompressor();

                compressor.connect(mainVol);
                // create the sound buffer for playing notes
                var toneDataBuffer = this.generateToneBuffer(sampleRate);
                toneBuffer = audioCtx.createBuffer(1, toneDataBuffer.length, sampleRate);
                toneBuffer.getChannelData(0).set(toneDataBuffer);
                //fill in return object
                AudioComponent.audioCtx = audioCtx;
                AudioComponent.toneBuffer = toneBuffer;
                AudioComponent.mainVol = mainVol;
                AudioComponent.compressor = compressor;

                AudioComponent.playNote = function(F, BaseIndex, t) {
                    var noteSource = audioCtx.createBufferSource();
                    noteSource.buffer = toneBuffer;

                    noteSource.connect(compressor);

                    noteSource.playbackRate.value = F * Math.pow(2, BaseIndex / 12);

                    noteSource.noteOn(t);
                }

                return AudioComponent;

            }

        }
        return null;
    },

})