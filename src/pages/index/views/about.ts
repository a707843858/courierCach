import { defineComponent, h } from 'vue';
export default defineComponent({
  name: "about",
  setup() { 
    return () => h('div',{class:"about"},h('h1','This is an about page'));
  },
});