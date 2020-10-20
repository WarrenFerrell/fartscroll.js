// musicScroll.js v0.1
"use strict";

import TwoDirectionalAudioBuffer  from "./TwoDirectionalAudioBuffer.js";
import  DirectionLabel  from "./DirectionLabel.js";
// import TwoDirectionalAudioBuffer from './TwoDirectionalAudioBuffer'
// import DirectionLabel from "./DirectionLabel"

export default function musicScroll(audiofile, element) {
    var lastOffset, currSource, songPosition = 0;
    var buffers = new TwoDirectionalAudioBuffer(),
      request = new XMLHttpRequest()
      ;
    request.open('GET', 'http://localhost:8080/' + audiofile, true);
    // request.setRequestHeader('Access-Control-Allow-Origin', '*')
    request.responseType = 'arraybuffer';

    request.addEventListener('load', async function () {
      await buffers.loadAsync(request.response);
      const elementSize = Math.ceil(buffers.length / 100)
      console.log("Setting element size to", elementSize, "using", buffers)
      element.style.height = elementSize; 
    });
    request.send();

    var setSpeed = function () {
      if (buffers.length && lastOffset !== window.pageYOffset) {
        // source.start()
        var diff = window.pageYOffset - lastOffset;
        var newLabel = (diff > 0 ? DirectionLabel.fwd : DirectionLabel.rev)
        buffers.swapSource(newLabel);
        console.log('setting playback for', currSource, 'to', playSpeed, 'from', window.scrollY)
        currSource.playbackRate.value = playSpeed;
        lastOffset = window.pageYOffset;
      }
    };

    window.addEventListener('scroll', setSpeed, false);
  }

export { fartscroll }