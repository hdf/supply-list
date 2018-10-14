import Vue from 'vue'
import Router from 'vue-router'

import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import App from './App'
import reg from './components/reg'
import viewer from './components/viewer'
import edit from './components/edit'
import VModal from 'vue-js-modal'

import i18next from 'i18next'
import VueI18Next from '@panter/vue-i18next'

Vue.use(VModal)
Vue.use(VueI18Next)

const locales = {
  hu: {
    title: 'Ellátmány lista',
    details1: 'A felhasználó beírja, mire van szüksége, majd kilépéskor kap egy linket, amit megoszhat azzal aki beszerzi a cikket számára és kipipálja az elemet.',
    details2: 'Különféle statisztikák is generálódnak a vásárlás információk alapján.',
    bought: 'Megvéve',
    bought_amount: 'Vett mennyiség',
    cancel: 'Mégse',
    next_title: 'Legközelebb kell',
    often_title: 'Milyen gyakran kell',
    name_title: 'Tárgy',
    shop_title: 'Bolt',
    price_title: 'Ár',
    now: 'most',
    insufficient_data: 'nincs elég adat',
    logout: 'Kijelentkezés',
    add_new: 'Új elem hozzáadása',
    more: 'Több',
    delete: 'Törlés',
    request: 'Kérés',
    name: 'Név',
    add: 'Hozzáad'
  },
  en: {
    title: 'Supply list',
    details1: 'The user specifies what they need, and at logout, gets a link, that they can give to the person, that buys the thing for them, and than presses the checkmark on the item.',
    details2: 'Various statistics are generated based on buying information.',
    bought: 'Bought',
    bought_amount: 'Bought ammount',
    cancel: 'Cancel',
    next_title: 'Next needed',
    often_title: 'How often needed',
    name_title: 'Item',
    shop_title: 'Shop',
    price_title: 'Price',
    now: 'now',
    insufficient_data: 'not enough information',
    logout: 'Log out',
    add_new: 'Add new item',
    more: 'More',
    delete: 'Delete',
    request: 'Request',
    name: 'Name',
    add: 'Add'
  }
}

i18next.init({
  lng: navigator.language,
  fallbackLng: 'en',
  resources: {
    en: { translation: locales.en },
    hu: { translation: locales.hu }
  }
})
const i18n = new VueI18Next(i18next)

Vue.use(Router)
export const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'Reg',
      component: reg
    },
    {
      path: '/view/:user',
      name: 'View',
      component: viewer
    },
    {
      path: '/edit',
      name: 'Edit',
      component: edit,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

Vue.use(VueFire)
var config = {
  apiKey: 'AIzaSyAGRd9sEZ28k5SunvA470Ocbuq_lk0D3dw',
  authDomain: 'supply-list.firebaseapp.com',
  databaseURL: 'https://supply-list.firebaseio.com',
  projectId: 'supply-list',
  storageBucket: 'supply-list.appspot.com',
  messagingSenderId: '953476013076'
}
firebase.initializeApp(config)

export const db = firebase.firestore()
db.settings({timestampsInSnapshots: true})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  i18n: i18n,
  template: '<app/>',
  created () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$router.replace('/edit/')
      }
    })
  }
})
