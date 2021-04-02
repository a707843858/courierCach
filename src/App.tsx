import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Courier from './packages';
const courier = new Courier();

class App extends Component {
	componentDidMount() {
		// window.caches.open('/a').then((res) => {
		// 	res
		// 		.put('/https://e.xitu.io/resources/github', {
		// 			body: {},
		// 			bodyUsed: false,
		// 			headers: new Heaedr(),
		// 			ok: true,
		// 			redirected: false,
		// 			status: 200,
		// 			statusText: 'OK',
		// 			type: 'basic',
		// 			url: 'http://localhost:3000/https://e.xitu.io/resources/github',
		// 		})
		// 		.then((ress) => {
		// 			console.log('Data cached ', ress);
		// 		});
		// 	res.match('/https://e.xitu.io/resources/github').then((ress) => {
		// 		console.log(ress);
		// 	});
		// });
		// console.log(courier, 'a');
		courier.get('https://discuz.chat/api/emoji', { expires: 60 * 1000, body: { category: 'trending', lang: 'javascript', limit: 30, offset: 0, period: 'day' } }).then((res) => {
			console.info(res, 'data');
			// console.log(courier);
		});
		// courier.get('https://discuz.chat/api/emoji', { expires: 60 * 1000 }).then((res) => {
		// 	console.info(res, 'data');
		// 	console.log(courier);
		// });
		setInterval(() => {
			courier.get('https://discuz.chat/api/emoji', { expires: 60 * 1000, body: { category: 'trending', lang: 'javascript', limit: 30, offset: 0, period: 'day' } }).then((res) => {
				console.info(res, 'data');
				// console.log(courier);
			});
		}, 10000);
	}
	render() {
		return <div>1</div>;
	}
}

export default App;
