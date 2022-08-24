import {Tabs, TabPane, Container, Header, Aside, Main,Message,MessageBox,Button,Tooltip,Checkbox,CheckboxGroup,Popover,Loading} from 'element-ui'
import Vue from 'vue'

Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Button)
Vue.use(Tooltip)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Popover)
Vue.use(Loading)
// Vue.use(MessageBox)
// Vue.use(Message)
Vue.prototype.$message = Message

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt

