"use strict";

export default class DirectionLabel {
	static fwd = 'fwd';
	static rev = 'rev';

	static match(label, fwdFunc, revFunc) {
		switch (label) {
			case DirectionLabel.fwd:
				return nsEval(fwdFunc);
			case DirectionLabel.rev:
				return nsEval(revFunc);
			default:
				console.log('unrecognized label or not set', label);
		}
	}

	static getOther(label) {
		return this.match(label, () => this.rev, () => this.fwd)
	}
	
	nsEval(v) {if (v instanceof Function) { return v() } else { return v } };

}