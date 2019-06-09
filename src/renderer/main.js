import Vue from 'vue'
import axios from 'axios'
import store from './store'

import './font-awesome-4.7.0/css/font-awesome.css'
import './base.css'

import {MessageBox,Col,Row} from 'element-ui'

Vue.prototype.$prompt = MessageBox.prompt;

Vue.use(Col)
Vue.use(Row)


import App from './App'
import MyHeader from './components/Header'
import MyVideo from './components/Video'
import MyFooter from './components/Footer'
import PlayList from './components/PlayList'
import MyProgress from './components/Progress'
import VideoProgress from './components/VideoProgress'
import ListItem from './components/ListItem'
import HistoryItem from './components/HistoryItem'
import About from './components/About'

Vue.component('MyHeader', MyHeader)
Vue.component('MyVideo', MyVideo)
Vue.component('MyFooter', MyFooter)
Vue.component('PlayList', PlayList)
Vue.component('MyProgress', MyProgress)
Vue.component('VideoProgress', VideoProgress)
Vue.component('ListItem', ListItem)
Vue.component('HistoryItem', HistoryItem)
Vue.component('About', About)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

import {ipcRenderer} from 'electron'
import storage from 'good-storage'

ipcRenderer.on('close',()=>{
    if(store.state.currentVideo){
        storage.set('state',Object.assign({},store.state,{currentVideo:{...store.state.currentVideo,currentTime:store.state.currentTime,speed:store.state.speed}}))
    }else{
        storage.set('state',store.state)
    }
})

new Vue({
    components: {App},
    template: '<App/>',
    store
}).$mount('#app')

