import Vue from 'vue'
import VueI18N from 'vue-i18n'
import cn from './cn'
import en from './en'

Vue.use(VueI18N)

const messages = {
    en,cn
}

const i18n = new VueI18N({
    locale:'en',
    messages
})


export default i18n