import Vue from 'vue'
// import VueDraggable from 'vuedraggable'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
// Vue.use(VueDraggable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
