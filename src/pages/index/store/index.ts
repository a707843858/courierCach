import { createStore } from 'vuex';
import modules from './modules/index';
import mutations from './mutations';
import actions from './actions';

export default createStore({
	state: {
		userAgent: '',
	},
	mutations,
	actions,
	modules,
});
