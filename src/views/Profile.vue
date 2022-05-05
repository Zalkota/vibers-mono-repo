<template>

<div>

   <div class="section px-0 lg:px-1">

     <div class=" ">
        <Navbar
        v-bind:web3Plug="web3Plug"
        v-bind:userAddress="userAddress"
       />
     </div>
   </div>

  <br>
  <br>
    <div class="px-2">
        <section v-if="web3Modal.active == true" class="text-white container shadow-md bg-gray-900 rounded-lg mx-auto border-2 border-gray-900 mx-12 lg:mt-12 mb-64 shadow-xl">
         <div class="bg-gray-900 rounded-sm p-4 sm:px-8 py-8 mx-auto  px-4 sm:px-6 lg:px-10 py-6">
             <div class="">
                 <div class="flex">
                     <div class="flex-initial ">
                                 <input
                                 class="bg-transparent font-bold text-xl md:text-2xl lg:text-3xl font-heading text-white w-48 mt-0 pt-0 mb-0"
                                 ref="clone1"
                                 readonly
                                 :value="userAddressSliceMiddle()">
                                 </input>
                                 <button @click="copy" class="button bg-transparent text-md  sm:text-md text-gray-500 my-1 py-2 px-4 rounded-sm rounded-l-none shadow-sm text-center no-underline">
                                     <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="copy" class="svg-inline--fa fa-copy fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path></svg>
                                 </button>
                         <h1 class="text-gray-500 text-sm mb-0 mt-0">Account</h1>
                     </div>
                     <div class="flex-1">

                     </div>
                     <div class="flex-initial">
                         <div class="">
                             <a v-show="web3Modal.active == true" @click="disconnect()" class=" cursor-pointer "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-12 icon-close-square"><rect width="18" height="18" x="3" y="3" class="fill-gray-800" rx="2"/><path class="fill-red-500" d="M13.41 12l2.83 2.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 1 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12z"/></svg></a>
                             <!-- <a v-show="web3Modal.active == true" @click="disconnect()" class="text-sm text-red-600 font-bold py-3 px-12 border-4 border-red-600 rounded-sm   text-center no-underline cursor-pointer  mx-2">Disconnect Wallet</a> -->
                         </div>
                     </div>
                 </div>
             </div>
         </div>


         <!-- Toggle Menu Start -->
       <div class="bg-gray-900 rounded-sm shadow-sm">
           <div class="flex flex-row my-6 px-10 py-4 border-t border-gray-800">
               <div class="flex-1">
                   <h3 class="font-medium leading-tight text-2xl mt-0 mb-">Your Vibers</h3>
               </div>
               <div class="flex-1">
               </div>
               <div class="flex-inital">
                   <a v-show="!toggleBattlePassBool" v-on:click="toggleBattlePass()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 mr-0 icon-add-square"><rect width="18" height="18" x="3" y="3" class="fill-gray-900" rx="2"/><path class="fill-white bg-gray-300 text-gray-300" d="M13 11h4a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4z"/></svg></a>
                   <a v-show="toggleBattlePassBool" v-on:click="toggleBattlePass()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 mr-0 icon-remove-square"><rect width="18" height="18" x="3" y="3" class="fill-gray-900" rx="2"/><rect width="12" height="2" x="6" y="11" class="fill-white" rx="1"/></svg></a>
               </div>
           </div>
           <div v-show="toggleBattlePassBool" class="mx-auto text-center px-12 pt-8 pb-16">
               <TiledTokenProfileBrowser
                 ref="TokenProfileBrowser"
                 v-bind:web3Plug="web3Plug"
                 v-bind:userAddress="userAddress"
               />
           </div>
       </div>
       <!-- Toggle Menu End -->

     </section>
    </div>


