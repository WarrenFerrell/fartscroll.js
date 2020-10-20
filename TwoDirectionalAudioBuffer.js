"use strict";

import DirectionLabel from "./DirectionLabel.js";

export default class TwoDirectionalAudioBuffer {

  /// ArrayBuffer
  constructor() {
    this.fwdContext = new AudioContext();
    this.revContext = new AudioContext();
    this.currPos = 0;
  };

  async loadAsync(buffer) {
    const {
      fwdContext,
      revContext
    } = this;
    console.log('decoding', buffer, 'with', fwdContext, revContext)
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
    console.log('made buffers', fwdContext.buffer, revContext.buffer)
    return
  }

  getContext(label) {
    return DirectionLabel.runOp(label, () => this.fwdContext, this.revContext);
  }

  createSource(context, buffer) {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    return source;
  }

  swapSource(label) {
    const swapCurr = function (currSource, newContext) {}
    if (label === this.currLabel) return false;
    this.currLabel = label;
    const newContext = this.getContext(DirectionLabel.getOther(label));
    this.currContext = newContext;
    var currSource = this.currSource;
    if (currSource) {
      console.log('stopping', currSource, 'for window', window)
      currSource.stop();
    }

    currSource = this.createSource(newContext, newContext.buffer);
    currSource.start();
    console.log('starting', currSource);

    this.currSource = currSource;

  }



}