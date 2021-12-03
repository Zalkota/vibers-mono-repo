<template>
  <div  >
          <div class="" style="min-height:400px">
              <NftTile
                v-for="tokenId in activeTokenIdArray"
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
  props: [ 'currentFilter' ],
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
      async fetchFilteredTokensArray(){
        console.log('fetching results  - new current filter ')
        // this.currentFilter 

         let uri = FrontendConfig.marketApiRoot+'/api/v1/apikey'
          

         let inputQuery = Object.assign( {collectionName:'Cryptoadz'}, this.currentFilter   )
         let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "ERC721_by_trait_value", "input": inputQuery})
           let output = result.output 

           if(output && output[0]){

               
              this.resultsData = output[0] 
              console.log('resultsData', this.resultsData)

              this.currentPage = 1
              this.activeTokenIdArray = this.filterTokensForCurrentPage(this.resultsData.tokenIdArray)

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
