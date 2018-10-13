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

Vue.use(VModal)

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
  template: '<app/>',
  created () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$router.replace('/edit/')
      }
    })
  }
})
