// TwoDirectionalAudioBuffer.js
"use strict";

import DirectionLabel from "./DirectionLabel.js";

export default class TwoDirectionalAudioBuffer {

  /// ArrayBuffer
  constructor() {
    this.fwdContext = new AudioContext();
    this.revContext = new AudioContext();
    this.currSegments = [];
  };

  async loadAsync(buffer) {
    const {
      fwdContext,
      revContext
    } = this;
    console.log('decoding', buffer)
    await fwdContext.decodeAudioData(buffer.slice(), function (audioBuffer) {
      fwdContext.buffer = audioBuffer;
    })
    await revContext.decodeAudioData(buffer, function (audioBuffer) {
      audioBuffer.getChannelData(0).reverse();
      audioBuffer.getChannelData(1).reverse();
      revContext.buffer = audioBuffer;
    })
    this.length = fwdContext.buffer.length;
    this.audioLength = fwdContext.buffer.duration;
    this.lengthPerSec = this.length / this.audioLength;
    // console.log('loaded object', this)
    return
  }

  getContext(label) {
    return DirectionLabel.match(label, () => this.fwdContext, this.revContext);
  }

  getLastSegment() {
    if (this.currSegments.length == 0) return;

    return this.currSegments[this.currSegments.length - 1];
  }

  queueSegment(start, end, duration) {
    this.setLabelBySegment(start, end);
    const [srcStart, srcEnd ] = this.match(
      [ start, end ],
      () => [ this.getReversePos(start), this.getReversePos(end) ]
    )

    const legnth = srcEnd - srcStart;
    const speed = legnth / duration;
    let currItem = this.getLastSegment();
    const when = currItem?.stop ?? this.currContext.currentTime;
    const source = this.createSource();
    const item = {
      start: start,
      end: end,
      duration: duration + 0.5,
      speed: speed,
      when: when,
      stop: when + duration,
      srcStart: srcStart,
      srcEnd: srcEnd,
      source: source,
    }
    console.log('queueing', item)
    source.playbackRate.value = speed;
    source.start(when, srcStart, item.duration);
    this.currSegments.push(item)
    return source;
  }

  getReversePos(pos){
    return Math.max(this.audioLength - pos, 0);
  }

  setLabelBySegment(start, end) {
    return this.setLabelBySpeed(end - start);
  }

  setLabelBySpeed(speed) {
    let label = speed > 0 ? DirectionLabel.fwd : DirectionLabel.rev;
    if (label === this.currLabel) return false;
    this.clearLabel();
    this.currLabel = label;
    this.currContext = this.getContext(label);
  }

  clearLabel() {
    this.currLabel = null;
    let oldSources = this.currSegments;
    this.currSegments = [];
    oldSources.forEach(item => item.source.stop());
  }

  createSource(){
    const context  = this.currContext
    const source = context.createBufferSource();
    source.connect(context.destination);
    source.buffer = context.buffer;
    return source;
  }

match(fwdFunc, revFunc) {
  return DirectionLabel.match(this.currLabel, fwdFunc, revFunc);
}

}