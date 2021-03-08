<template>
	<div id="nav">
		<router-link to="/">Home</router-link> |
		<router-link to="/about">About</router-link>
	</div>
	<router-view />
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
export default {
	setup() {
		const currentInstance = getCurrentInstance(),
			vm =
				currentInstance && currentInstance.appContext && currentInstance.appContext.config && currentInstance.appContext.config.globalProperties
					? currentInstance.appContext.config.globalProperties
					: {},
			$postBox = vm.$postBox;
		// console.log($postBox);
		const postBox = $postBox.create();
		console.log(postBox);

		var myHeaders = new Headers();
		console.log(myHeaders);
		// postBox.defaults.beforeFetch = function(val: any) {
		// 	console.log(val);
		// 	val.b = 2;
		// 	// return val;
		// };
		postBox.get('https://discuz.chat/api/emoji', { a: 1 }, { expirationTime: 1000 * 60 }).then((res: any) => {
			console.info(res, 'data');
			console.log($postBox);
		});
	},
};
</script>
<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
