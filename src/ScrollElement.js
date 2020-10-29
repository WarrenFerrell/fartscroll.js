// scrollElement.js v0.1
"use strict";

import TwoDirectionalAudioBuffer from "./TwoDirectionalAudioBuffer.js";
import DirectionLabel from "./DirectionLabel.js";
// import TwoDirectionalAudioBuffer from './TwoDirectionalAudioBuffer'
// import DirectionLabel from "./DirectionLabel"
import scrollTo from "jquery.scrollto";
import { scrollStop } from "jquery.scrollto";

export default class ScrollElement {
  constructor(element, resize = true, pixelsPerSecond = 100) {
    this.resize = resize;
    this.element = element;
    this.pixelsPerSecond = resize ? pixelsPerSecond : undefined;
    this.pixelStart = element.offsetTop;
    this.lastOffset = window.scrollY;
    this.lastPos = 0;
    this.buffer = new TwoDirectionalAudioBuffer();
    console.log(this);

    window.addEventListener("scroll", this.playSegment.bind(this), false);
  }

  playSegment() {
    if (!this.buffer.audioLength) throw "load file first.";
    const { buffer, lastPos, autoScrolling } = this;
    if (autoScrolling) {
        return
    }
    else {
      const start = lastPos;
      const end = this.getRelativePos(window.scrollY);
      buffer.queueSegment(start, end, 1);
      this.lastPos = end;
    }
  }

  async loadBufferAsync(audiofile) {
    // from https://stackoverflow.com/questions/48969495/in-javascript-how-do-i-should-i-use-async-await-with-xmlhttprequest
    const scrollElement = this;
    const { buffer } = this;
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://localhost:8080/" + audiofile, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = async function () {
        var status = xhr.status;
        if (status != 200) {
          reject(status);
        }
        console.log("Loading", scrollElement);
        await buffer.loadAsync(xhr.response);
        scrollElement.setElementProps();
        console.log("Loaded", scrollElement);
        resolve(buffer);
      };

      xhr.send();
    });
  }

  setElementProps() {
    const { buffer, resize, element } = this;
    if (resize) {
      this.elementSize =
        this.durationToPixels(buffer.audioLength) + window.innerHeight;
      element.style.height = this.elementSize + "px";
    } else {
      this.elementSize = element.scrollHeight;
      this.pixelsPerSecond = this.elementSize / buffer.audioLength;
    }
    this.pixelStop = this.pixelStart + this.elementSize;
  }

  pixelsToDuration(pixels) {
    return pixels / this.pixelsPerSecond;
  }

  durationToPixels(duration) {
    return Math.ceil(duration * this.pixelsPerSecond);
  }

  getRelativePos(scrollY) {
    return this.pixelsToDuration(this.getRelativeScroll(scrollY));
  }

  getRelativeScroll(scrollY) {
    return scrollY + this.pixelStart;
  }

  stopAutoScroll() {
    if (!this.buffer.audioLength) throw "load file first.";
    this.autoScrolling = false;
    this.buffer.clearLabel();
    this.scroll?.stop();
    console.log("stopping autoscroll");
  }

  autoScroll(speed) {
    if (!this.buffer.audioLength) throw "load file first.";
    const { buffer } = this;
    if (this.autoScrolling) {
      buffer.clearLabel();
    }
    const currPos = this.getRelativePos(window.scrollY);
    const { audioLength } = buffer;
    buffer.setLabelBySpeed(speed);
    this.autoScrolling = true;
    const target = buffer.match("max", "0");
    const remainingDuration = buffer.match(
      () => audioLength - currPos,
      () => currPos
    );
    buffer.queueSegment(
      currPos,
      buffer.match(audioLength, 0),
      remainingDuration
    );
    this.scroll = scrollTo(target, {
      duration: remainingDuration * 1000,
      interrupt: true,
      onAfter: this.stopAutoScroll.bind(this),
    });
    console.log("autoscrolling for", remainingDuration, "to", target);
  }

  getSongProgress() {
    return this.getRelativePos(window.scrollY) / this.buffer.audioLength;
  }
}
