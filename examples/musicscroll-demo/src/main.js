import Vue from 'vue'
import App from './App.vue'
import { BButton } from 'bootstrap-vue'

Vue.component('b-button', BButton)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
