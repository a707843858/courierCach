import { CHeaders } from './Headers';
import { CBody } from './Body';

// export interface CResponseInit {
// 	headers?: CHeadersInit;
// 	status?: number;
// 	statusText?: string;
// }

class CResponse extends CBody implements Response {
	readonly headers: CHeaders = new CHeaders();
	readonly ok: boolean = true;
	readonly redirected: boolean = false;
	readonly status: number = 200;
	readonly statusText: string = '';
	readonly type: ResponseType = 'cors';
	readonly url: string = '';
	readonly trailer: Promise<Headers>;
	//body --
	// readonly body: ReadableStream<Uint8Array> | null = null;
	// static _bodyUsed: boolean = false;
	// static _body: BodyInternal = { init: '' };
	// readonly _isPolyfill: boolean = true;

	constructor(body?: BodyInit | null, init?: ResponseInit) {
		super(body || null);
		//body
		// CResponse._body = generatBody(body || null);
		// if (supported.readableStream && supported.uint8Array && body) {
		// 	this.body = new ReadableStream(new Uint8Array(body));
		// }

		//response
		this.trailer = Promise.resolve(this.headers);
		if (init) {
			Object.getOwnPropertyNames(init).forEach((name) => {
				this[name] = init[name];
			});
		}
	}

	get bodyUsed() {
		return CResponse._bodyUsed;
	}

	set bodyUsed(params: boolean) {
		throw Error(`Can't set read-only property bodyUse to  ${params}`);
	}

	// async arrayBuffer(): Promise<ArrayBuffer> {
	// 	if (this.bodyUsed) {
	// 		return Promise.reject(new Error('Body is already been used !'));
	// 	}
	// 	const response = convertArrayBuffer(CResponse._body);
	// 	CResponse._bodyUsed = true;
	// 	return response;
	// }

	// async blob(): Promise<Blob> {
	// 	if (this.bodyUsed) {
	// 		return Promise.reject(new Error('Body is already been used !'));
	// 	}
	// 	const response = convertBlob(CResponse._body);
	// 	CResponse._bodyUsed = true;
	// 	return response;
	// }

	// async formData(): Promise<FormData> {
	// 	if (this.bodyUsed) {
	// 		return Promise.reject(new Error('Body is already been used !'));
	// 	}
	// 	const response = convertFormData(CResponse._body);
	// 	CResponse._bodyUsed = true;
	// 	return response;
	// }

	// async json(): Promise<any> {
	// 	if (this.bodyUsed) {
	// 		return Promise.reject(new Error('Body is already been used !'));
	// 	}
	// 	const response = convertJson(CResponse._body);
	// 	CResponse._bodyUsed = true;
	// 	return response;
	// }

	// async text():Promise<string> {
	// 	if (this.bodyUsed) {
	// 		return Promise.reject(new Error('Body is already been used !'));
	// 	}
	// 	const response = convertText(CResponse._body);
	// 	CResponse._bodyUsed = true;
	// 	return response;
	// }

	clone(): CResponse {
		return new CResponse(this.body, { headers: this.headers, status: this.status, statusText: this.statusText });
	}

	static error(): CResponse {
		return new CResponse(null, { status: 0, statusText: '' });
	}

	static redirect(url: string, status?: number) {
		return new Response(null, { status: status, headers: { location: url } });
	}

}

export { CResponse };
