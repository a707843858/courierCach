export class Task {
	private queue: Map<Request, any> = new Map();

	get(original: Request) {
		return this.queue.get(original);
	}

	set(original: Request, controller: any) {
		this.queue.set(original, controller);
		return true;
	}

	delete(original: Request) {
		return this.queue.delete(original);
	}

	size() {
		return this.queue.size;
	}

	clear() {
		this.queue = new Map();
		return true;
	}
}