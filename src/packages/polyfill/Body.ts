// export interface SupportMap {
// 	blob: boolean;
// 	formData: boolean;
// 	arrayBuffer: boolean;
// }

import { supported } from '../utils';

export interface BodyInternal {
	init?: BodyInit | null;
	text?: string;
	blob?: Blob;
	formData?: FormData;
	arrayBuffer?: ArrayBuffer;
}

const generatBody = function (body?: BodyInit | null) {
	const res: BodyInternal = { init: body || '' };
	if (!body) {
		res.text = '';
	} else if (supported.urlSearchParams && body instanceof URLSearchParams) {
		res.text = body.toString();
	} else if (supported.blob && body instanceof Blob) {
		res.blob = body;
	} else if (supported.formData && body instanceof FormData) {
		res.formData = body;
	} else if (supported.arrayBuffer && supported.blob && body instanceof DataView) {
		res.arrayBuffer = bufferClone(body.buffer);
		res.init = new Blob([res.arrayBuffer]);
	} else {
		res.text = body = Object.prototype.toString.call(body);
	}

	return res;
};

const convertArrayBuffer = async function (body: BodyInternal): Promise<ArrayBuffer> {
	let response: ArrayBuffer | Error;
	if (!supported.arrayBuffer) {
		response = new Error(`Don't support ArrayBuffer`);
	} else {
		if (body.arrayBuffer) {
			if (ArrayBuffer.isView(body.arrayBuffer)) {
				response = body.arrayBuffer.buffer.slice(body.arrayBuffer.byteOffset, body.arrayBuffer.byteOffset + body.arrayBuffer.byteLength);
			} else {
				response = body.arrayBuffer;
			}
		} else {
			const data = await convertBlob(body).catch(() => new Blob());
			response = await fileReaderAsArrayBuffer(data).catch((err) => err);
		}
	}
	return response instanceof Error ? Promise.reject(response.message) : response;
};

const convertBlob = async function (body: BodyInternal): Promise<Blob> {
	let response: Blob | Error;
	if (!supported.blob) {
		response = new Error(`Don't support Blob`);
	} else {
		if (body.blob) {
			response = body.blob;
		} else if (body.arrayBuffer) {
			response = new Blob([body.arrayBuffer]);
		} else if (body.formData) {
			response = new Error('Could not read FormData body as blob');
		} else if (body.text) {
			response = new Blob([body.text]);
		} else {
			response = new Error('Could not read body as blob');
		}
	}
	return response instanceof Error ? Promise.reject(response.message) : response;
};

const convertFormData = async function (body: BodyInternal): Promise<FormData> {
	let response: FormData = new FormData();
	const data = await convertText(body).catch(() => '');
	if (data) {
		data
			.trim()
			.split('&')
			.forEach((item: string) => {
				if (item) {
					let col = item.split('=');
					response.append(col[0], col[1]);
				}
			});
		return response;
	} else {
		return Promise.reject('Could not read body as formData');
	}
};

const convertJson = async function (body: BodyInternal): Promise<any> {
	let response: JSON;
	const data = await convertText(body).catch(() => '');
	try {
		response = JSON.parse(data);
	} catch (e) {
		return Promise.reject(e.message);
	}
	return response;
};

const convertText = async function (body: BodyInternal): Promise<string> {
	let response: any;
	if (body.blob) {
		response = await fileReaderAsText(body.blob).catch((err) => err);
	} else if (body.arrayBuffer) {
		const data = await convertBlob(body).catch(() => new Blob());
		response = await fileReaderAsText(data).catch((err) => err);
	} else if (body.formData) {
		response = new Error('Could not read FormData body as text');
	} else {
		response = body.text;
	}
	return response instanceof Error ? Promise.reject(response.message) : response;
};

const filePromise = function (fileReader: FileReader) {
	return new Promise((resolve, reject) => {
		if (!('FileReader' in globalThis)) {
			reject(new Error(`Don't support FileReader`));
		}
		fileReader.onload = function () {
			resolve(fileReader.result);
		};
		fileReader.onerror = function () {
			reject(fileReader.error);
		};
	});
};

const fileReaderAsText = function (data: Blob | File) {
	const fileReader = new FileReader();
	const _filePromise = filePromise(fileReader) as Promise<Text>;
	fileReader.readAsText(data);
	return _filePromise;
};

const fileReaderAsArrayBuffer = function (data: Blob | File) {
	const fileReader = new FileReader();
	const _filePromise = filePromise(fileReader) as Promise<ArrayBuffer>;
	fileReader.readAsArrayBuffer(data);
	return _filePromise;
};

const bufferClone = function (buff: any) {
	if (buff instanceof ArrayBuffer) {
		return buff.slice(0);
	} else {
		if (!supported.uint8Array) {
			throw new Error("Don't support Uint8Array");
		}
		let view = new Uint8Array(buff.bytelength);
		view.set(new Uint8Array(buff));
		return view.buffer;
	}
};

class CBody implements Body {
	readonly body: ReadableStream<Uint8Array> | null = null;
	static _bodyUsed: boolean = false;
	static _body: BodyInternal = { init: '' };
	readonly _isPolyfill: boolean = true;

	constructor(body: BodyInit | null | undefined = null) {
		CBody._body = generatBody(body || null);
		// if ('ReadableStream' in globalThis && 'Uint8Array' in globalThis && body) {
		// 	this.body = new ReadableStream(new Uint8Array(body));
		// }
	}

	get bodyUsed() {
		return CBody._bodyUsed;
	}

	set bodyUsed(params: boolean) {
		throw Error(`Can't set read-only property bodyUse to  ${params}`);
	}

	async arrayBuffer(): Promise<ArrayBuffer> {
		if (this.bodyUsed) {
			return Promise.reject(new Error('Body is already been used !'));
		}
		const response = convertArrayBuffer(CBody._body);
		CBody._bodyUsed = true;
		return response;
	}

	async blob(): Promise<Blob> {
		if (this.bodyUsed) {
			return Promise.reject(new Error('Body is already been used !'));
		}
		const response = convertBlob(CBody._body);
		CBody._bodyUsed = true;
		return response;
	}

	async formData(): Promise<FormData> {
		if (this.bodyUsed) {
			return Promise.reject(new Error('Body is already been used !'));
		}
		const response = convertFormData(CBody._body);
		CBody._bodyUsed = true;
		return response;
	}

	async json(): Promise<any> {
		if (this.bodyUsed) {
			return Promise.reject(new Error('Body is already been used !'));
		}
		const response = convertJson(CBody._body);
		CBody._bodyUsed = true;
		return response;
	}

	async text(): Promise<string> {
		if (this.bodyUsed) {
			return Promise.reject(new Error('Body is already been used !'));
		}
		const response = convertText(CBody._body);
		CBody._bodyUsed = true;
		return response;
	}
}
export { CBody };
