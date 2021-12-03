import Vue from 'vue'
import Router from 'vue-router'


import Home from './views/Home.vue'
import Mint from './views/Mint.vue'
import Gallery from './views/Gallery.vue'
import NotFound from './views/NotFound.vue'


// Toadz Collection Tiles
import Collection from './views/Collection.vue'
import NftToken from './views/NftToken.vue'

import GalleryDetail from './views/components/GalleryDetail.vue'
import HolidayCargoForm from './views/components/HolidayCargoForm.vue'
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
      path: '/mint',
      name: 'mint',
      component: Mint
    } ,
    {
      path: '/gallery',
      name: 'gallery',
      component: Gallery,
    },
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
      path: '/holiday-cargo-form',
      name: 'holiday cargo form',
      component: HolidayCargoForm,
    },

    {
      path: '/gallery/:id',
      name: 'gallery detail',
      component: GalleryDetail,
    },



    {
      path: '/*',
      component: NotFound
    },
  ]
})
