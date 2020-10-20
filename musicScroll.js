// musicScroll.js v0.1
"use strict";

import { TwoDirectionalAudioBuffer } from "./TwoDirectionalAudioBuffer";
import { DirectionLabel } from "./DirectionLabel";
// import TwoDirectionalAudioBuffer from './TwoDirectionalAudioBuffer'
// import DirectionLabel from "./DirectionLabel"

var fartscroll = (function () {

  return function (audiofile, trigger_distance, element) {
    trigger_distance = trigger_distance || 400;
    var lastOffset, currSource, songPosition = 0;
    var buffers = new TwoDirectionalAudioBuffer(),
      request = new XMLHttpRequest()
      ;
    request.open('GET', 'http://localhost:8080/' + audiofile, true);
    // request.setRequestHeader('Access-Control-Allow-Origin', '*')
    request.responseType = 'arraybuffer';

    request.addEventListener('load', async function () {
      await buffers.loadAsync(request.response);
      element.style.height =Math.ceil(buffers.length / 1000)
    });
    request.send();

    var setSpeed = function () {
      if (fwdContext.buffer && lastOffset !== window.pageYOffset) {
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
  };

})();
