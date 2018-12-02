import Vue from 'vue'

import Vuex from 'vuex'

import createLogger from "vuex/dist/logger"

import state from './state'

import * as getters from './getters'

import * as mutations from './mutations'


Vue.use(Vuex)

const debug = process.env.NODE_ENV !== "production"

export default new Vuex.Store({
    state,
    getters,
    mutations,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})