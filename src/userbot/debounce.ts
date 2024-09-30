export class DebounceMessage {
	timeout: any;
	constructor() {
		this.timeout = null;
	}

	debounce(callback: () => void, delay: number | undefined) {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}

		this.timeout = setTimeout(() => {
			callback();
		}, delay);
	}
}
