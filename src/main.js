import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueApollo from 'vue-apollo'
import store from './store'
import { Button, Form, Input, Icon, message, Modal } from 'ant-design-vue'
import '@/assets/styles/globle.scss'
import { client } from '@/apollo-client'

Vue.use(VueApollo)
Vue.use(Form)
Vue.component(Button.name, Button)
Vue.component('message', message)
Vue.component(Form.Item.name, Form.Item)
Vue.component(Input.name, Input)
Vue.component(Icon.name, Icon)

const apolloProvider = new VueApollo({
  defaultClient: client
})

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm

Vue.config.productionTip = false
new Vue({
  router,
  store,
  apolloProvider,
  render: (h) => h(App)
}).$mount('#app')
