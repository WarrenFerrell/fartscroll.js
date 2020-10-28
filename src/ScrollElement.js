// musicScroll.js v0.1
"use strict";

import TwoDirectionalAudioBuffer from "./TwoDirectionalAudioBuffer.js";
import DirectionLabel from "./DirectionLabel.js";
// import TwoDirectionalAudioBuffer from './TwoDirectionalAudioBuffer'
// import DirectionLabel from "./DirectionLabel"
import scrollTo from "jquery.scrollto";

export default class AudioScroll {
  constructor(audiofile, element, resize = true, pixelsPerSecond = 100) {
    this.resize = true;
    this.pixelsPerSecond = resize ? pixelsPerSecond : undefined; 
    this.pixelStart = element.offsetTop;
    var lastOffset,
      currSource;
    this.songPosition = 0;
    var buffer = new TwoDirectionalAudioBuffer(),
      request = new XMLHttpRequest();
    request.open("GET", "http://localhost:8080/" + audiofile, true);
    // request.setRequestHeader('Access-Control-Allow-Origin', '*')
    request.responseType = "arraybuffer";
this.buffer = buffer;

    request.addEventListener("load", async function () {
      await buffer.loadAsync(request.response);
      if (resize) {
        this.elementSize = durationToPixels(buffer.duration) + window.innerHeight;
        element.style.height = this.elementSize + "px";
      } else {
        this.elementSize = element.scrollHeight;
        this.pixelsPerSecond =  this.elementSize / buffer.duration; 
      }
      this.pixelStop = this.pixelStart + this.elementSize;
      console.log("Loaded", this)
    });
    request.send();

    var playSegment = function () {
      if (buffer.length && lastOffset !== window.scrollY) {
        
        var diff = window.scrollY - lastOffset;
        var newLabel = diff > 0 ? DirectionLabel.fwd : DirectionLabel.rev;
        buffer.setLabel(newLabel);
        console.log("setting playback for", currSource, "to", playSpeed, "from", window.scrollY);
        currSource.playbackRate.value = playSpeed;
        lastOffset = window.pageYOffset;
      }
    };

    window.addEventListener("scroll", playSegment, false);
  }

  loadAsync(audiofile) {

  }

  pixelsToDuration(pixels){
    return pixels / this.pixelsPerSecond;
  }

  durationToPixels(duration){
    return Math.ceil(duration * this.pixelsPerSecond);
  }

  playSegment(start, stop) {
    var diff = stop - start;
    this.setLabel(diff);
    currSource.start();
  }

  setLabel(speed) {
    var newLabel = speed > 0 ? DirectionLabel.fwd : DirectionLabel.rev;
    this.buffer.setLabel(newLabel);
    return newLabel;
  }

  autoScroll(speed) {
    const { duration, match, songPosition } = this.buffer;
    this.speed = speed;
    this.setLabel(speed);
    const target = match("max", "0");
    const remainingDuration = match(() => duration - songPosition, () => songPosition)
    scrollTo(target, {
      duration: remainingDuration
    })
  }

  getCurrentSongPosition() {
    const scrollY = window.scrollY
    const asd = window.scrollY - this.pixelStart
      return pixelsToDuration()
  }
}
