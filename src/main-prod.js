import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import './plugins/element.js'

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

//引入全局样式表
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'

//导入NProgress对应的js和css
import NProgress from 'nprogress' // 引入nprogress插件

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//在request拦截器中展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
    // console.log(config);
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
//在response拦截器中隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
    NProgress.done()
    return config
})

Vue.prototype.$http = axios


Vue.config.productionTip = false

Vue.component('tree-table', ZkTable)

//将富文本注册全局
Vue.use(VueQuillEditor, /* { default global options } */ )

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')