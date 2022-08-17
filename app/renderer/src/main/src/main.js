import Vue from 'vue'
import App from './App.vue'
import './style/Common.css'
import router from './router'
import store from './store'
// import ElementUI from 'element-ui'
import '@/util/VueComponment'
import 'element-ui/lib/theme-chalk/index.css'
import jquery from 'jquery'
// 导入Axios
import Axios from 'axios'
import VueAxios from 'vue-axios'
import "tailwindcss/tailwind.css"

import Contextmenu from "./components/functionalComponents/Contextmenu";
import Submenu from "./components/functionalComponents/Submenu";
import { COMPONENT_NAME } from "@/assets/js/constant";
import '@/common/css/element-ui-common.css'


Vue.config.productionTip = false
// Vue.use(ElementUI)
window.jquery = window.$ = jquery
// 携带Cookie
Axios.defaults.withCredentials = true
// 默认URL
// Axios.defaults.baseURL = 'https://www.anydevelop.cn';
Vue.use(VueAxios, Axios)
Vue.config.productionTip = false
// Vue.prototype.$echarts = echarts


const ContextmenuConstructor = Vue.extend(Contextmenu);
Vue.component(COMPONENT_NAME, Submenu);
function install(Vue) {
    let lastInstance = null;
    const ContextmenuProxy = function (options) {
        let instance = new ContextmenuConstructor();
        instance.items = options.items;
        instance.position.x = options.x || 0;
        instance.position.y = options.y || 0;
        if (options.event) {
            instance.position.x = options.event.clientX;
            instance.position.y = options.event.clientY;
        }
        instance.customClass = options.customClass;
        options.minWidth && (instance.style.minWidth = options.minWidth);
        options.zIndex && (instance.style.zIndex = options.zIndex);
        ContextmenuProxy.destroy();
        lastInstance = instance;
        instance.$mount();
    }
    ContextmenuProxy.destroy = function () {
        if (lastInstance) {
            lastInstance.$destroy();
            lastInstance = null;
        }
    }
    Vue.prototype.$contextmenu = ContextmenuProxy;
}
install(Vue)


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
