import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Courier from './packages';

const courier = new Courier();
courier.interceptRequest((res) => {
	// console.log(res);
	return res;
}, (err => {
	// console.log(err);
}));

courier.interceptResponse((res) => {
	// console.log(res, 'hhhh');
	return "1"
});

class App extends Component {
	componentDidMount() {
		// console.log(courier, 'a');
		courier.get('https://discuz.chat/api/emoji', { expires: 60 * 1000, body: { category: 'trending', lang: 'javascript', limit: 30, offset: 0, period: 'day' } }).then((res) => {
			console.info(res, 'data');
			// console.log(courier);
		});
		// setInterval(() => {
		// 	courier.get('https://discuz.chat/api/emoji', { expires: 60 * 1000, body: { category: 'trending', lang: 'javascript', limit: 30, offset: 0, period: 'day' } }).then((res) => {
		// 		console.info(res, 'data');
		// 		// console.log(courier);
		// 	});
		// }, 10000);
	}
	render() {
		return <div>1</div>;
	}
}

export default App;
