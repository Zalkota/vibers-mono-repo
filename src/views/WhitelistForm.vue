<template>

<div class="">
    <div class="bg-triangle-2">

       <div class="section">
         <div class=" ">
            <Navbar
           />
         </div>
       </div>

       <section class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-6 ">

           <div v-show="web3Modal.active == true && userWhitelisted" class="text-center container shadow-md bg-gray-800 rounded-lg mx-auto lg:mt-12 border-4 max-w-3xl" style="border-color: #A9ECE3;">
             <div class="bg-gray-900 font-bold text-lg md:text-xl lg:text-3xl font-heading color-six p-6 py-8 sm:px-6 lg:px-10 rounded-lg rounded-b-none">
                <h2 class="tracking-widest uppercase">Account Whitelisted</h2>
             </div>
             <div class="text-center container shadow-md bg-gray-900 text-gray-500 text-md rounded-lg rounded-t-none p-4 sm:px-8 py-8 mx-auto border-t border-gray-800">
                 <p class="text-xl text-gray-400 "><span class="font-thin text-lg">The release date of <span class="font-bold">Vibers</span> has not yet been released. <br><br>Join the vibe on Discord and enable notifications on our <a class="color-six no-underline" target="_blank" href="https://twitter.com/VibersNFT">twitter</a>!  <br> <br>   </span></p><br>
                 <div class=" mb-6">
                     <a href="https://discord.gg/a3bq9ZGdfZ" class="bg-six text-2xl color-four font-bold my-2 lg:py-4 lg:px-6 py-4 px-4 rounded cursor-pointer shadow-sm hover:shadow-md rounded-md w-full no-underline uppercase" >Join Discord!</a>
                 </div>
                 <br>
             </div>
           </div>

           <div v-show="web3Modal.active == true && userWhitelisted == false" class="text-center container shadow-md bg-gray-800 rounded-lg mx-auto lg:mt-12">
             <div class="bg-gray-900 font-bold text-lg md:text-xl lg:text-2xl font-heading text-white p-6 py-8 sm:px-6 lg:px-10 rounded-xl rounded-b-none">
                <h2 class="tracking-widest uppercase text-3xl color-six">Whitelist Signup</h2>
                <span class="text-gray-500 text-md">Mint Date: TBD</span>
             </div>
             <div class="shadow-md bg-gray-800 text-gray-300 text-xl mx-auto border-2 border-gray-900  rounded-xl">
                 <!-- <p>We are allowing only <span class="font-bold">1 whitelist spot per account</span> at this time.<br><br>
                 Thank you - BlockForge Team</p> -->
                 <div class="text-left flex lg:flex-row flex-col my-0 border-t lg:border-gray-800 border-gray-600 py-0  bg-gray-900 shadow-sm">

                     <div class="flex-1 lg:border-r lg:border-gray-800 border-gray-600 border-b px-10 py-8 lg:pt-10 lg:pb-4">
                         <span class="text-gray-600 font-thin">Holders of</span>
                         <h3 class="text-xl text-gray-300 font-bold tracking-widest uppercase" style="font-family: Russo One;">CryptoToadz & DystoPunks</h3>

                         <br>
                         <span class="text-gray-600 font-thin">Mint price:</span><span style="font-family: Russo One;"> 0.04 <span  style="font-family: sans-serif;">Ξ</span></span> <br><br>
                         <span class="text-gray-600 font-thin">Remaining:</span> <span style="font-family: Russo One;"> {{ OGWhitelistSpotsAvailable }}/{{ OGWhitelistSpotsTotal }}</span>
                         <div class="text-center mt-12">
                            <button v-if="NFTsOwned > 0" @click="sendWhitelistData(OGWhitelistType)" class="bg-six text-2xl color-four font-bold my-2 lg:py-4 lg:px-6 py-4 px-4 rounded cursor-pointer shadow-sm hover:shadow-md rounded-md w-full no-underline">REDEEM SPOT</button>
                            <button v-else-if="OGWhitelistSpotsAvailable == OGWhitelistSpotsTotal" class="button bg-gray-400  lg:text-3xl text-xl text-gray-800 font-bold my-2 py-3  px-6 xl:px-8 rounded-sm shadow-md w-56 text-center no-underline">FULL</button>
                            <button v-else class="button bg-gray-800 lg:text-xl text-xl text-gray-600 font-bold my-2 py-5 px-6 xl:px-8 rounded-lg w-full text-center no-underline">Requirement Not Met</button>
                         </div>
                     </div>

                     <!-- <div class="flex-1 px-10 py-8 lg:pt-10 lg:pb-4">
                         <span class="text-gray-600 text-md">All Users</span>
                         <h3 class="text-xl text-gray-300 font-bold tracking-widest uppercase" style="font-family: Russo One;">Public</h3>
                         <br>
                         <span class="text-gray-600 font-thin">Mint price:</span> <span style="font-family: Russo One;">  0.05 <span  style="font-family: sans-serif;">Ξ</span></span> <br><br>
                         <span class="text-gray-600 font-thin">Remaining:</span> <span style="font-family: Russo One;"> {{ publicWhitelistSpotsAvailable }}/{{ publicWhitelistSpotsTotal }}</span>
                         <div class="text-center mt-12">
                            <button v-if="publicWhitelistSpotsAvailable < publicWhitelistSpotsTotal" @click="sendWhitelistData(publicWhitelistType)" class="bg-six text-2xl color-four font-bold my-2 lg:py-4 lg:px-6 py-4 px-4 rounded cursor-pointer shadow-sm hover:shadow-md rounded-md w-full no-underline">REDEEM SPOT</button>
                            <button v-else-if="publicWhitelistSpotsAvailable == publicWhitelistSpotsTotal" class="button bg-gray-400  lg:text-3xl text-xl text-gray-800 font-bold my-2 py-3  px-6 xl:px-8 rounded-sm shadow-md w-56 text-center no-underline">FULL</button>
                            <button v-else class="button bg-gray-800 lg:text-xl text-xl text-gray-600 font-bold my-2 py-5 px-6 xl:px-8 rounded-lg w-full text-center no-underline">Requirement Not Met</button>
                         </div>
                     </div> -->

                 </div>
                 <div class="p-4 bg-gray-900 border-t lg:border-gray-800 border-gray-600 rounded-xl rounded-t-none">
                     <span class="text-gray-600 text-sm">We are allowing only 1 whitelist spot per account at this time.</span>
                 </div>

             </div>
           </div>




           <LogoutButton
           v-show="web3Modal.active == false"
            />

           <br>
       </section>
    </div>
