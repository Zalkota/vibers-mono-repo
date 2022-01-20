<template>
    <div class="md:mx-2">
        <div class="my-3 ">
                <span class=" text-sm text-gray-600">{{ filterTokenIdArrayLength }} Cosmic Caps owned by you.</span>
        </div>

          <br>

          <div class="inline-flex unhide ">
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
                <span class="text-red-400 ">activeTokenIdArray {{ activeTokenIdArray}}</span>
                <span class="text-green-400 ">allTokenIdArray {{ allTokenIdArray }}</span>
              <NftTile
                v-for="tokenId in activeTokenIdArray"
                v-bind:key="tokenId"

                v-bind:collectionName="resultsData.collectionName"
                v-bind:nftTokenId="tokenId"
                v-bind="co"

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
import StarflaskApiHelper from '../../js/starflask-api-helper.js'
import NftTile from './NftTile.vue';
import PaginationBar from './PaginationBar.vue';
const FrontendConfig = require('../../config/FrontendConfig.json')

export default {
  name: 'TiledTokenProfileBrowser',
  props: ['userAddress'],
  components: {NftTile, PaginationBar},
  watch: {
    // currentFilter: {
    //   immediate: true,
    //   deep: true,
    //   handler(newValue, oldValue) {
    //       this.fetchFilteredTokensArray()
    //   }
    // }
  },

  data() {
    return {
      resultsData : {},
      // filterExists: false,
      activeTokenIdArray: [],
      allTokenIdArray: [],
      allTokenIdArrayLength: 0,
      filterTokenIdArrayLength: 0,
      currentPage: 0,
      maxPages: 0,
      itemsPerPage: 25,
      singleColActive: true,
      classGridSingle: 'grid-cols-1',

    }
  },
  created(){

  },

  mounted: async function() {
    this.fetchFilteredTokensArray()
    },





  methods: {

      async fetchFilteredTokensArray(){
        console.log('fetching results  - fetchFilteredTokensArray ')
         let uri = FrontendConfig.marketApiRoot +'/api/v1/apikey'

         let inputQuery = Object.assign( { accountAddress: userAddress})
         console.log('input', userAddress)
         let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "ERC721_balance_by_owner", "input": inputQuery})
           let output = result.output
           console.log('result.output', output, )

           if(output && output.tokenIdArray[0]){

              this.resultsData = output
              console.log('resultsData', this.resultsData)

              this.currentPage = 1
              this.activeTokenIdArray = this.filterTokensForCurrentPage(this.resultsData.tokenIdArray)
              console.log('activeTokenIdArray', this.activeTokenIdArray)

              this.filterTokenIdArrayLength = this.resultsData.tokenIdArray.length
              this.maxPages = Math.ceil( this.resultsData.tokenIdArray.length / this.itemsPerPage )
              console.log('max pages', this.maxPages)
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
        this.activeTokenIdArray = this.filterTokensForCurrentPage(this.resultsData.tokenIdArray)

      },

      clickedTileCallback(row){
        //this.clickedTileCallback(row)
    },

  },

  mounted() {

  }
}

</script>
