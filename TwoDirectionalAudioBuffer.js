"use strict";

import DirectionLabel from "./DirectionLabel.js";
import Queue from "./Queue.src.js";

export default class TwoDirectionalAudioBuffer {

  /// ArrayBuffer
  constructor() {
    this.fwdContext = new AudioContext();
    this.revContext = new AudioContext();
    this.currPos = 0;
    this.q = Queue();
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
    this.duration = fwdContext.buffer.duration;
    this.lengthPerSec = this.length / this.duration;
    // console.log('loaded object', this)
    return
  }

  getContext(label) {
    return DirectionLabel.match(label, () => this.fwdContext, this.revContext);
  }

  getPlayingSegment() {
    const { context } = this.currContext
    while(this.q.hasNext()) {
      var item = this.q.peek();
      if (item.end < context.currentTime) {
        return item;
      }
      this.q.dequeue();
    }
  }

  queueSegment(start, end, speed) {
    const { context } = this.currContext
    const source = context.createBufferSource();
    source.buffer = buffer;
    speed = Math.abs(speed);
    source.connect(context.destination);
    const duration = Math.abs(end - start);
    const realDuration = duration / speed;
    var currItem = getPlayingItem();
    const when = currItem?.end ?? context.currentTime;
    const item = {
      source = source,
      when = when,
      offset = start,
      realDuration = realDuration,
      end = when + realDuration,
    }
    source.playbackRate.value = speed;
    source.start(item.when, item.offset, item.duration);
    this.q.enqueue(item)
    return source;
  }

  setLabel(label) {
    if (label === this.currLabel) return false;
    this.currLabel = label;
    const newContext = this.getContext(DirectionLabel.getOther(label));
    this.currContext = newContext;
    var oldSources = this.q.clear();

    oldSources.forEach(item => {item.source.stop());
  }

  getOrCreateSource(){

  }

match(fwdFunc, revFunc) {
  return DirectionLabel.match(this.currLabel, fwdFunc, revFunc);
}

}