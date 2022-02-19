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


   <section class=" max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
       <div v-if="web3Plug.connectedToWeb3() == true" class="text-center mb-3">
           <h1 class="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-black-800 mt-0 pt-0 mb-3">
               Join the Whitelist!
           </h1>
           <!-- <input
           class="button bg-blue-100 text-sm font-medium sm:text-md text-gray-800 mb-2 py-3 px-0 rounded-xl rounded-r-none shadow-sm text-center no-underline border border-gray-400"
           ref="clone1"
           readonly
           :value="userAddressSliceMiddle()" />
           <input
           class="hidden"
           v-on:focus="$event.target.select()"
           ref="clone"
           readonly
           :value="userAddressString()" />
           <button @click="copy" class="button bg-white text-md  sm:text-md text-gray-700 my-2 py-2 px-4 rounded-xl rounded-l-none shadow-sm text-center no-underline border border-gray-400">
               <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="copy" class="svg-inline--fa fa-copy fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path></svg>
           </button> -->
       </div>


       <br>
       <br>



       <div v-show="web3Modal.active == true && returnHoldingsAmount > 0" class="text-center">
         <h2>Congratulations, claim your whitelist spot.</h2>
         <div class="text-center mx-auto m-6 mt-12">
               <a @click="sendWhitelistData()" class="button bg-green-400 hover:bg-green-300 hover:shadow-sm lg:text-3xl text-sm text-white font-bold my-2 py-3 px-8 rounded-xl shadow-md w-56 text-center no-underline cursor-pointer  mx-2">Claim (1)</a>
         </div>
       </div>

       <div v-show="web3Modal.active == true && returnHoldingsAmount == 0" class="text-center">
         <h2>To be legible for this Whitelist, you must own at least one of the following:</h2>
         <ul>
           <li>CrypToadz</li>
           <li>DystoPunks</li>
           <li>Cosmic Caps</li>
           <li>CryptoSkulls</li>
         </ul>
         <div class="text-center mx-auto m-6 mt-12">
               <a @click="sendWhitelistData()" class="button bg-green-400 hover:bg-green-300 hover:shadow-sm lg:text-3xl text-sm text-white font-bold my-2 py-3 px-8 rounded-xl shadow-md w-56 text-center no-underline cursor-pointer  mx-2">Claim (1)</a>
         </div>
       </div>

       <!-- If user is not logged in, prompt connect button -->
        <div v-show="web3Modal.active == false" class="text-center mb-3 py-10 ">
            <h1 class="font-bold text-3xl  font-heading text-black-800 mt-0 pt-0 mb-3">
                Join the Whitelist!
            </h1>
            <p>Connect your wallet with our available wallet providers.</p>
            <div class="text-center mx-auto m-6 mt-12">
                  <a @click="connectToWeb3" class="button bg-yellow-400 hover:bg-yellow-300 hover:shadow-sm lg:text-3xl text-lg text-black font-bold my-2 py-3 px-8 rounded-xl shadow-md w-56 text-center no-underline cursor-pointer  mx-2">Connect Wallet</a>
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

  data() {
    return {
      // web3Plug: new Web3Plug(),
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
  },

  computed: {

  },

  mixins: [web3Modal],

  methods: {


    connect() {
        this.$store.dispatch('connect')
    },



    async sendWhitelistData() {
      console.log('Whitelist')
       let uri = FrontendConfig.marketApiRoot +'/api/v1/apikey'

         let userAddress = this.web3Modal.account

           let inputQuery = Object.assign( { "publicAddress": this.userAddress, "whitelistAmount": whitelistAmount})
           console.log('input', this.userAddress, whitelistAmount)
           let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "save_whitelist_address", "input": inputQuery})
           let output = result.output[0]
           console.log('result.output', output,)

           if(output && output.tokenIds){
                this.resultsData = output
       }
    },


    async returnHoldingsAmount() {
      const cosmicCapAmount = fetechCosmicCapNFT()
      const cryptoToadzAmount = fetchToadzNFT()
      const dystoPunksAmount = fetchDystoNFT()
      const cryptoSkullsAmount = fetchSkullsNFT()

      let amount = sum(cosmicCapAmount, cryptoToadzAmount, dystopunks, cryptoSkullsAmount)
      return amount
    },

    fetchCosmicCapNFT() {
      console.log('fetching Cosmic Cap NFTs held by account')
      // Obtain API Endpoint
       let uri = FrontendConfig.marketApiRoot +'/api/v1/apikey'

       // Define contract address as nftContract
       let contractData = await this.web3Plug.getContractDataForActiveNetwork();
       let keyName = Object.keys(contractData);
       this.collectionName = keyName[0]
       let nftContract = contractData.cryptoadz.address

       let inputQuery = Object.assign( { "publicAddress": this.userAddress, "filterNFTcontracts": nftContract})
       console.log('input', this.userAddress, nftContract)
       let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "ERC721_balance_by_owner", "input": inputQuery})
       let output = result.output[0]
       console.log('result.output', output, )

       if(output && output.tokenIds){
            this.resultsData = output
            console.log('resultsData', this.resultsData.tokenIds)
            const amount = this.resultsData.tokenIds.length

      return amount

   }
    }



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
