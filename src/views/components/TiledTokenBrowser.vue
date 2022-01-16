<template>

    <div class="md:mx-2">
        <div class="mb-3 ">
                <span class=" text-sm text-gray-600">{{ filterTokenIdArrayLength }} Cosmic Caps Total</span>

        </div>
          <div >
              <div v-if="currentFilter && currentFilter.traitName" @click="clearFilters" class="bg-gray-100 py-2 px-4 rounded border-blue-600 border-2 inline-block cursor-pointer text-black">
                  <span v-if="currentFilter && currentFilter.traitName"  class="pr-2 inline-block font-bold text-blue-600 ">
                      X
                  </span>
                  {{currentFilter.traitValue}}
              </div>
          </div>


          <br>
          <br>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 " >

                <span class="text-red-400 ">activeTokenIdArray {{ activeTokenIdArray}}</span>
                <span class="text-green-400 ">allTokenIdArray {{ allTokenIdArray }}</span>

              <NftTile
                v-if="currentFilter.traitValue"
                v-for="tokenId in activeTokenIdArray"
                v-bind:key="tokenId"

                v-bind:collectionName="resultsData.collectionName"
                v-bind:nftTokenId="tokenId"
                v-bind="co"

                v-bind:clickedTileCallback="clickedTileCallback"
               />

               <NftTile
                 v-else="currentFilter.traitValue"
                 v-for="tokenId in allTokenIdArray"
                 v-bind:key="tokenId"

                 v-bind:collectionName="resultsData.collectionName"
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
          // this.fetchAllTokensArray()
      }
    }
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
      itemsPerPage: 25

    }
  },
  created(){

  },




  methods: {

      // update(){
      //     UpdateArrayLength()
      // }

// BROKEN ATM FIX MONGO.FIND
      // async fetchAllTokensArray(){
      //     console.log('fetching results  - fetchAllTokensArray ')
      //      let uri = FrontendConfig.marketApiRoot +'/api/v1/apikey'
      //       let inputQuery = Object.assign({contractAddress:'0xf3c9B7A97Eba579f5c234F79108331F5513c9741'})
      //      // let inputQuery = '0xf3c9B7A97Eba579f5c234F79108331F5513c9741'
      //      console.log('inputQuery', inputQuery )
      //
      //      let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "ERC721_balance_by_contract", "input": inputQuery})
      //        let output = result.output
      //        console.log('result.output', output, )
      //
      //        if(output && output.tokenIdArray[0]){
      //           this.resultsData = output
      //           console.log('resultsData', this.resultsData)
      //
      //           this.currentPage = 1
      //           this.activeTokenIdArray = this.filterTokensForCurrentPage(this.resultsData.tokenIdArray)
      //           console.log('activeTokenIdArray', this.activeTokenIdArray)
      //
      //           this.maxPages = Math.ceil( this.resultsData.tokenIdArray.length / this.itemsPerPage )
      //           console.log('max pages', this.maxPages)
      //       }
      //     },




      async fetchFilteredTokensArray(){
        console.log('fetching results  - fetchFilteredTokensArray ')
        // this.currentFilter

         let uri = FrontendConfig.marketApiRoot +'/api/v1/apikey'

         let inputQuery = Object.assign( {collectionName:'cosmiccaps_dev'}, this.currentFilter)
         let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "ERC721_by_trait_value", "input": inputQuery})
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
    },

    // UpdateArrayLength(){
    //
    // }



  },

  mounted() {


      this.fetchAllTokensArray()


  }

}

</script>