</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js'
import web3utils from 'web3-utils'
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import LogoutButton from './components/LogoutButton.vue';

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
  name: 'WhitelistForm',
  props: [],
  components: {Navbar, Footer, Web3ModalVue, LogoutButton},
  watch: {
        // accountActive: {
        //     immediate: true,
        //     deep: true,
        //     // console.log('watcher', this.web3Modal.active)
        //
        // }

      // handler(newValue, oldValue) {
      //   this.returnHoldingsAmount()
      //   console.log('watcher', this.web3Modal.active)
      //
      // }
  },

  data() {
    return {
      web3Plug: new Web3Plug(),
      userAddress: null,
      whitelistAmount: 1,
      amount: 0,
      userWhitelisted: false,

      // cosmicWhitelistClaimed: false,
      // cosmicWhitelistType: 1,
      // cosmicNFTsOwned: 0,
      // cosmicWhitelistMintAmount: 1,
      // cosmicWhitelistSpotsAvailable: 0,
      // cosmicWhitelistSpotsTotal: 200,
      // cosmicContractAddress: '0xf3c9B7A97Eba579f5c234F79108331F5513c9741',

      OGWhitelistClaimed: false,
      OGWhitelistType: 2,
      OGTokensOwned: 0,
      OGWhitelistMintAmount: 1,
      OGWhitelistSpotsAvailable: 0,
      OGWhitelistSpotsTotal: 1000,

      NFTsOwned: 0,
      cryptoadzContractAddress: '0x1CB1A5e65610AEFF2551A50f76a87a7d3fB649C6',
      dystopunksContractAddress: '0xbEA8123277142dE42571f1fAc045225a1D347977',

      publicWhitelistClaimed: false,
      publicWhitelistType: 3,
      publicWhitelistSpotsAvailable: 0,
      publicWhitelistMintAmount: 1,
      publicWhitelistSpotsTotal: 4000,

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

  },

  mounted: function () {
      let suscribe = this.$store.subscribe((mutation, state) => {
      console.log(mutation.type)
      console.log(mutation.payload)
      if (mutation.type == 'setActive' && mutation.payload == true) {
          this.fetchNFTbyContract(this.cryptoadzContractAddress)
          this.fetchNFTbyContract(this.dystopunksContractAddress)
          this.checkWhitelistForAddress()
          suscribe()
      }
    })
  },

  computed: {


  },

  mixins: [web3Modal],

  methods: {


    connect() {
        this.$store.dispatch('connect')
    },

    disconnect() {
        this.$store.dispatch('resetApp')
    },



    async sendWhitelistData(type) {
        console.log('Whitelist')
         let uri = FrontendConfig.marketApiRoot +'/api/v1/apikey'
             let inputQuery = Object.assign( { "publicAddress": this.userAddress, "whitelistAmount": this.whitelistAmount, "whitelistType": type })
             console.log('input', this.userAddress, type)
             let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "save_whitelist_address", "input": inputQuery})
             let output = result
             console.log('sendWhitelistData', type, result)
             if(output.success){
                  this.userWhitelisted = true
              } else {
                  this.userWhitelisted = false
              }
    },

    async checkWhitelistForAddress() {
      console.log('Checking Whitelist..')
       let uri = FrontendConfig.marketApiRoot +'/api/v1/apikey'
           let inputQuery = Object.assign( { "publicAddress": this.userAddress})
           console.log('input', this.userAddress)
           let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "check_all_whitelists", "input": inputQuery})
           let output = result
           console.log('checkWhitelistForAddress', result)

           if(output.success){
                this.userWhitelisted = true
            } else {
                this.userWhitelisted = false
            }
    },



    async fetchNFTbyContract(contractAddress) {
      console.log('fetching NFTs held by account for', contractAddress)
      // Obtain API Endpoint
       let uri = FrontendConfig.marketApiRoot +'/api/v1/apikey'

       console.log('this.web3Modal.account', this.web3Modal.account)
       this.userAddress = this.web3Modal.account

       let inputQuery = Object.assign( { "publicAddress": this.userAddress, "filterNFTcontracts": contractAddress})
       console.log('input', this.userAddress, contractAddress)

       // Search of OG NFTs

           let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "ERC721_balance_by_owner", "input": inputQuery})
           let output = result.output[0]
           console.log('result.output', output, )

           if(output && output.tokenIds){
                this.NFTsOwned = output.tokenIds.length
                console.log('this.NFTsOwned', this.NFTsOwned)
           } else {
               console.log("No NFTs located for ", contractAddress)
           }

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
