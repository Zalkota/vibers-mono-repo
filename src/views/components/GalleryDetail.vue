<template>
    <div>
       <div class="section bg-gray-100 px-0 lg:px-1">
         <div class=" ">
            <Navbar
            v-bind:web3Plug="web3Plug"
           />
         </div>
       </div>

  <div class="container mt-6 mx-auto flex flex-col sm:flex-row">
      <div class="flex-auto  m-6">
          <img class="object-center object-cover h-auto rounded-md " v-bind:src="'https://cosmic-caps.s3.amazonaws.com/Final_10000_caps/' + this.id + '.png'" alt="Cosmic Cap NFT">
      </div>
     <div class="flex-auto  py-8 px-12 pb-0 m-6 shadow-md bg-white rounded-md ">
         <h1 class="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900 mt-0 mb-6">
             Cosmic Cap #{{ this.id }}
         </h1>
         <div class="p-2 mb-2">
             <div class="">
                 <h2 class="text-gray-800 font-bold">Description</h2>
             </div>
             <div class="py-2">
                 <p class="text-gray-800 text-sm">Cosmic Caps are a Non-Fungible Token (NFT) species of 10,000 unique fungi. These adventurous mushrooms are exploring their way from the shroomiverse to the metaverse!</p>
             </div>
         </div>
         <div class="mt-2 ">
             <div class="p-2">
                 <h2 class="text-gray-800 font-bold">Properties</h2>
             </div>
             <div class="flex flex-wrap">
                 <div class="bg-blue-100 px-4 py-2 border-blue-300  border-2 rounded-md text-center m-2">
                     <span class="text-sm text-gray-700"> Shroom Cap</span> <br>
                     <span class="font-bold text-gray-800">{{ this.mushrooms[this.id]['Shroom Cap'] }}</span>
                 </div>

                 <div class="bg-blue-100 px-4 py-2 border-blue-300  border-2 rounded-md text-center m-2">
                     <span class="text-sm text-gray-700"> Shroom Stem</span> <br>
                     <span class="font-bold text-gray-800">{{ this.mushrooms[this.id]['Shroom Stem'] }}</span>
                 </div>

                 <div class="bg-blue-100 px-4 py-2 border-blue-300  border-2 rounded-md text-center m-2">
                     <span class="text-sm text-gray-700"> Mouth</span> <br>
                     <span class="font-bold text-gray-800">{{ this.mushrooms[this.id]['Mouth'] }}</span>
                 </div>

                 <div class="bg-blue-100 px-4 py-2 border-blue-300  border-2 rounded-md text-center m-2">
                     <span class="text-sm text-gray-700"> Eyes</span> <br>
                     <span class="font-bold text-gray-800">{{ this.mushrooms[this.id]['Eyes'] }}</span>
                 </div>

                 <div class="bg-blue-100 px-4 py-2 border-blue-300  border-2 rounded-md text-center m-2">
                     <span class="text-sm text-gray-700">Background</span> <br>
                     <span class="font-bold text-gray-800">{{ this.mushrooms[this.id]['Background'] }}</span>
                 </div>

                 <div class="bg-blue-100 px-4 py-2 border-blue-300  border-2 rounded-md text-center m-2">
                     <span class="text-sm text-gray-700"> Body Props</span> <br>
                     <span class="font-bold text-gray-800">{{ this.mushrooms[this.id]['Body Props'] }}</span>
                 </div>

             </div>
         </div>
         <br>
         <br>
     </div>

  </div>
  <div class="text-center mx-auto m-6">
          <a v-bind:href="'https://opensea.io/assets/0xf3c9b7a97eba579f5c234f79108331f5513c9741/' + this.id" class="button bg-blue-500 text-3xl text-white font-bold my-2 py-3 px-6 rounded-xl shadow-md w-56 text-center no-underline " >Buy on Opensea</a>
  </div>
   </div>
</template>


<script>

import mushroomJson from "../../mushrooms.json";
import Web3Plug from "../../js/web3-plug.js";

import Navbar from "../components/Navbar.vue";

import TabsBar from "../components/TabsBar.vue";

import FrontendHelper from "../../js/frontend-helper.js";




export default {
  name: 'GalleryDetail',
  props: [],
  components: { Navbar },
  data() {
    return {
        web3Plug: new Web3Plug(),
        id: this.$route.params.id,
        mushrooms: mushroomJson,
        object: '',
        cap: '',


    }
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


  },

  mounted(){

  },
  methods: {
  },
  computed: {
      thisMushroom: function(){
          // console.log("forloop");
          for (let object in this.mushrooms) {
              console.log("forloop", object.tokenId);
              if (object.id == this.id) {
                  console.log(object.id);
                  this.cap == object['Shroom Cap'];
                return object.id
              }
          }
      },


    },
  }



</script>
