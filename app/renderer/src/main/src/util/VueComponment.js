import {Tabs, TabPane, Container, Header, Aside, Main,Message,MessageBox} from 'element-ui'
import Vue from 'vue'

Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
// Vue.use(MessageBox)
// Vue.use(Message)
Vue.prototype.$message = Message

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt

