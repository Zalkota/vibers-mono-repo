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


   <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-">
       <div class="text-center pb-2">
           <span class="text-3xl text-blue-800 font-bold">Vibers</span>
           <h1 class="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-black-800 mt-0 pt-0">
               Marketplace
           </h1>
           <div class="">
               <div v-on:click="show = !show" class="right-0 button bg-blue-600 text-md text-white text-sm font-bold my-2 py-1 px-3 md:mx-2 rounded-md shadow-md text-center no-underline w-32 cursor-pointer hover:bg-blue-500 hover:shadow-sm" >
                   Show Filters
               </div>
           </div>

           <div class="flex flex-row" v-if="show">
               <div class="flex-auto">
                   <FilterDropdown
                   v-bind:inputArray="filterTraitsList"
                   v-bind:onClickCallback="onClickTraitCallback"
                   />
               </div>
           </div>
       </div>

           <TiledTokenBrowser
             ref="TokenBrowser"
             v-bind:currentFilter="tokenBrowserFilter"
             v-bind:clearFiltersCallback="clearFiltersCallback"
           />

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
import FilterDropdown from './components/FilterDropdown.vue';
import TiledTokenBrowser from './components/TiledTokenBrowser.vue';

import StarflaskApiHelper from '../js/starflask-api-helper.js'

const FrontendConfig = require('../config/FrontendConfig.json')

export default {
  name: 'Collection',
  props: [],
  components: {Navbar, Footer, TiledTokenBrowser, FilterDropdown},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      activePanelId: null ,
      itemsPerPage: 25,
      itemsActive: 25,
      currentPage: 1,
      filterTraitsList: {},
      tokenBrowserFilter: {},
      show: false,
      userAddress: null

    }
  },

  created() {
    this.web3Plug.getPlugEventEmitter().on(
      "stateChanged",
      async function (connectionState) {
        console.log("stateChanged", connectionState);
        this.activeAccountAddress = connectionState.activeAccountAddress;
        this.activeNetworkId = connectionState.activeNetworkId;
        //Addons
        this.signedInToWeb3 = this.activeAccountAddress != null;
        this.CallProfileDetails()
      }.bind(this)
    );
    this.web3Plug.getPlugEventEmitter().on(
      "error",
      function (errormessage) {
        console.error("error: getPlugEventEmitter", errormessage);

        this.web3error = errormessage;
      }.bind(this)
    );
    this.web3Plug.reconnectWeb();
  },
  beforeMount() {
      this.fetchTraits()
      this.CallProfileDetails()

  },

  mounted: function () {

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
