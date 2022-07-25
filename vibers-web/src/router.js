import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import NotFound from './views/NotFound.vue'

import NftToken from './views/NftToken.vue'
import Profile from './views/Profile.vue'
import WhitelistForm from './views/WhitelistForm.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.PUBLIC_URL,
  routes: [

    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/allowlist',
      name: 'whitelistform',
      component: WhitelistForm,
    },
    {
        path: "*",
        component: NotFound
   }

  ]
})
