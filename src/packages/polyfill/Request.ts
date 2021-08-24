import { CBody } from './Body';

class CRequest extends CBody implements Request {
	readonly cache: RequestCache = 'default';
	readonly credentials: RequestCredentials = 'same-origin';
	readonly destination: RequestDestination = '';
	readonly headers: Headers = new Headers();
	readonly integrity: string = '';
	readonly isHistoryNavigation: boolean = false;
	readonly isReloadNavigation: boolean = false;
	readonly keepalive: boolean = false;
	readonly method: string = 'GET';
	readonly mode: RequestMode = 'cors';
	readonly redirect: RequestRedirect = 'follow';
	readonly referrer: string = 'client';
	readonly referrerPolicy: ReferrerPolicy = '';
	readonly signal: AbortSignal;
	readonly url: string = '';

	constructor(input: RequestInfo, init?: RequestInit) {
		super((typeof input !== 'string' && input?.body) || null);
		const controller = new AbortController();
		this.signal = controller.signal;
		if (input instanceof Request) {
			Object.keys(input).forEach((name) => {
				this[name] = input[name];
			}, this);
		} else if (typeof input === 'string') {
			this.url = input;
		}

		if (init) {
			Object.getOwnPropertyNames(init).forEach((name) => {
				this[name] = init[name];
			}, this);
		}
	}

	clone(): Request {
		return new CRequest(this);
	}
}

export { CRequest };
