import { createApp } from 'vue';
import App from './index.vue';
import router from './router';
import store from './store';
import postBox from '../../../package/index';

const app = createApp(App);

app.config.globalProperties.$postBox = postBox;



app
	.use(store)
	.use(router)
	.mount('#app');
