import Vue from 'vue'
import VueI18N from 'vue-i18n'
import cn from './cn'
import en from './en'
import storage from 'good-storage'

Vue.use(VueI18N)

const messages = {
    en,cn
}

let locale = storage.get('locale')
if(!locale){
    locale = 'cn'
}

const i18n = new VueI18N({
    locale,
    messages
})


export default i18n