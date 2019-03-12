import Vue from 'vue'
import axios from 'axios'
import store from './store'

import './font-awesome-4.7.0/css/font-awesome.css'
import './base.css'

import {MessageBox} from 'element-ui'

Vue.prototype.$prompt = MessageBox.prompt;


import App from './App'
import MyHeader from './components/Header'
import MyVideo from './components/Video'
import MyFooter from './components/Footer'
import PlayList from './components/PlayList'
import MyProgress from './components/Progress'
import VideoProgress from './components/VideoProgress'
import ListItem from './components/ListItem'

Vue.component('MyHeader', MyHeader)
Vue.component('MyVideo', MyVideo)
Vue.component('MyFooter', MyFooter)
Vue.component('PlayList', PlayList)
Vue.component('MyProgress', MyProgress)
Vue.component('VideoProgress', VideoProgress)
Vue.component('ListItem', ListItem)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
    components: {App},
    template: '<App/>',
    store
}).$mount('#app')
