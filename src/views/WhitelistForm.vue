<template>

<div>

   <div class="section px-0 lg:px-1">

     <div class=" ">
        <Navbar
       />
     </div>
   </div>


   <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6">

       <br>
       <br>

        <div v-show="web3Modal.active == true && this.amount > 0" class="text-center container shadow-md bg-white rounded-md p-4 sm:px-4 py-4 mx-auto border-4 border-green-400">
            <h1 class="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-black-800 mt-0 pt-0 mb-6">
            Join the Whitelist!

            </h1>
            <h2 class="font-bold">Congratulations, claim your whitelist spot.</h2>
            <p class="text-gray-600 text-sm">Whitelist spots are available for holders of the following NFTs:<br> CrypToadz, DystoPunks, Cosmic Caps, and CryptoSkulls.</p>
            <div class="text-center mx-auto m-6 mt-12">
               <a @click="sendWhitelistData()" class="button bg-green-400 hover:bg-green-300 hover:shadow-sm lg:text-3xl text-xl text-white font-bold my-2 py-3 px-8 rounded-xl shadow-md w-56 text-center no-underline cursor-pointer  mx-2">Claim ( {{ amount }} )</a>
            </div>
        </div>

       <div v-show="web3Modal.active == true && amount == 0" class="text-center container shadow-md bg-white rounded-md p-4 sm:px-4 py-4 mx-auto border-4 border-red-400">
         <h2 class="font-bold text-lg md:text-xl lg:text-xl font-heading text-black-800 mt-0 pt-0 mb-6">Whitelist spots are available for holders of the following NFTs:</h2>
         <ul>
           <li>CrypToadz</li>
           <li>DystoPunks</li>
           <li>Cosmic Caps</li>
           <li>CryptoSkulls</li>
         </ul>
         <br>
         <p class="text-gray-600 text-sm">The connected wallet does not contain any. <br> Please disconnect your wallet and connect one that does.</p>
         <div class="text-center mx-auto m-6 mt-12">
               <a @click="disconnect()" class="button bg-red-500 hover:bg-red-300 hover:shadow-sm lg:text-3xl text-lg text-black font-bold my-2 py-3 px-8 rounded-xl shadow-md w-56 text-center no-underline cursor-pointer  mx-2">Disconnect Wallet</a>
         </div>
       </div>

       <!-- If user is not logged in, prompt connect button -->
        <div v-show="web3Modal.active == false" class="text-center mb-3 py-10 ">
            <h1 class="font-bold text-3xl  font-heading text-black-800 mt-0 pt-0 mb-3">
                Join the Whitelist!
            </h1>
            <p>Connect your wallet with our available wallet providers.</p>
            <div class="text-center mx-auto m-6 mt-12">
                  <a @click="connect()" class="button bg-yellow-400 hover:bg-yellow-300 hover:shadow-sm lg:text-3xl text-lg text-black font-bold my-2 py-3 px-8 rounded-xl shadow-md w-56 text-center no-underline cursor-pointer  mx-2">Connect Wallet</a>
            </div>
        </div>
       <!-- <div class="" v-if="signedInToWeb3 == true">
           <TiledTokenProfileBrowser
             ref="TokenProfileBrowser"
             v-bind:web3Plug="web3Plug"
             v-bind:userAddress="userAddress"
           />
       </div> -->

       <br>
   </section>

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
  name: 'WhitelistForm',
  props: [],
  components: {Navbar, Footer, Web3ModalVue},
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
          this.fetchCosmicCapNFT()
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



    async sendWhitelistData() {
      console.log('Whitelist')
       let uri = FrontendConfig.marketApiRoot +'/api/v1/apikey'



           let inputQuery = Object.assign( { "publicAddress": this.userAddress, "whitelistAmount": whitelistAmount})
           console.log('input', this.userAddress, whitelistAmount)
           let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "save_whitelist_address", "input": inputQuery})
           let output = result.output[0]
           console.log('result.output', output,)

           if(output && output.tokenIds){
                this.resultsData = output
       }
    },



    async fetchCosmicCapNFT() {
      console.log('fetching Cosmic Cap NFTs held by account')
      // Obtain API Endpoint
       let uri = FrontendConfig.marketApiRoot +'/api/v1/apikey'

       console.log('this.web3Modal.account', this.web3Modal.account)
       this.userAddress = this.web3Modal.account

       // Define contract address as nftContract
       let contractData = await this.web3Plug.getContractDataForActiveNetwork();
       let keyName = Object.keys(contractData);
       this.collectionName = keyName[0]
       let nftContract = contractData.cosmiccaps_dev.address

       let inputQuery = Object.assign( { "publicAddress": this.userAddress, "filterNFTcontracts": nftContract})
       console.log('input', this.userAddress, nftContract)
       let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "ERC721_balance_by_owner", "input": inputQuery})
       let output = result.output[0]
       console.log('result.output', output, )

       if(output && output.tokenIds){
            this.resultsData = output
            console.log('resultsData', this.resultsData.tokenIds)
            this.amount = this.resultsData.tokenIds.length
            console.log(this.amount)


       }
    },


    async returnHoldingsAmount() {
      const cosmicCapAmount = this.fetchCosmicCapNFT()
      // const cryptoToadzAmount = fetchToadzNFT()
      // const dystoPunksAmount = fetchDystoNFT()
      // const cryptoSkullsAmount = fetchSkullsNFT()

      // let amount = sum(cosmicCapAmount, cryptoToadzAmount, dystopunks, cryptoSkullsAmount)
      // return amount
      return cosmicCapAmount
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
