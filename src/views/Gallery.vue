<template>

<div>
   <div class="section bg-gray-100 px-0 lg:px-1">
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
            <input class="w-full h-16 px-3 rounded mb-8 focus:outline-none focus:shadow-outline text-xl px-8 shadow-lg" v-model="search" placeholder="Search Cosmic Caps by ID..">

                    <!-- <div class="flex flex-row">
                        <div class="flex-auto">
                            <FilterDropdown/>
                        </div>
                        <div class="flex-auto">
                            <FilterDropdown/>
                        </div>
                        <div class="flex-auto">
                            <FilterDropdown/>
                        </div>
                        <div class="flex-auto">
                            <FilterDropdown/>
                        </div>
                        <div class="flex-auto">
                            <FilterDropdown/>
                        </div>
                        <div class="flex-auto">
                            <FilterDropdown/>
                        </div>
                    </div> -->
            <!-- <span class="text-gray-700"> Showing: {{ this.end}}  / 10,000</span> -->
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <template v-for="mushroom in filteredMushrooms">
              <div class="w-full bg-white rounded-lg sahdow-lg overflow-hidden flex flex-col justify-center  border border-gray-300">
                  <router-link v-bind:to="'/gallery/' + mushroom.tokenId">
                      <div>
                          <img class="object-center object-cover h-auto w-full" v-bind:src="'https://cosmic-caps.s3.amazonaws.com/Final_10000_caps/' + mushroom.tokenId + '.png'" alt="photo">
                      </div>
                  </router-link>
                  <div class="text-left  px-3 pt-3 pb-2">
                      <h4 class="text-sm text-gray-900 mb-2">Cosmic Cap #{{ mushroom.tokenId }}</h4>
                  </div>
              </div>
          </template>
        </div>
        <br>
        <div  class="mx-auto flex flex-row justify-center items-center">
          <button v-show="hideButtonFunction" v-on:click="loadMore" class="button bg-blue-500 hover:bg-blue-300 text-2xl text-white font-bold my-2 py-3 px-6 rounded-xl shadow-md w-56 text-center no-underline">Load More  </button>
        </div>
    </section>


    <div class="section  text-white   " v-if="signedInToWeb3" style="background:#222;">
    </div>

</div>
</template>

<script>
import Web3Plug from "../js/web3-plug.js";

import Navbar from "./components/Navbar.vue";

import Footer from "./components/Footer.vue";
import TabsBar from "./components/TabsBar.vue";
import mushroomJson from "../mushrooms.json";
import FrontendHelper from "../js/frontend-helper.js";
import FilterDropdown from './components/FilterDropdown.vue';

const ERC721ABI = require("../contracts/ERC721ABI.json");


export default {
  name: "Gallery",
  props: [],
  components: { Navbar, Footer, FilterDropdown },
  data() {
    return {
      mushrooms: mushroomJson,
      search: '',
      web3Plug: new Web3Plug(),
      mushroomArray: [],
      end: 24,
      searchString: '',
      searchInput: '',
      count: 0,
      hideButton: null,
      signedInToWeb3: false,
      balances: {},
      tokenId: 0,
      donationAmount: 0,
      totalSupply: 0,
      mintAmount: 1,
      errorMessage: null,
      account: null,
    };
  },

  created() {
    this.web3Plug.getPlugEventEmitter().on(
      "stateChanged",
      async function (connectionState) {
        console.log("stateChanged", connectionState);

        this.activeAccountAddress = connectionState.activeAccountAddress;
        this.activeNetworkId = connectionState.activeNetworkId;
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


    this.mushroomArray = this.mushrooms.slice(0, this.end)
    // console.log('this.mushroom', mushroomJson)
  },
  mounted: function () {

  },
  methods: {
    loadMore:function(){
      this.end = this.end + 12;
      this.mushroomArray = this.mushrooms.slice(0, this.end)
    }

    },
  computed: {
    filteredMushrooms: function(){
      this.count = 0;
      console.log(this.count);
      if (this.search != "") {
        return this.mushrooms.filter((mushroom) => {
          this.mushroomId = String(mushroom.tokenId);
          if (this.count < this.end && this.mushroomId.match(this.search) != null) {
              this.count++;
              console.log(this.count, this.mushroomId.match(this.search));

              return this.mushroomId.match(this.search);
          } else {
              return false;
          }
        });

      } else {

        return  this.mushrooms.slice(0, this.end)
      }

  },
    hideButtonFunction: function(){
        if (this.count >= this.end || this.count == 0) {
            console.log("count", this.count,"end", this.end)
            // this.hideButton = false;
            // console.log("button", this.hideButton);
            return true;
        } else {
            console.log("count", this.count,"end", this.end)
            // this.hideButton = true;
            // console.log("button", this.hideButton);
            return false;
        }
    }
  }
};
</script>

<!-- https://cosmic-caps.s3.amazonaws.com/mushrooms/1.png -->
<!-- https://cosmic-caps.s3.amazonaws.com/mushrooms.json -->
