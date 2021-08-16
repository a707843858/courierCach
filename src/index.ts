import Courier from './packages';
import { Config } from './packages';
// import { CFetch as ff, CRequest } from './packages/polyfill';

const courier = new Courier({ timeout: 1000 * 60, expires: 1000 * 60,cacheType:'cacheStorage' });

// courier.useRequestIntercept((config) => {
// 	console.log('config', config);
// 	return config;
// });

// const a = new Headers();
// a.set('a', 'a')
// a.append('a', 'b');
// console.log(a);

//http://192.168.110.241:10011/dev-gdznyw-consumer/owner
// fetch('http://192.168.110.241:10011/dev-gdznyw-consumer/owner').then(async (res) => {
// 	console.log( await res.json(),'lll');
// });

// const a = new FormData();
// a.append('a', 'm');
// const B = new Request('',{body:a});
// console.log(B.text(),'nnn');

courier
	.useFetch('http://192.168.110.241:10011/dev-gdznyw-consumer/owner', { expires: 60000 * 1, params:{a:1}, method: 'get',headers:{ 'b':'2'} })
	.then(async (res) => {
		//
		// courier.task.queue.set('http://192.168.110.241:10011/dev-gdznyw-consumer/owner,GET,','a');
		// console.log(courier.task.queue.get('http://192.168.110.241:10011/dev-gdznyw-consumer/owner,GET,'), 'task');
		// a.put('flowers.jpg', res);
		// console.info(res.json(), 'data');
		// courier.cacheType = 'aa';
		// const b = res.json();
		// courier.cache.forEach((name, value, arr) => {
		// 	console.log(name, value, arr);
		// });
		console.log(res,'res');
		console.log(await res.json(), 'nnnn');
	})
	.catch((err) => {
		console.log(err, 'n');
	});


setTimeout(() => {
	courier
		.useFetch('http://192.168.110.241:10011/dev-gdznyw-consumer/owner', { expires: 60000 * 1, params: { a: 1 }, method: 'get',headers:{a:'1'} })
		.then(async (res) => {
			//
			// courier.task.queue.set('http://192.168.110.241:10011/dev-gdznyw-consumer/owner,GET,','a');
			// console.log(courier.task.queue.get('http://192.168.110.241:10011/dev-gdznyw-consumer/owner,GET,'), 'task');
			// a.put('flowers.jpg', res);
			// console.info(res.json(), 'data');
			// courier.cacheType = 'aa';
			// const b = res.json();
			// courier.cache.forEach((name, value, arr) => {
			// 	console.log(name, value, arr);
			// });
			console.log(res,await res.json(), 'nnnn44');
		})
		.catch((err) => {
			console.log(err, 'n');
		});
}, 1000*5);

// const a = new Request('/a', { mode: 'cors', credentials:'include' });
// const b = new Request(a,{mode:"same-origin"});
// const c = new Request('');
// console.log(b, c, 'b');
// console.log('Headers',a instanceof Headers);

// console.log(b,'b');
// let debug = { hello: 'world' };
// let A = new ArrayBuffer(12);
// let B = new Blob([JSON.stringify(debug, null, 2)]);
// console.log(A instanceof ArrayBuffer,B instanceof ArrayBuffer ,'arraybuff');

// let xhr = new XMLHttpRequest();
// console.log(xhr);
// let request = new Request('http://192.168.110.241:10011/dev-gdznyw-consumer/owner?a=1');
// console.log(request,'r');
// ff('/api/news').then(async (res) => {
// 	const data = await res.arrayBuffer().catch((e) => {
// 		console.log('e', e);
// 		return new Blob();
// 	});
// 	console.log(res,data, 'kkkkkkk');
// });

// const aa = new Request('http://192.168.110.241:10011/dev-gdznyw-consumer/owner?a=1');
// const nn = new Map();
// nn.set(aa, 'bb');
// console.log(nn.get(aa),'aa');

// interface CallOrConstruct {
// 	new (s: string): Date;
// 	(n?: number): number;
// }

// interface MyInterface {
// 	new (): MyInterface;
// }

// let Greeter = (function () {
// 	function Greeter(message) {
// 		this.greeting = message;
// 	}
// 	Greeter.prototype.greet = function () {
// 		return 'Hello, ' + this.greeting;
// 	};
// 	return Greeter;
// })();

// let greeter = new Greeter('world');

// console.log(greeter);

export default { Config };
