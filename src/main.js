import Vue from 'vue'
import API from './common/api'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import Utils from './common/utils'
import 'element-ui/lib/theme-chalk/reset.css'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$api = new API()
Vue.prototype.Utils = Utils

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
