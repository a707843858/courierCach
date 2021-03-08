import axios from 'axios';
import Router from '../../../router';

axios.interceptors.request.use(
	(config: any) => {
		return config;
	},
	(error: any) => {
		return Promise.reject(error);
	}
);

axios.defaults.timeout = 36000000; //设置超时时间

axios.interceptors.response.use(
	(response: any) => {
		// 检测某种状态进行重定向
		if (response.data.code === 403) {
			Router.push({
				name: 'login',
			});
		}
		return response;
	},
	(error: any) => {
		return Promise.resolve(error.response);
	}
);

export default axios;
