"use strict";

import { DirectionLabel } from "./DirectionLabel.js";

export default class TwoDirectionalAudioBuffer {
	
	/// ArrayBuffer
	constructor() {
		this.fwdContext = new AudioContext();
		this.revContext = new AudioContext();
		this.currPos = 0;
	};
	 
  async loadAsync(buffer) {
    console.log('decoding', this.buffer, 'with',  this.fwdContext, this.revContext)
    await fwdContext.decodeAudioData(buffer.slice(), function (audioBuffer) {
      this.fwdContext.buffer = audioBuffer;
	  this.length = audioBuffer.length;
	  this.duration = audioBuffer.duration;
    })
    await revContext.decodeAudioData(buffer, function (audioBuffer) {
      audioBuffer.getChannelData(0).reverse();
      audioBuffer.getChannelData(1).reverse();
      this.revContext.buffer = audioBuffer;
	})
    console.log('made buffers',  this.fwdContext.buffer, this.revContext.buffer)
    return 
  }

  getContext(label) {
	return DirectionLabel.runOp(label, () => this.fwdContext, this.revContext);
  }

  swapSource(label) {
	const setSourceFn = function (context) {
		return () => this.currSource = this.createSource(context, context.buffer)
	}  
	const swapCurr = function(currSource, newContext) {
		}
	if (label === this.currLabel) return false;		
		this.currLabel = label;
	const newContext = this.getContext(DirectionLabel.getOther(label));
	this.currContext = newContext;
	var currSource = this.currSource;
	if (currSource) {
            console.log('stopping', currSource, 'for window', window)
            currSource.stop();
		}
		 
    currSource = createSource(newContext, newContext.buffer);          
 currSource.start();
 console.log('starting', currSource);
 
 this.currSource = currSource;
 
  }

  
  
  createSource(context, buffer) {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    return source;
  }
}