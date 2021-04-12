import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Courier from './packages';

const courier = new Courier();
courier.interceptRequest(
	(config) => {
		// console.log(res);
		return config;
	},
	(err) => {
		// console.log(err);
	}
);

// courier.interceptResponse((res) => {
// 	// console.log(res, 'hhhh');
// 	return "1"
// });


class App extends Component {
	async componentDidMount() {
		// const a = await window.caches.open('apiCache');
		// a.add('https://discuz.chat/api/emoji');
		// const cc = await a.keys();
		// console.log(cc.length);
		// a.add('https://discuz.chat/api/emoji');
		// console.log(await a.match('https://discuz.chat/api/emoji'));
		// console.log(courier, 'a');
		// a.keys().then(res => { 
			// console.log(res[0].headers.get('a')); 
		// })

		// var myHeaders = new Headers();
		// myHeaders.append('Content-Type', 'image/jpeg');

		courier.fetch('https://discuz.chat/api/emoji', { expires: 60000 * 1, body: { a: 1 } }).then((res) => {//
			console.log(res.headers.get('_expires'));
			// a.put('flowers.jpg', res);
			console.info(res, 'data');
			console.log(courier);
			courier.cacheType = 'aa';
			console.log(courier);
		}).catch(err => {
			console.log(err);
		});
		// setInterval(() => {
		// window.fetch('https://discuz.chat/api/emoji').then((res) => {
		// 		a.put({bodyUsed: false,cache: "default",credentials: "omit",destination: "",headers: Headers {},integrity: "",isHistoryNavigation: false,keepalive: false,method: "GET",mode: "no-cors",redirect: "follow",referrer: "",referrerPolicy: "unsafe-url",url: "https://discuz.chat/api/emoji,GET,"},res)
		// 		// console.info(res, 'data');
		// 		// console.log(courier);
		// 	});
		// }, 10000);
	}
	render() {
		return <div>1</div>;
	}
}

export default App;
