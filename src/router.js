import Vue from 'vue'
import Router from 'vue-router'


import Home from './views/Home.vue'
import Mint from './views/Mint.vue'
import Gallery from './views/Gallery.vue'



// tutorial
// import EventCreate from './views/EventCreate.vue'
// import EventList from './views/EventList.vue'
// import EventShow from './views/EventShow.vue'


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
      path: '/gallery/:id',
      name: 'gallery detail',
      component: GalleryDetail,
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
      path: '/profile',
      name: 'profile',
      component: Profile,
    },

    // {
    //   path: '/holiday-order-form',
    //   name: 'holiday cargo form',
    //   component: HolidayOrderForm,
    // },




// tutorial
  //   {
  //     path: '/event-list',
  //     name: 'event-list',
  //     component: EventList
  //   },
  //   {
  //     path: '/event/:id',
  //     name: 'event-show',
  //     component: EventShow,
  //     props: true
  //   },
  //   {
  //     path: '/event/create',
  //     name: 'event-create',
  //     component: EventCreate
  // },





    // not found??
    // {
    //   path: '/*',
    //   component: NotFound
    // },
  ]
})
