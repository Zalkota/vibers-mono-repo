<template>

<div>

   <div class="section  bg-white border-b border-gray-300 px-0 lg:px-1">

     <div class=" ">
        <Navbar
        v-bind:web3Plug="web3Plug"
       />
     </div>


   </div>

   <div>
   <div class="container mt-6 mx-auto flex flex-col sm:flex-row">
     <div class="flex-auto  m-6">
         <img class="object-center object-cover h-auto rounded-md " v-bind:src="getImageURL()" alt="Cosmic Cap NFT">
     </div>




    <div class="flex-auto  py-8 px-12 pb-0 m-6 bg-white rounded-md border border-gray-300">

        <router-link  :to="getProjectURL()" class="no-underline" >
            <h4 class="text-md text-blue-600 font-bold"> Cosmic Caps </h4>
        </router-link>

        <h1 class="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900 mt-0 mb-1">
            #{{ this.nftTokenId }}
        </h1>

        <hr>

        <!-- <div class="py-2" v-if="ownedByLocalUser()">
             <div v-if="bestSellOrder " class='my-2'>
                 <div class="p-2 border-2 border-black inline-block rounded bg-blue-500 text-white hover:bg-blue-400  select-none"  > For Sale: {{ getBuyoutPrice() }} ETH </div>
              </div>
               <div v-if="bestSellOrder " class='my-2'>
                   <div class=" p-1 border-2 border-black cursor-pointer inline-block rounded bg-red-500 text-white hover:bg-red-400  select-none" @click="cancelBuyout( bestSellOrder )"  > Cancel </div>
                   <div class="mx-2 p-2 border-2 border-black inline cursor-pointer rounded hover:bg-purple-200 select-none" @click="interactionMode='lowerPrice'"> Lower Price </div>
              </div>
              <div v-if="!bestSellOrder " class='my-2'>
                  <div class="p-2 border-2 border-black inline cursor-pointer rounded hover:bg-purple-200 select-none" @click="interactionMode='makeSellOrder'"> Sell This Item </div>
             </div>
         </div>

         <div class="py-2" v-if="!ownedByLocalUser()">
             <div v-if="bestSellOrder && getBuyoutPrice()" class='my-2'>
                 <div class="p-2 border-2 border-black inline-block cursor-pointer rounded bg-blue-500 text-white hover:bg-blue-400  select-none"  @click="buyoutNow"> Buyout For {{ getBuyoutPrice() }} ETH </div>
             </div>
             <div class="p-2 my-2 border-2 border-black inline-block cursor-pointer rounded hover:bg-purple-200  select-none"  @click="interactionMode='makeBuyOrder'"> Bid For This Item </div>
         </div> -->

        <div class="p-2">
            <div class="inline">
              <span class="text-sm">Owned By <router-link  :to="'/account/'+tokenOwnerAddress"  >  {{getOwnerAddress()}}  {{tokenOwnerAddress}}  </router-link></span>
            </div>
            <div class="mt-2 py-2">
                <h2 class="text-gray-800 font-bold">Description</h2>
            </div>
            <div class="py-2">
                <p class="text-gray-800 text-sm">Cosmic Caps are a Non-Fungible Token (NFT) species of 10,000 unique fungi. These adventurous mushrooms are exploring their way from the shroomiverse to the metaverse!</p>
            </div>
        </div>

        <div class="">
            <div class="p-2">
                <h2 class="text-gray-800 font-bold">Properties</h2>
            </div>
            <div class="flex flex-wrap">
                <div v-for="trait in nftTraitsArray" v-bind:key="trait.trait_type"  class="bg-blue-100 px-4 py-2 border-blue-300  border-2 rounded-md text-center no-underline m-2">
                    <router-link  :to="getProjectURL()" class="no-underline" >
                    <span class="text-sm font-medium text-gray-700"> {{ trait.trait_type }}</span> <br>
                    <span class="font-bold text-gray-800">{{ trait.value }}</span>
                    </router-link>
                </div>
            </div>
        </div>
        </div>
    </div>

   <div class="container mt-6 mx-auto">


   </div>

   <div class="text-center mx-auto m-6 ">
         <a v-bind:href="'https://opensea.io/assets/0xf3c9b7a97eba579f5c234f79108331f5513c9741/' + this.id" class="button bg-blue-600 text-3xl text-white font-bold my-2 py-3 px-6 rounded-xl shadow-md w-56 text-center no-underline  mx-2" >Buy on Opensea</a>
         <a class="button bg-blue-600 text-3xl text-white font-bold my-2 py-3 px-6 mx-2 rounded-xl shadow-md w-56 text-center no-underline " v-bind:href="getCollectionExplorerURL()">
             View On Etherscan
         </a>
   </div>

   <div class="mb-24">

   </div>

   </div>






   <!-- <div class="section  bg-white border-b-2 border-black">
     <div class="autospacing container flex margin-center">
       <div class="w-column w-1/2">
            <OffersList
            ref="OffersList"
            v-bind:web3Plug="web3Plug"
            v-bind:nftContractAddress="nftContractAddress"
            v-bind:nftTokenId="nftTokenId"
            v-bind:tokenOwnerAddress="tokenOwnerAddress"
            v-bind:activeAccountAddress="activeAccountAddress"
            />

       </div>
         <div class="w-column w-1/2 m-4 p-4 bg-gray-200 rounded" v-if="interactionMode=='makeSellOrder' || interactionMode=='lowerPrice' || interactionMode=='makeBuyOrder'">
          <div class="py-2 " v-if="interactionMode=='makeSellOrder' || interactionMode=='lowerPrice'">
            <SellOrderForm
            v-bind:web3Plug="web3Plug"
            v-bind:nftContractAddress="nftContractAddress"
            v-bind:nftTokenId="nftTokenId"
            v-bind:orderSubmittedCallback="onOrderSubmitted"
            v-bind:interactionMode="interactionMode"
            v-bind:bestSellOrder="bestSellOrder"
            />
          </div>
           <div class="py-2" v-if="interactionMode=='makeBuyOrder'">
            <BuyOrderForm
            v-bind:web3Plug="web3Plug"
            v-bind:nftContractAddress="nftContractAddress"
            v-bind:nftTokenId="nftTokenId"
            v-bind:orderSubmittedCallback="onOrderSubmitted"
            />
          </div>
       </div>

     </div>
   </div> -->



  <!-- <Footer/> -->

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js'


