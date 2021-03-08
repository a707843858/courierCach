// const env = window ? 'window' : this === 'node' ? 'node' : '';
// const f = env === 'window' ? window.fetch : '';
const courier = require('../courier'),
	utils = require('../utils'),
	tasks = require('../task'),
	cach = require('../cach'),
	deaults = {};

// const Courier = new courier({});

deaults.tasks = tasks.tasksProxy;
deaults.cach = cach.cachProxy;

deaults.create = function(config) {
	config = typeof config !== 'object' ? {} : config;
	return new courier(config);
};

export default deaults;
