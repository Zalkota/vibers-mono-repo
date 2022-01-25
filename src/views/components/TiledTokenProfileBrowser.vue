<template>
    <div class="md:mx-2">
        <div class="my-3 ">
                <span class=" text-sm text-gray-600">{{ activeTokenIdArrayLength }} Cosmic Caps owned by you.</span>
        </div>

          <br>

          <div class="inline-flex sm:hidden mb-2">
              <button v-on:click="singleColActive = true" v-bind:class="[singleColActive ? classGridSingle : 'bg-white shadow-none', ' shadow-inner text-gray-800 font-bold py-3 px-3 rounded-l-md border border-gray-400']">
                  <svg width="35" height="35" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="31.6733" y="31.6729" width="186.654" height="186.654" rx="4" fill="#A6AFB9"/>
                  </svg>
              </button>
              <button v-on:click="singleColActive = false" v-bind:class="[!singleColActive ? classGridSingle : 'bg-white shadow-none', ' shadow-inner text-gray-800 font-bold py-3 px-3 rounded-r-md border border-gray-400']">
                  <svg width="35" height="35" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="31.6733" y="31.6729" width="90" height="90" rx="4" fill="#A6AFB9"/>
                  <rect x="31.6733" y="127.66" width="90" height="90" rx="4" fill="#A6AFB9"/>
                  <rect x="128.577" y="31.6729" width="90" height="90" rx="4" fill="#A6AFB9"/>
                  <rect x="128.577" y="127.66" width="90" height="90" rx="4" fill="#A6AFB9"/>
                  </svg>

              </button>
            </div>

          <div v-bind:class=" [singleColActive ? classGridSingle : 'grid-cols-2', 'grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6']" >
              <NftTile
                v-for="tokenId in activeTokenIdArray"
                v-bind:key="tokenId"

                v-bind:collectionName="collectionName"
                v-bind:nftTokenId="tokenId"
                v-bind:clickedTileCallback="clickedTileCallback"
               />
            </div>
            <PaginationBar
              :currentPage="currentPage"
              :maxPages="maxPages"
              :setCurrentPageCallback="setCurrentPageCallback"
             />
    </div>
</template>


<script>
import Web3Plug from '../../js/web3-plug.js'
import StarflaskApiHelper from '../../js/starflask-api-helper.js'
import NftTile from './NftTile.vue';
import PaginationBar from './PaginationBar.vue';
const FrontendConfig = require('../../config/FrontendConfig.json')

export default {
  name: 'TiledTokenProfileBrowser',
  props: ['web3Plug', 'userAddress'],
  components: {NftTile, PaginationBar},
  watch: {
    userAddress: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
          this.fetchFilteredTokensArray()
      }
    }
  },

  data() {
    return {
      resultsData : {},
      // filterExists: false,
      activeTokenIdArray: [],
      activeTokenIdArrayLength: 0,
      currentPage: 0,
      maxPages: 0,
      itemsPerPage: 25,
      singleColActive: true,
      classGridSingle: 'grid-cols-1',
      collectionName: ''

    }
  },
  created(){

  },

  mounted: async function() {

    },

  methods: {

      async fetchFilteredTokensArray(){
        console.log('fetching results  - fetchFilteredTokensArray ')
         let uri = FrontendConfig.marketApiRoot +'/api/v1/apikey'


         if (this.userAddress !== null) {

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

                  this.currentPage = 0
                  this.activeTokenIdArray = this.filterTokensForCurrentPage(this.resultsData.tokenIds)
                  console.log('activeTokenIdArray', this.activeTokenIdArray)

                  this.activeTokenIdArrayLength = this.resultsData.tokenIds.length
                  this.maxPages = Math.ceil( this.resultsData.tokenIds.length / this.itemsPerPage )
                  console.log('max pages', this.maxPages)
         }
          }
      },



      filterTokensForCurrentPage(allTokenIds){
        //sort

        //slice
        let startIndex = this.currentPage * this.itemsPerPage;
        let endIndex = startIndex+this.itemsPerPage

        return allTokenIds.slice(startIndex,endIndex)

      },

      // clearFilters(){
      //     this.clearFiltersCallback()
      // },

      forceSetPage( newPage ){
        this.currentPage = newPage
      },

      setCurrentPageCallback(newPage){
        console.log('newPage',newPage)
        this.currentPage = newPage
        this.activeTokenIdArray = this.filterTokensForCurrentPage(this.resultsData.tokenIds)

      },

      clickedTileCallback(row){
        //this.clickedTileCallback(row)
    },

  },

  mounted() {

  }
}

</script>
