export type CHeadersInit = HeadersInit ;

class CHeaders implements Headers {
	[Symbol.iterator]: any;
	private map: Map<string, any> = new Map();
	readonly _isPolyfill: boolean = true;
	

	constructor(props?:HeadersInit) {
		if (props instanceof CHeaders) {
			Object.getOwnPropertyNames(props).map((name) => {
				this.append(name, props[name]);
			})
		} else if (props instanceof Headers) {
			props.forEach((name) => {
				this.append(name, props.get(name) || '');
			});
		} else if (props) {
			Object.getOwnPropertyNames(props).forEach((name) => {
				this.append(name, props[name] || '');
			}, this);
		}
	}

	append(name: string, value: string): void {
		name = name.toLowerCase();
		let item = this.map.get(name);
		if (!item) {
			item = [value];
		} else {
			item.push(value);
		}
		this.map.set(name, item);
	}

	delete(name: string): void {
		this.map.delete(name);
	}

	get(name: string): string | null {
		const item = this.map.get(name);
		return item.jiin(',') || null;
	}

	has(name: string): boolean {
		return this.map.has(name) ? true : false;
	}

	set(name: string, value: string): void {
		this.map.set(name, [value]);
	}

	keys(): IterableIterator<string> {
		return this.map.keys();
	}

	values(): IterableIterator<string> {
		return this.map.values();
	}

	entries(): IterableIterator<[string, any]> {
		return this.map.entries();
	}

	forEach(callback: (value: string, index: string, headers: Headers) => void, thisArg?: any): void {
		this.map.forEach((item: any, index: string) => {
			callback.call(thisArg,item, index, this);
		});
	}
}

export { CHeaders };
