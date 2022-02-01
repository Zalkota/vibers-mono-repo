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


            <div>
                <div v-if="currentFilter.traitValue !== undefined" v-bind:class=" [singleColActive ? classGridSingle : 'grid-cols-2', 'grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6']">
                    <NftTile
                      v-for="tokenId in activeTokenIdArray"
                      v-bind:key="tokenId"

                      v-bind:collectionName="resultsData.collectionName"
                      v-bind:nftTokenId="tokenId"

                      v-bind:clickedTileCallback="clickedTileCallback"
                     />
                </div>


               <div v-else="currentFilter.traitValue == undefined"  v-bind:class=" [singleColActive ? classGridSingle : 'grid-cols-2', 'grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6']">
                   <div v-for="mushroom in activeTokenIdArray" class="w-full bg-white rounded-lg sahdow-lg overflow-hidden flex flex-col justify-center border border-gray-400">
                       <router-link v-bind:to="'/collection/cosmiccaps_dev/' + mushroom.tokenId" class=" cursor-pointer  no-underline select-none inline-block  relative"   >
                           <img class="object-center object-cover h-auto w-full" v-bind:src="'https://cosmic-caps.s3.amazonaws.com/Final_10000_caps/' + mushroom.tokenId + '.png'" alt="Cosmic Cap NFT Image">
                           <div class="text-center  px-2 sm:px-4  py-2 sm:py-4 ">
                               <h4 class="text-sm text-gray-900 font-bold">Cosmic Cap #{{ mushroom.tokenId }} </h4>
                           </div>
                       </router-link>
                   </div>
               </div>
            </div>

           <!-- <PaginationBar
             :currentPage="currentPage"
             :maxPages="maxPages"
             :setCurrentPageCallback="setCurrentPageCallback"
            /> -->

    </div>
</template>


<script>
import StarflaskApiHelper from '../../js/starflask-api-helper.js'
import mushroomJson from "../../mushrooms.json";
import NftTile from './NftTile.vue';
import PaginationBar from './PaginationBar.vue';
const FrontendConfig = require('../../config/FrontendConfig.json')

export default {
  name: 'TiledTokenBrowser',
  props: [ 'currentFilter' , 'clearFiltersCallback'],
  components: {NftTile,PaginationBar},
  watch: {
    currentFilter: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
          this.fetchFilteredTokensArray()
      }
  },
  itemsPerPage: {
    immediate: true,
    deep: true,
    handler(newValue, oldValue) {
        console.log("test")
         this.updateTokenArrayInfiniteScroll()
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
      maxPages: 1,

      singleColActive: true,
      classGridSingle: 'grid-cols-1',
      mushrooms: mushroomJson,
      mushroomArray: [],
      tokenIdArray: [],

    }
  },
  created(){

  },

  mounted: function () {
      this.getNextPage() //Infinite Scroll function

  },


  methods: {

      getNextPage() {
          window.onscroll = () => {
              let windowLocation = document.documentElement.scrollTop + window.innerHeight
              let offsetNearHeight = document.documentElement.offsetHeight - (document.documentElement.offsetHeight * 0.2)

            let bottomOfWindow = windowLocation >= offsetNearHeight;
            if (bottomOfWindow) {
                console.log("infinite scroll detected", this.currentPage, this.itemsPerPage)
                this.currentPage = this.currentPage + 1
                this.itemsPerPage = this.currentPage * 25
                console.log("this.itemsPerPage", this.itemsPerPage)
                this.activeTokenIdArray = this.filterTokensForCurrentPage(this.tokenIdArray)
            }
          }
      },

      async fetchFilteredTokensArray(){
        console.log('fetching results  - fetchFilteredTokensArray ')

         let uri = FrontendConfig.marketApiRoot +'/api/v1/apikey'

         let inputQuery = Object.assign( {collectionName:'cosmiccaps_dev'}, this.currentFilter)

         this.itemsPerPage = 25

         this.activeTokenIdArray = []

         console.log('this.currentFilter.traitvalue', this.currentFilter.traitName)

         if (this.currentFilter.traitName !== undefined ){
             console.log('Filter == defined', this.currentFilter.traitvalue)
             let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "ERC721_by_trait_value", "input": inputQuery})
               let output = result.output
               console.log('result.output', output, )

               if(output && output.tokenIdArray[0]){

                  this.resultsData = output
                  console.log('resultsData', this.resultsData.tokenIdArray)

                  this.tokenIdArray = this.resultsData.tokenIdArray

                  this.currentPage = 0
                  this.activeTokenIdArray = this.filterTokensForCurrentPage(this.tokenIdArray)
                  console.log('activeTokenIdArray', this.activeTokenIdArray)

                  this.filterTokenIdArrayLength = this.resultsData.tokenIdArray.length

                  this.maxPages = Math.ceil( this.resultsData.tokenIdArray.length / this.itemsPerPage )

                  console.log('max pages', this.maxPages)
              }
         } else {
             console.log('Filter == undefined')
             this.activeTokenIdArray = []

             this.tokenIdArray = this.mushrooms

             this.currentPage = 0
             this.activeTokenIdArray = this.filterTokensForCurrentPage(this.tokenIdArray)
             console.log('activeTokenIdArray', this.activeTokenIdArray)

             this.filterTokenIdArrayLength = this.mushrooms.length
             // this.maxPages = Math.ceil( this.mushrooms.length / this.itemsPerPage )
             // console.log('max pages', this.maxPages)

         }


      },


      filterTokensForCurrentPage(allTokenIds){
        let startIndex = 0;
        let endIndex = this.itemsPerPage
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
        this.activeTokenIdArray = this.filterTokensForCurrentPage(this.tokenIdArray)

      },

      clickedTileCallback(row){
        //this.clickedTileCallback(row)
    },

  },


}

</script>