<section class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
<!-- If user is not logged in, prompt connect button -->
    <div v-show="web3Modal.active == false" class="text-center shadow-md  rounded-sm mx-auto border-2 border-gray-900 mt-12 mb-64">
      <div class="bg-four font-bold text-lg md:text-xl lg:text-2xl  text-white p-6 py-8 sm:px-6 lg:px-10">
         <h2 class="tracking-widest">Connect your wallet</h2>
         <p class=" text-gray-500 text-sm font-thin pt-2">Connect your wallet with the available wallet providers.</p>
      </div>
      <div class="text-center container shadow-md bg-four text-gray-500 text-sm rounded-sm rounded-t-none p-4 sm:px-8 py-8 mx-auto border-t border-gray-800">
          <div class="text-center mx-auto m-6 ">
              <button class="pushable my-6 lg:py-3 lg:px-6 sm:py-3 py-2 sm:px-6 px-3 mx-2 lg:mr-2 mr-0 sm:text-xl lg:text-2xl text-lg max-w-xs tracking-widest" v-on:click="connect()">
                <span class="front" style="font-family: Luckiest Guy">
                  Connect Wallet
                </span>
              </button>
          </div>
      </div>
    </div>
</section>
<!-- <div class="" v-if="signedInToWeb3 == true">

  <!-- <Footer/> -->

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js'
import web3utils from 'web3-utils'
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import TiledTokenProfileBrowser from './components/TiledTokenProfileBrowser.vue';
import StarflaskApiHelper from '../js/starflask-api-helper.js'

const FrontendConfig = require('../config/FrontendConfig.json')

// Web3Modal-Vue
const INFURA_ID = process.env.INFURA_ID
import Web3ModalVue from "web3modal-vue";
import web3ModalStore from "../store/modules/web3Modal.js";
import {web3Modal} from "../js/mixins.js";
//Wallets
import WalletConnectProvider from "@walletconnect/web3-provider";


export default {
  name: 'Profile',
  props: [],
  components: {Navbar, Footer, TiledTokenProfileBrowser, Web3ModalVue},

  data() {
    return {
      web3Plug: new Web3Plug(),
      signedInToWeb3: false,
      activePanelId: null,
      userAddress: null,
      //Toggle Menus
      toggleBattlePassBool: true,

      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: INFURA_ID,
          }
        }
      },

    }
  },

  created() {
    this.web3Plug.getPlugEventEmitter().on(
      "stateChanged",
      async function (connectionState) {
        console.log("stateChanged", connectionState);

        this.activeAccountAddress = connectionState.activeAccountAddress;
        this.activeNetworkId = connectionState.activeNetworkId;
        this.signedInToWeb3 = this.activeAccountAddress != null;

        // Addons
        this.CallProfileDetails()
      }.bind(this)
    );
    this.web3Plug.getPlugEventEmitter().on(
      "error",
      function (errormessage) {
        console.error("error", errormessage);

        this.web3error = errormessage;
      }.bind(this)
    );

    this.web3Plug.reconnectWeb();
  },

  mounted: function () {
    this.CallProfileDetails()
  },

  computed: {

  },

  mixins: [web3Modal],

  methods: {


      toggleBattlePass () {
          this.toggleBattlePassBool = !this.toggleBattlePassBool
      },

      disconnect() {
          this.$store.dispatch('resetApp')
      },


      userAddressSliceMiddle(){
          if (this.userAddress !== null) {
              let sliceFirstHalf = this.userAddress.slice(0, 5)
              let sliceSecondtHalf = this.userAddress.slice(38)
              let result = sliceFirstHalf + "..." + sliceSecondtHalf
              return result
          }
      },

      userAddressString(){
          if (this.userAddress !== null) {
              let result = this.userAddress
              return result
          }
      },

      connectToWeb3(){
        this.web3Plug.connectWeb3( )
      },

      // disconnect() {
      //     this.$store.dispatch('resetApp')
      // },


      copy() {
        this.$refs.clone.focus();
        document.execCommand('copy');
      },


      async CallProfileDetails(){
        console.log("CallProfileDetails");
        try {
            this.userAddress = this.web3Plug.getActiveAccountAddress();
            this.userAddress = web3utils.toChecksumAddress(this.userAddress)
        }
        catch(err) {
          console.log('error: CallProfileDetails')
        }
        console.log("userAddress:" + this.userAddress);
      },


  }
}
</script>
