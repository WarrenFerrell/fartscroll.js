"use strict";

export default class DirectionLabel {
	static fwd = 'fwd';
	static rev = 'rev';

	static runOp(label, fwdFunc, revFunc) {
		switch (label) {
			case DirectionLabel.fwd:
				return fwdFunc();
			case DirectionLabel.rev:
				return revFunc();
			default:
				console.log('unrecognized label or not set', label);
		}
	}

	static getOther(label) {
		return this.runOp(label, () => this.rev, () => this.fwd)
	}
}