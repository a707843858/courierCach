const tasks: any[] = [];

const tasksProxy = new Proxy(tasks, {
	get: function (target: any, key: string | symbol) {
		return target[key];
	},
	set: function (target: any, key: string | symbol, receiver: any) {
		if (key !== 'length') {
			tasks[key] = receiver;
		}
		return Reflect.set(target, key, receiver);
	},
});

const createKey = function (url: string, config: any) {
	let key = `${url},${config.method},`;
	key += config.body ? JSON.stringify(config.body) : '';
	return key;
};

const addTask = function (original: string, controller: any) {
	tasksProxy.push({
		original,
		controller,
	});
};

const deleteTask = function (original: string, start: boolean) {
	for (let i = 0; i < tasksProxy.length; i++) {
		if (tasksProxy[i].original === original) {
			if (start) {
				tasksProxy[i].controller.abort();
			}
			tasksProxy.splice(i, 1);
			break;
		}
	}
};

const taskModule = {
	tasksProxy,
	createKey,
	addTask,
	deleteTask,
};

export default taskModule;
