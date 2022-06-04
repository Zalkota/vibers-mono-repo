<template>

<div class="">
    <div class="bg-triangle-2">

       <div class="section">
         <div class=" ">
            <Navbar
           />
         </div>
       </div>

       <section>
           <ConnectWalletButton v-if="web3Modal.active != true && showSpinner == false" />
       </section>

       <Loading
       v-show="showSpinner == true"
       />

       <NetworkError
       v-show="networkError == true"
       />

       <section class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-6 ">

           <ConnectWalletButton v-if="web3Modal.active != true && showSpinner == false" />

           <SignInButton v-if="web3Modal.active == true && authToken == null && showSpinner == false"
           :userAddress = "userAddress"
           @authTokenEvent = "readAuthTokenEvent"
           />

           <WhitelistMint
           v-if="web3Modal.active == true && authToken != null && userWhitelisted == true && whitelistSaleStatus == true && showSpinner == false"
           :authToken = "authToken"
           :whitelistSaleStatus = "whitelistSaleStatus"
           />

           <!-- === LOADING SECTION === -->



           <!-- === NETWORK ERROR SECTION === -->



           <div v-show="web3Modal.active == true && userWhitelisted && authToken != null && whitelistSaleStatus == false && showSpinner == false" class="text-center container shadow-md bg-gray-800 rounded-lg mx-auto lg:mt-12 border-4 max-w-3xl" style="border-color: #A9ECE3;">
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

           <div v-show="web3Modal.active == true && userWhitelisted == false && authToken != null && whitelistSaleStatus == true && showSpinner == false" class="text-center container shadow-md bg-gray-800 rounded-lg mx-auto lg:mt-12 border-4 max-w-3xl" style="border-color: #A9ECE3;">
             <div class="bg-gray-900 font-bold text-lg md:text-xl lg:text-3xl font-heading color-six p-6 py-8 sm:px-6 lg:px-10 rounded-lg rounded-b-none">
                <h2 class="tracking-widest uppercase">Account Not Allowlisted</h2>
             </div>
             <div class="text-center container shadow-md bg-gray-900 text-gray-500 text-md rounded-lg rounded-t-none p-4 sm:px-8 py-8 mx-auto border-t border-gray-800">
                 <p class="text-xl text-gray-400 "><span class="font-thin text-lg">Sorry, <span class="color-three font-medium">{{ userAddressSliceMiddle() }}</span> is not on the allowlist. Either switch to an allowlisted account or particpate in the
                     public mint. !vibe<br></span>
                 </p><br><br>
                 <div class=" mb-6">
                     <a href="https://vibers.io" class="bg-six text-2xl color-four font-bold my-2 lg:py-4 lg:px-6 py-4 px-4 rounded cursor-pointer shadow-sm hover:shadow-md rounded-md w-full no-underline uppercase" >Public Mint</a>
                 </div>
                 <br>
             </div>
             <div v-if="web3Modal.active == true" class="bg-gray-800 p-6 text-gray-500 font-thin flex">
                     <div class="flex-initial">
                         {{ userAddressSliceMiddle() }} Connected
                     </div>
                     <div class="flex-1 text-right">
                         <button v-on:click="disconnect()" class="no-underline font-bold text-red-500 font-medium ml-4 uppercase tracking-wider"> Disconnect Wallet </button>
                     </div>
             </div>

             <div v-if="web3Modal.active == false" class="bg-gray-800 p-4 text-gray-500 font-thin flex ">
                     <div class="flex-initial pt-3 lg:pt-2 ml-2 hide">
                         No Wallet Detected
                     </div>
                     <div class="lg:flex-1 text-right md:w-36 hide">
                         <button v-on:click="connect()" class="no-underline w-36 font-bold text-yellow-500 font-medium lg:ml-4  px-4 py-2 uppercase tracking-wider"> Connect Wallet </button>
                     </div>
                     <div class="lg:flex-1 text-right w-full unhide">
                         <button v-on:click="connect()" class="no-underline w-full font-bold  text-yellow-500 font-medium lg:ml-4  px-4 py-2 uppercase tracking-wider"> Connect Wallet </button>
                     </div>
             </div>
           </div>


           <div v-show="userWhitelisted == false && authToken != null && whitelistSaleStatus == false && showSpinner == false" class="text-center container shadow-md bg-gray-800 rounded-lg max-w-2xl mx-auto lg:mt-12">
             <div class="bg-gray-900 font-bold text-lg md:text-xl lg:text-2xl font-heading text-white p-6 py-8 sm:px-6 lg:px-10 rounded-xl rounded-b-none">
                <h2 class="tracking-widest uppercase text-3xl color-six">Whitelist Signup</h2>
                <span class="text-gray-500 text-md">Mint Date: TBD</span>
             </div>
             <div class="shadow-md bg-gray-800 text-gray-300 text-xl mx-auto border-2 border-gray-900  rounded-xl">
                 <!-- <p>We are allowing only <span class="font-bold">1 whitelist spot per account</span> at this time.<br><br>
                 Thank you - BlockForge Team</p> -->
                 <div class="text-left flex lg:flex-row flex-col my-0 border-t lg:border-gray-800 border-gray-600 py-0  bg-gray-900 shadow-sm">

                     <div class="flex-1 lg:border-r lg:border-gray-800 border-gray-600 border-b px-10 py-8 lg:pt-10 lg:pb-4">
                         <span class="text-gray-600 font-thin">Allowlist Available for holders of:</span>
                         <h3 class="text-xl text-gray-300 font-bold tracking-widest uppercase" style="font-family: Prompt;">CryptoToadz, DystoPunks, Doodles, CryptoSkulls, CryptoRayRays, Bonies, CryptoVans.</h3>

                         <br>
                         <span class="text-gray-600 font-thin">Total Spots:</span> <span style="font-family: Russo One;"> {{ OGWhitelistSpotsTotal }}</span>
                         <br>
                         <br>
                         <div v-if="web3Modal.active == true" class="text-center ">
                            <button v-if="userQualified" @click="sendWhitelistData()" class="bg-six text-2xl color-four font-bold my-2 lg:py-4 lg:px-6 py-4 px-4 rounded cursor-pointer shadow-sm hover:shadow-md rounded-md w-full no-underline">REDEEM SPOT</button>
                            <button v-else-if="OGWhitelistSpotsAvailable == OGWhitelistSpotsTotal" class="button bg-gray-400  lg:text-3xl text-xl text-gray-800 font-bold my-2 py-3  px-6 xl:px-8 rounded-sm shadow-md w-56 text-center no-underline">FULL</button>
                            <button v-else class="button bg-gray-800 lg:text-xl text-xl text-gray-600 font-bold my-2 py-5 px-6 xl:px-8 rounded-lg w-full text-center no-underline">Requirement Not Met</button>
                         </div>
                     </div>

                 </div>
                 <div class="p-4 bg-gray-900 border-t lg:border-gray-800 border-gray-600 rounded-xl rounded-t-none">
                     <span class="text-gray-600 text-sm">We are allowing only 1 allowlist spot per account.</span>
                 </div>

             </div>
             <div v-if="web3Modal.active == true" class="bg-gray-800 p-6 text-gray-500 font-thin flex">
                     <div class="flex-initial">
                         {{ userAddressSliceMiddle() }} Connected
                     </div>
                     <div class="flex-1 text-right">
                         <button v-on:click="disconnect()" class="no-underline font-bold text-red-500 font-medium ml-4 uppercase tracking-wider"> Disconnect Wallet </button>
                     </div>
             </div>

             <div v-if="web3Modal.active == false" class="bg-gray-800 p-4 text-gray-500 font-thin flex ">
                     <div class="flex-initial pt-3 lg:pt-2 ml-2 hide">
                         No Wallet Detected
                     </div>
                     <div class="lg:flex-1 text-right md:w-36 hide">
                         <button v-on:click="connect()" class="no-underline w-36 font-bold text-yellow-500 font-medium lg:ml-4  px-4 py-2 uppercase tracking-wider"> Connect Wallet </button>
                     </div>
                     <div class="lg:flex-1 text-right w-full unhide">
                         <button v-on:click="connect()" class="no-underline w-full font-bold  text-yellow-500 font-medium lg:ml-4  px-4 py-2 uppercase tracking-wider"> Connect Wallet </button>
                     </div>
             </div>
           </div>

           <!-- === QUESTION  SECTION === -->

            <!-- <div v-show="web3Modal.active == true && userWhitelisted == false" class="container text-left my-10 py-0 rounded-lg shadow-sm" style="max-width: 1022px">
                <div class="lg:flex shrink-0 bg-gray-900 px-10 pt-16 pb-20 lg:py-10 border-b border-gray-800 rounded-t-lg">
                    <div class="flex-1">
                        <h3 class="text-xl text-gray-300 font-bold tracking-widest uppercase" style="font-family: Prompt;">Questions</h3>
                        <p class="text-xs text-gray-600">
                            Here is a list of commonly asked questions related to the BlockForge Battle Pass NFT Mint.
                        </p>
                    </div>

                </div>
                <div class=" shrink-0 bg-gray-900 px-10 pt-10 pb-8 lg:py-10 ">
                    <h4 class="text-md text-gray-300 mb-2 font-bold" style="font-family: Prompt;">Is it is safe to register to this Allowlist?</h4>
                    <p class="text-sm font-thin text-gray-200 bg-gray-800 p-4">
                        We do not record any personal information and do not require any signatures from your web3 wallet.
                    </p>
                </div>

                <div class=" shrink-0 bg-gray-900 px-10 pt-2 pb-8 lg:pt-2 lg:pb-10">
                    <h4 class="text-md text-gray-300 mb-2 font-bold" style="font-family: Prompt;">When will the mint occur?</h4>
                    <p class="text-sm font-thin text-gray-200 bg-gray-800 p-4">
                        The release date of the Battle Pass NFT has not yet been announced. Follow us on twitter and join the Discord to stay up to date.
                    </p>
                </div>

                <div class=" shrink-0 bg-gray-900 px-10 pt-2 pb-8 lg:pt-2 lg:pb-10 rounded-b-lg">
                    <h4 class="text-md text-gray-300 mb-2 font-bold" style="font-family: Prompt;">Is it is safe to register to this Allowlist?</h4>
                    <p class="text-sm font-thin text-gray-200 bg-gray-800 p-4">
                        The BlockForge Battle Pass NFT is an ERC721 Token that will be distributed via a public mint. Each Battle Pass NFT is unique, in that it will have a unique number on the front and a unique Minecraft skin on the back.
                    </p>
                </div>
            </div> -->

<!--
           <LogoutButton
           v-show="web3Modal.active == false"
            /> -->

           <br>
       </section>
    </div>
</div>
</template>


<script>


import NetworkError from './components/NetworkError.vue';
import Loading from './components/Loading.vue';
import ConnectWalletButton from "./components/ConnectWalletButton.vue";
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import WhitelistMint from './components/WhitelistMint.vue';
import TiledTokenProfileBrowser from './components/TiledTokenProfileBrowser.vue';
import SignInButton from "./components/SignInButton.vue";

import Web3Plug from '../js/web3-plug.js'
import web3utils from 'web3-utils'

import StarflaskApiHelper from '../js/starflask-api-helper.js'

// Web3Modal-Vue
const INFURA_ID = process.env.INFURA_ID
import Web3ModalVue from "web3modal-vue";
import web3ModalStore from "../store/modules/web3Modal.js";
import {web3Modal} from "../js/mixins.js";
//Wallets
import WalletConnectProvider from "@walletconnect/web3-provider";
import {resolveRoutedApiQuery} from '../js/rest-api-helper.ts'

import FrontendHelper from "../js/frontend-helper.js";
const ERC721ABI = require("../contracts/ERC721ABI.json");


export default {
  name: 'WhitelistForm',
  props: [],
  components: {Navbar, Footer, Web3ModalVue, SignInButton, WhitelistMint, ConnectWalletButton, NetworkError, Loading},
  watch: {

  },

  data() {
    return {
      endDate: new Date(2022, 4, 1, 10, 10, 10, 10),
      web3Plug: new Web3Plug(),
      userAddress: null,
      whitelistAmount: 1,
      amount: 0,
      userWhitelisted: false,
      authToken: null,
      userQualified: false,
      whitelistSaleStatus: false,
      nftContract: [],
      contractAddress: null,


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

      showSpinner: false,
      networkError: false,


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
      this.authToken = window.$cookies.get("authToken", this.authToken)
      console.log("authtoken from cookies", this.authToken)
  },

  mounted: function () {
      this.getwhitelistSaleStatus()
      let subscribe = this.$store.subscribe((mutation, state) => {
      console.log(mutation.type)
      console.log(mutation.payload)
      if (mutation.type == 'setActive' && mutation.payload == true) {
          this.userAddress = this.web3Modal.account
          this.getERC721Balance()
          // this.fetchNFTbyContract(this.dystopunksContractAddress)
          this.checkWhitelistForAddress()
          this.getTotalSupply();
          subscribe()
      }

      if (mutation.type == 'setAuthToken' && mutation.payload != null) {
            this.authToken = this.$store.authToken
            console.log('Auth Token Updated')
            subscribe()
      }
    })
  },

  computed: {


  },

  mixins: [web3Modal],

  methods: {

    readAuthTokenEvent(payload) {
        this.authToken = payload.authToken
    },


    connect() {
        this.$store.dispatch('connect')
    },

    disconnect() {
        this.$store.dispatch('resetApp')
    },

    async getTotalSupply() {
        if (this.web3Modal.active) {
            const contractData = await this.web3Plug.getContractDataForActiveNetwork();
            this.activeNetwork = contractData
            this.contractAddress = contractData.vibers.address
            let contractAddress = this.contractAddress
            const abi = ERC721ABI
            this.$store.commit('setContract', {abi, contractAddress})
            this.nftContract = await this.web3Modal.contract
            console.log('nftContract call', this.nftContract)
            this.totalSupply = await this.nftContract.totalSupply();
            this.$forceUpdate();
        }
        this.getwhitelistSaleStatus()
    },

    async getwhitelistSaleStatus() {
        const now = new Date();
        if (this.web3Modal.active) {
            this.whitelistSaleStatus = await this.nftContract.hasSaleStarted();
            console.log('getwhitelistSaleStatus:', this.whitelistSaleStatus)
        } else if (this.endDate > now.getTime()) {
                this.whitelistSaleStatus = false
                console.log('getwhitelistSaleStatus: sale is in the future')
        } else if (this.endDate <= now.getTime()) {
                this.whitelistSaleStatus = true
                console.log('getwhitelistSaleStatus: Sale started in the past')
        }
    },


    async sendWhitelistData() {
        let publicAddress = this.userAddress
        let authToken = this.authToken
        let allowlistAmount = 1
        let allowlistType = 1
        try {
            this.showSpinner = true

            let sendWhitelistData = await resolveRoutedApiQuery('saveAllowListAddress', {publicAddress: publicAddress, authToken: authToken, allowlistAmount:allowlistAmount, allowlistType: allowlistType } )

            if(sendWhitelistData.success){
              this.userWhitelisted = true
            } else {
              this.userWhitelisted = false
            }
        } catch (err) {
            console.error(err);
            // show error message
            this.networkError = true
        } finally {
            // hide spinner
            this.showSpinner = false
        }
    },

    async checkWhitelistForAddress() {

        try {
            this.showSpinner = true
            let result = await resolveRoutedApiQuery('checkAllAllowLists', {publicAddress: this.userAddress} )
            console.log('checkWhitelistForAddress', result)
            if(result.success){
                 this.userWhitelisted = true
             } else {
                 this.userWhitelisted = false
             }
        } catch (err) {
            console.error(err);
            // show error message
            this.networkError = true
        } finally {
            // hide spinner
            this.showSpinner = false
        }
    },


    async getERC721Balance() {
       this.userAddress = this.web3Modal.account
       console.log('fetching NFTs held by ', this.web3Modal.account)

       try {
           this.showSpinner = true
           let result = await resolveRoutedApiQuery('ERC721BalanceByOwner', { "publicAddress": this.userAddress })
           console.log('fetchNFTbyContract', result.data, )

           if(result.data.success && result.data.data.length > 0){
                this.userQualified = true
                console.log('user qualified for allowlist', this.userQualified)
           } else {
               console.log("user NOT qualified for allowlist",  this.userQualified)
           }

       } catch (err) {
           console.error(err);
           // show error message
           this.networkError = true
       } finally {
           // hide spinner
           this.showSpinner = false
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
