import Vue from 'vue'
// import VueRouter from "vue-router";
import Router from 'vue-router'

Vue.use(Router)
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
};


export default new Router({
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'main',
            redirect: '/indexView',
            title: '首页',
            component: () => import('@/App'),
            children: [
                {
                    path: 'indexView',
                    name: 'IndexView',
                    title: '测试',
                    component: () => import('@/views/IndexView.vue')
                }
            ]
        },
        {
            path: "/addNewConnection",
            name: "AddNewConnection",
            component: () => import("../views/AddNewConnectionView.vue")
        },
        {
            path: "/editConnection",
            name: "EditNewConnection",
            component: () => import("../views/EditConnectionView.vue")
        }
    ]
})
