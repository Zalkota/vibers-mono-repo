<template>

<div class="bg-one">
   <div class="section  bg-t px-0 lg:px-1">
     <div>
        <Navbar
       />
     </div>
   </div>

   <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 my-6">
       <div class="text-center container  rounded-md p-4 sm:px-4 py-4 mx-auto">
            <h1 class="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-black-800 mt-0 pt-0 mb-6">
            Page not Found!
            </h1>
            <!-- <p class="text-gray-600 text-sm">Whitelist spots are available for holders of the following NFTs:<br> CrypToadz, DystoPunks, Vibers, and CryptoSkulls.</p> -->
            <div class="text-center m-6 mt-12 no-underline">
                <router-link class="text-center mx-auto m-6 mt-12 no-underline" to="/">
                   <a class="button bg-four hover:shadow-md lg:text-3xl text-xl text-white font-bold my-2 py-3 px-8 rounded-xl shadow-sm w-56 text-center no-underline cursor-pointer mx-2">Go Home</a>
                </router-link>
            </div>
        </div>
    </section>

  <!-- <Footer/> -->

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js'


import Navbar from './components/Navbar.vue';

import Footer from './components/Footer.vue';

import BidPacketHelper from '../js/bidpacket-helper.js'





export default {
  name: 'NotFound',
  props: [],
  components: {Navbar, Footer},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      bidPacketData: {}
    }
  },
  created: function () {
    this.web3Plug.reconnectWeb()
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);

        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId

      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);

        this.web3error = errormessage

      }.bind(this));

      this.fetchPacketData(this.$route.params.signature)
  },
  methods: {

  }
}
</script>
