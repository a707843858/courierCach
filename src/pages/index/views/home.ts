import { defineComponent,h } from "vue";
import HelloWorld from '../components/common/HelloWorld.vue'; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  setup() { 
    return () => h('div', { class: 'home' }, [
      h('img', { alt: 'Vue log', src: require('../assets/images/logo.png') }),
      h(HelloWorld, {msg:"Welcome to Your Vue.js + TypeScript App"}),
    ]);
  },
});
