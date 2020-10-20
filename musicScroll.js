// musicScroll.js v0.1
"use strict";

var fartscroll = (function () {

  return function (audiofile, trigger_distance) {
    trigger_distance = trigger_distance || 400;
    var lastOffset, currSource, lastContext, revBuffer, fwdBuffer;
    var fwdContext = new AudioContext(),
      revContext = new AudioContext(),
      request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:8080/' + audiofile, true);
    // request.setRequestHeader('Access-Control-Allow-Origin', '*')
    request.responseType = 'arraybuffer';

    request.addEventListener('load', async function () {
      var res = await decodeBuffers(revContext, fwdContext, request.response)
      
      revContext.buffer = res.reverse;
      fwdContext.buffer = res.forward;
    });
    request.send();

    var setSpeed = function () {
      if (fwdContext.buffer && lastOffset !== window.pageYOffset) {
        // source.start()
        var diff = window.pageYOffset - lastOffset;
        var newContext = (diff > 0 ? fwdContext : revContext)
        if (newContext !== lastContext) {
          if (currSource) {
            console.log('stopping', currSource)
            currSource.stop();
          }
          currSource = createSource(newContext, newContext.buffer);          
          currSource.start()
            console.log('starting', currSource)
          lastContext = newContext;
        }

        const playSpeed = Math.max(1, window.scrollY % 5);
        console.log('setting playback for', newContext, 'to', playSpeed, 'from', window.scrollY)
        currSource.playbackRate.value = playSpeed;
        lastOffset = window.pageYOffset;
      }
    };

    var timer;

    function resizeFart() {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        playAudio();
      }, 200);
    };


    window.addEventListener('scroll', setSpeed, false);
    // window.addEventListener('resize', resizeFart, false);
  };

  async function decodeBuffers(revContext, fwdContext, response) {
    console.log('decoding', response, 'with', revContext, fwdContext)
    var res = {};
    await fwdContext.decodeAudioData(response.slice(), function (buffer) {
      res.forward = buffer;
    })
    await revContext.decodeAudioData(response, function (buffer) {
      buffer.getChannelData(0).reverse();
      buffer.getChannelData(1).reverse();
      res.reverse = buffer;
    })
    console.log('made buffers', res)
    return res
  }

  function createSource(context, buffer) {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(context.destination);
    return source;
  }

})();