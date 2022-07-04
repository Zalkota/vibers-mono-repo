import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import NotFound from './views/NotFound.vue'

import Collection from './views/Collection.vue'
import NftToken from './views/NftToken.vue'
import Profile from './views/Profile.vue'
import WhitelistForm from './views/WhitelistForm.vue'
import Transactions from './views/Transactions.vue'

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
      path: '/transactions/:contractAddress',
      name: 'transactions',
      component: Transactions,
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

// EXAMPLES ---------
// {
//   path: '/collection/:contractAddress',
//   name: 'collection',
//   component: Collection
// },

// {
//   path: '/collection/:contractAddress/:tokenId',
//   name: 'nftToken',
//   component: NftToken
// },