import Navbar from './components/Navbar.vue';

import Footer from './components/Footer.vue';

import OffersList from './components/OffersList.vue'

import BuyOrderForm from './components/BuyOrderForm.vue'
import SellOrderForm from './components/SellOrderForm.vue';

import StarflaskAPIHelper from '../js/starflask-api-helper'
import AssetDataHelper from '../js/asset-data-helper'

import FrontendHelper from '../js/frontend-helper'

const web3utils = require('web3').utils

const BN = web3utils.BN

const FrontendConfig = require('../config/FrontendConfig.json')
const StoreContractABI = require( '../contracts/BlockStoreABI.json'  )

export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer, SellOrderForm, BuyOrderForm, OffersList},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      nftContractAddress: null,
      nftTokenId: null,
      tokenOwnerAddress: null,
      interactionMode: null ,
      nftTraitsArray:[],

      activeAccountAddress: null,

      bestSellOrder:null

    }
  },
  mounted: function () {
      console.log('contractAddress', this.$route.params.contractAddress)




    this.nftContractName = this.$route.params.contractAddress
    this.nftTokenId = parseInt( this.$route.params.tokenId )




    this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
        console.log('stateChanged',connectionState);

        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId

          let contractData = this.web3Plug.getContractDataForActiveNetwork()

        this.nftContractAddress = FrontendHelper.lookupContractAddress( this.nftContractName, contractData  )
   console.log('found address',this.nftContractAddress)


        await this.fetchTokenData()

        await this.fetchOrdersForToken()



        this.$forceUpdate();




      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);

        this.web3error = errormessage
        // END CUSTOM CODE
      }.bind(this));
    this.web3Plug.reconnectWeb()

  },
  methods: {

      getLinkUrl(){

        //return `https://artblocks.io/token/${this.nftTokenId}.png`
        return `/collection/${this.nftContractAddress}/${this.nftTokenId}`
      },

      getImageURL(){

        // return `/images/toadz/${this.nftTokenId}.jpg`
        return `https://cosmic-caps.s3.amazonaws.com/Final_10000_caps/${this.nftTokenId}.png`

      },

      getAssetName(){
        //make this come from a giant config file that uses contract address and token id to look up
        let typeName = "Cosmic Cap"
        let tokenId = this.nftTokenId


        console.log('typeName',typeName)

        return typeName + ' ' + '#' + tokenId

        //return 'unknown asset'
      },

      getCollectionExplorerURL(){
        return this.web3Plug.getExplorerLinkForAddress(this.nftContractAddress)
      },



      getProjectURL(){

        return `/collection/${this.nftContractName}/`
      },

      getCollectionName(){
          //make this come from a giant config file that uses contract address and token id to look up

        return AssetDataHelper.getCollectionNameForAsset(this.nftContractAddress, this.nftTokenId)
      },



       getOwnerAddress(){

         if(this.ownedByLocalUser()) return 'You'

         console.log('tokenOwnerAddress',this.tokenOwnerAddress)

        return this.tokenOwnerAddress
      },

      ownedByLocalUser(){
        if(!this.tokenOwnerAddress || !this.activeAccountAddress ) return false


        return this.tokenOwnerAddress.toLowerCase() == this.activeAccountAddress.toLowerCase()
      },

      async onOrderSubmitted(){

        // await this.fetchTokenData()

        await this.fetchOrdersForToken()

      },


      getBuyoutPrice(){

        if(this.bestSellOrder){
          let formattedAmount = this.web3Plug.rawAmountToFormatted( this.bestSellOrder.currencyTokenAmount ,18  )


          return  parseFloat(  formattedAmount )
        }

        return null
      },

      async buyoutNow(){


        let orderToFulfill = this.bestSellOrder

        let contractData = this.web3Plug.getContractDataForActiveNetwork() ;

        let storeContractAddress = contractData['blockstore'].address

        let orderInputs = [
          orderToFulfill.orderCreator,
          orderToFulfill.nftContractAddress,
          orderToFulfill.nftTokenId,
          orderToFulfill.currencyTokenAddress,

           new BN( orderToFulfill.currencyTokenAmount.toString()),

          orderToFulfill.nonce,
          orderToFulfill.expires,
          orderToFulfill.signature
        ]

        let txEthValue = 0

        const NATIVE_ETH = "0x0000000000000000000000000000000000000010"


        if(orderToFulfill.currencyTokenAddress == NATIVE_ETH){
          txEthValue = parseInt( orderToFulfill.currencyTokenAmount )
        }


        let storeContract = this.web3Plug.getCustomContract( StoreContractABI, storeContractAddress )

        let response = await storeContract.methods.buyNFTUsingSellOrder(  ...orderInputs  )
        .send({from: this.web3Plug.getActiveAccountAddress() , value:  txEthValue  })

        console.log('response',response)


      },


      async cancelBuyout( orderToCancel ){
        let contractData = this.web3Plug.getContractDataForActiveNetwork() ;

        let storeContractAddress = contractData['blockstore'].address


        //solve bn parsing



        let orderInputs = [
          orderToCancel.orderCreator,
          orderToCancel.isSellOrder,
          orderToCancel.nftContractAddress,
          orderToCancel.nftTokenId.toString(),
          orderToCancel.currencyTokenAddress,
          new BN(orderToCancel.currencyTokenAmount.toString()),
          orderToCancel.nonce ,
          orderToCancel.expires,

          orderToCancel.signature
        ]

        console.log('orderInputs',orderInputs)

         let storeContract = this.web3Plug.getCustomContract( StoreContractABI, storeContractAddress )

        let response = await storeContract.methods.cancelOffchainOrder(  ...orderInputs  )
        .send({from: this.web3Plug.getActiveAccountAddress()   })

        console.log('response',response)

      },


      //  async fetchTokenData(){
      //       console.log('attempting fetchTokenData')
      //       let results = await StarflaskAPIHelper.resolveStarflaskQuery( FrontendConfig.tokenDataApiRoot+'/api/v1/apikey', {"requestType": "ERC721_by_token", "input":{"contractAddress":this.nftContractAddress,"tokenId":  this.nftTokenId}  }    )
      //
      //       console.log('fetchedTokenData',results )
      //
      //       let output = results.output[0]
      //
      //       if(output){
      //         this.tokenOwnerAddress = output.accountAddress
      //       }
      // },

    async fetchTokenData(){
        let collectionName = this.nftContractName
        console.log('fetchTokenData', FrontendConfig.marketApiRoot, collectionName)
        let results = await StarflaskAPIHelper.resolveStarflaskQuery( FrontendConfig.marketApiRoot+'/api/v1/apikey', {"requestType": "NFTTile_by_token_id", "input":{"collectionName": collectionName, "tokenId":  this.nftTokenId}  }    )
        console.log('fetchedTokeResults',results )
        let output = results.output
        if(output){
            this.tokenOwnerAddress = output.ownerPublicAddress
            this.nftTraitsArray = output.nftTraits
            this.isLoading = false

            console.log('tokenOwnerAddress',tokenOwnerAddress)
     }
    },



      async fetchOrdersForToken(){

          //update the buy offers list
         this.$refs.OffersList.fetchBuyOffers()


        //update the buyout button
         let response = await StarflaskAPIHelper.resolveStarflaskQuery( FrontendConfig.marketApiRoot+'/api/v1/apikey', {"requestType": "get_orders_for_token", "input":{"contractAddress":this.nftContractAddress,"tokenId":  this.nftTokenId}  }    )


         let ordersForNFT = response.output.slice(0,5000)



         let ordersFromOwner = ordersForNFT.filter(x => x.orderCreator.toLowerCase() == this.tokenOwnerAddress.toLowerCase()  )



         let buyOrders = ordersFromOwner.filter(x => x.isSellOrder == false  )
         let sellOrders = ordersFromOwner.filter(x => x.isSellOrder == true  )


         this.bestSellOrder = await this.getBestSellOrder( sellOrders )


      },



      async getBestSellOrder(allSellOrders){


        let currentBlockNumber = await this.web3Plug.getBlockNumber()
        let unexpiredOrders = allSellOrders.filter(x => x.expires > currentBlockNumber)



        if(unexpiredOrders.length > 0 ){

           unexpiredOrders.sort( (a,b) => { return a.currencyTokenAmount - b.currencyTokenAmount  }   )

           console.log('unexpiredOrders',unexpiredOrders  )

          let bestPrice = unexpiredOrders[0]



          return bestPrice
        }

        return null

      }



  }
}
</script>
