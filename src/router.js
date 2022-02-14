import Vue from 'vue'
import Router from 'vue-router'


import Home from './views/Home.vue'
import Gallery from './views/Gallery.vue'


// Toadz Collection Tiles
import Collection from './views/Collection.vue'
import NftToken from './views/NftToken.vue'
import Profile from './views/Profile.vue'
import GalleryDetail from './views/components/GalleryDetail.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.PUBLIC_URL,
  routes: [

    {
      path: '/',
      name: 'home',
      component: Home
    } ,
    {
      path: '/collection/:contractAddress',
      name: 'collection',
      component: Collection
    },

    {
      path: '/collection/:contractAddress/:tokenId',
      name: 'nftToken',
      component: NftToken
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },

  ]
})
