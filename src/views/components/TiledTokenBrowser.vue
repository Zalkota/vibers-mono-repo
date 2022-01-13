<template>
    <div>

          <div v-if="currentFilter && currentFilter.traitName" class="bg-gray-100 mb-2 p-2 rounded border-gray-800 border-2 inline-block  text-black">
              <span v-if="currentFilter && currentFilter.traitName" @click="clearFilters" class="mb-2 p-2 inline-block  text-red-500 cursor-pointer">
                  X
              </span>
              {{currentFilter.traitValue}}
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <NftTile
                v-for="tokenId in activeTokenIdArray"
                v-bind:key="tokenId"

                v-bind:collectionName="resultsData.collectionName"
                v-bind:nftTokenId="tokenId"

                v-bind:clickedTileCallback="clickedTileCallback"
               />
               {{ activeTokenIdArray}}
              <div class="text-left px-5 pt-4 pb-2">
                  <h4 class="text-sm text-gray-900 font-bold mb-2">Cosmic Cap #</h4>
              </div>
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
  name: 'TiledTokenBrowser',
  props: [ 'currentFilter' , 'clearFiltersCallback' ],
  components: {NftTile,PaginationBar},
  watch: {
    currentFilter: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {

        this.fetchFilteredTokensArray()
      }
    }
  },

  data() {
    return {
     // collectionName: null,
      //tokenArray: [],

      resultsData : {},
      activeTokenIdArray: [],
      currentPage: 0,
      maxPages: 0,
      itemsPerPage: 25

    }
  },
  created(){

  },
  methods: {
      //
      // async fetchFilteredTokensArray(){
      //   console.log('fetching results  - new current filter ')
      //   // this.currentFilter
      //
      //    let uri = FrontendConfig.marketApiRoot +'/api/v1/apikey'
      //
      //
      //    let inputQuery = Object.assign( {collectionName:'cosmicaps_dev'}, this.currentFilter)
      //    // let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "ERC721_by_trait_value", "input": inputQuery})
      //    let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "", "input": ""})
      //      let output = result.output
      //
      //      if(output && output[0]){
      //
      //
      //         this.resultsData = output[0]
      //         console.log('resultsData', this.resultsData)
      //
      //         this.currentPage = 1
      //         this.activeTokenIdArray = this.filterTokensForCurrentPage(this.resultsData.tokenIdArray)
      //
      //         this.maxPages = Math.ceil( this.resultsData.tokenIdArray.length / this.itemsPerPage )
      //
      //         console.log('max pages', this.maxPages)
      //      }
      //
      // },


      async fetchFilteredTokensArray(){
        console.log('fetching results  - new current filter ')
        // this.currentFilter

         let uri = FrontendConfig.marketApiRoot +'/api/v1/apikey'
         console.log("fetchedFilteredTokensArray uri=", uri)

         console.log('this.currentFilter', this.currentFilter)
         let inputQuery = Object.assign( {collectionName:'cosmiccaps_dev'}, this.currentFilter)
         console.log("fetchedFilteredTokensArray inputQuery=", inputQuery)

         let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "ERC721_by_trait_value", "input": inputQuery})
           let output = result.output
           console.log('result.output', output, )

           if(output && output.tokenIdArray[0]){


              this.resultsData = output
              console.log('resultsData', this.resultsData)

              this.currentPage = 1
              this.activeTokenIdArray = this.filterTokensForCurrentPage(this.resultsData.tokenIdArray)
              console.log('activeTokenIdArray', this.activeTokenIdArray)

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

      clearFilters(){
          this.clearFiltersCallback()
      },

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
      }
  }
}
</script>
