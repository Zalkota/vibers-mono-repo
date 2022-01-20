<template>

<div>

   <div class="section px-0 lg:px-1">

     <div class=" ">
        <Navbar
        v-bind:web3Plug="web3Plug"
       />
     </div>
   </div>


   <section class=" bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-6 border border-gray-400 rounded-lg">
       <div class="text-center mb-3">
           <h1 class="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-black-800 mt-0 pt-0 mb-3">
               Profile
           </h1>
           <input
           class="button bg-blue-100 text-sm fontmedium sm:text-md text-gray-800 mb-2 py-3 px-6 rounded-xl rounded-r-none shadow-sm text-center no-underline border border-gray-400"
           v-on:focus="$event.target.select()"
           ref="clone"
           readonly
           :value="userAddress" />
           <button @click="copy" class="button bg-white text-md fontmedium sm:text-md text-gray-700 my-2 py-2 px-4 rounded-xl rounded-l-none shadow-sm text-center no-underline border border-gray-400">
               <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="copy" class="svg-inline--fa fa-copy fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path></svg>
           </button>

       </div>
       <hr>
           <TiledTokenProfileBrowser
             ref="TokenProfileBrowser"
             v-bind:userAddress="userAddress"
           />
       <br>
   </section>

  <!-- <Footer/> -->

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js'
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import TiledTokenProfileBrowser from './components/TiledTokenProfileBrowser.vue';
import StarflaskApiHelper from '../js/starflask-api-helper.js'

const FrontendConfig = require('../config/FrontendConfig.json')

export default {
  name: 'Profile',
  props: [],
  components: {Navbar, Footer, TiledTokenProfileBrowser},
  // watch: {
  //       ProfileDetails: {
  //           immediate: true,
  //           // deep: true,
  //           handler(newValue, oldValue) {
  //           this.CallProfileDetails()
  //           }
  //      }
  // },
  data() {
    return {
      web3Plug: new Web3Plug(),
      signedInToWeb3: false,
      activePanelId: null,
      userAddress: null,



    }
  },

  created() {
    this.web3Plug.getPlugEventEmitter().on(
      "stateChanged",
      async function (connectionState) {
        console.log("stateChanged", connectionState);

        this.activeAccountAddress = connectionState.activeAccountAddress;
        this.activeNetworkId = connectionState.activeNetworkId;

        this.signedInToWeb3 = this.activeAccountAddress != null;

        // this.getTotalSupply();
      }.bind(this)
    );
    this.web3Plug.getPlugEventEmitter().on(
      "error",
      function (errormessage) {
        console.error("error", errormessage);

        this.web3error = errormessage;
      }.bind(this)
    );

    this.web3Plug.reconnectWeb();
  },
  mounted: function () {

    this.CallProfileDetails()

  },

  computed: {

  },

  methods: {


          copy() {
        this.$refs.clone.focus();
        document.execCommand('copy');
      },


      async CallProfileDetails(){

        console.log("CallProfileDetails");

        try {
            if (!this.signedInToWeb3) {
              this.web3Plug.connectWeb3();
              return;
            }
            this.userAddress = this.web3Plug.getActiveAccountAddress();
        }
        catch(err) {
          console.log('error!')
        }
        console.log("userAddress:" + this.userAddress);

        // return this.userAddress


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
