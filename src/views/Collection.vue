<template>

<div>

   <div class="section px-0 lg:px-1">

     <div class=" ">
        <Navbar
        v-bind:web3Plug="web3Plug"
       />
     </div>
   </div>


   <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
       <div class="text-center pb-12">
           <span class="text-3xl text-blue-800 font-bold">Cosmic Caps</span>
           <h1 class="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-black-800 mt-0 pt-0">
               Marketplace
           </h1>

                   <div class="flex flex-row">
                       <div class="flex-auto">
                           <!-- <FilterDropdown/> -->
                           <TreeList
                             v-bind:inputArray="filterTraitsList"
                             v-bind:onClickCallback="onClickTraitCallback"
                           />
                       </div>

                   </div>
           <!-- <span class="text-gray-700"> Showing: {{ this.end}}  / 10,000</span> -->
       </div>
      
           <TiledTokenBrowser
             ref="TokenBrowser"
             v-bind:currentFilter="tokenBrowserFilter"
             v-bind:clearFiltersCallback="clearFiltersCallback"
           />
       
       <br>

   </section>


  <Footer/>

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js'


//import SearchBar from './components/legacy/SearchBar.vue';
import Navbar from './components/Navbar.vue';

import Footer from './components/Footer.vue';
import TreeList from './components/TreeList.vue';

import TiledTokenBrowser from './components/TiledTokenBrowser.vue';
//import ToadzTileGrid from './components/ToadzTileGrid.vue';

//import FrontPageMedia from './components/FrontPageMedia.vue';

import StarflaskApiHelper from '../js/starflask-api-helper.js'

const FrontendConfig = require('../config/FrontendConfig.json')

export default {
  name: 'Collection',
  props: [],
  components: {Navbar, Footer,TreeList,TiledTokenBrowser},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      activePanelId: null ,

      filterTraitsList: {},
      tokenBrowserFilter: {}
    }
  },

  created(){


    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);

        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId



      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);

        this.web3error = errormessage

      }.bind(this));

      this.web3Plug.reconnectWeb()





  },
  mounted: function () {

      this.fetchTraits()

  },
  methods: {

          async fetchTraits( ){

              let uri = FrontendConfig.marketApiRoot+'/api/v1/apikey'

              let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "all_collection_traits", "input": {collectionName:'cosmiccaps_dev'}})


              this.filterTraitsList = this.computeFilterTraitsList(  result.output  )
              console.log('this.filterTraitsList',this.filterTraitsList)

          },

          computeFilterTraitsList(filterTraitsList){

            let map = {}

            for(let trait of filterTraitsList){
              if(!map[trait.traitType]) map[trait.traitType] = []
              map[trait.traitType].push( trait.value )
            }

            let output = []

            for(let key of Object.keys(map)){
              output.push(  {title: key,  children:  map[key].map(v =>  ({"title": v}) ) }  )
            }

            return  {title:"All Traits", children: output}
          },

          onClickTraitCallback(result){

            this.tokenBrowserFilter = { traitName: result.parent , traitValue: result.leaf }
          },

          clearFiltersCallback(){
             this.currentPage = 1

             this.$refs.TokenBrowser.forceSetPage( this.currentPage )

            this.tokenBrowserFilter = { traitName: undefined , traitValue: undefined }

            this.updateRouteParams()
          },

          setActivePanel(panelId){
              if(panelId == this.activePanelId){
                this.activePanelId = null;
                return
              }
               this.activePanelId = panelId ;
          },
          onTabSelect(tabname){
            console.log(tabname)

              this.selectedTab = tabname.toLowerCase()


          },


  }
}
</script>
