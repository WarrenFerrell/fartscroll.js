// musicScroll.js v0.1
"use strict";

var fartscroll = (function () {

  return function (audiofile, trigger_distance) {
    trigger_distance = trigger_distance || 400;
    var lastOffset, lastSource;
    var fwdContext = new AudioContext(),
      revContext = new AudioContext(),
      request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:8080/' + audiofile, true);
    // request.setRequestHeader('Access-Control-Allow-Origin', '*')
    request.responseType = 'arraybuffer';
    var currSource, fwdSource, reverseSrc;

    request.addEventListener('load', async function () {
      fwdSource = await decodeToSource(fwdContext, request.response.slice())
      console.log(request)
      reverseSrc = await decodeToSource(revContext, request.response)
      reverseSrc.buffer.getChannelData(0).reverse();
      reverseSrc.buffer.getChannelData(1).reverse();
      // fwdContext.suspend();
      // fwdSource.start();
      // revContext.suspend();
      // revSource.start();
    });
    request.send();

    var setSpeed = function () {
      if (fwdSource && reverseSrc && lastOffset !== window.pageYOffset) {
        // source.start()
        console.log(fwdSource)
        var diff = window.pageYOffset - lastOffset;
        var newSource = (diff > 0 ? fwdSource : reverseSrc)
        if (newSource !== lastSource) {
          if (lastSource) {
            console.log('stopping', lastSource)
            lastSource.stop();
          }
          newSource.start()
          lastSource = newSource
        }


        const playSpeed = Math.max(1, window.scrollY % 5);
        console.log('setting playback for', newSource, 'to', playSpeed, 'from', window.scrollY)
        newSource.playbackRate.value = playSpeed;
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

  async function decodeToSource(context, response) {
    console.log('decoding', response, 'with', context)
    var source;
    await context.decodeAudioData(response, function (buffer) {

      source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(context.destination);

    })
    console.log('made source', source)
    return source
  }

  function playAudio(position) {
    var player = getPlayer(),
      audio = getAudioFor(player),
      rand = Math.floor(Math.random() * audio.sound.length);

    player.src = audio.prefix + audio.sound[position || rand];
    player.play();
  };

  function getPlayer() {
    var container = getContainer(),
      player, players = container.getElementsByTagName("audio");

    for (player in players) {
      if (player.currentTime === 0 || player.ended) {
        return player;
      }
    }

    player = document.createElement("audio");
    container.appendChild(player);
    return player;
  };

  function getContainer() {
    var container = document.getElementById("fartscroll");

    if (container === null) {
      container = document.createElement("div");
      container.id = "fartscroll";
      document.getElementsByTagName('body')[0].appendChild(container);
    }

    return container;
  }
})();