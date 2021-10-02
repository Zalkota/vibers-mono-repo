<template>
  <nav role="navigation" class="w-full m-2 p-2 flex flex-row">
    <div class="w-full lg:w-auto block lg:inline-block" v-for="item in navConfig.dropdowns" :key="item.title">



        <div class="inline-block">

          <div v-if="web3Plug.connectedToWeb3() == false" @click="connectToWeb3" class="button bg-yellow-400 hover:bg-yellow-300 text-2xl text-black font-bold my-2 py-3 px-6 rounded cursor-pointer shadow-md hover:shadow-sm rounded-xl">Connect Wallet</div>


          <div v-if="web3Plug.connectedToWeb3() "   class="truncate  text-gray-800 p-2" style="max-width:250px;  ">


          <Web3NetButton
             v-bind:providerNetworkID="activeNetworkId"
             v-bind:web3Plug='web3Plug'
           />

            <span class="  " style="max-width:120px">
            <a   v-bind:href="getEtherscanBaseURL()+'/address/'+web3Plug.getActiveAccountAddress()" class="text-gray-800  "   target="_blank">  {{web3Plug.getActiveAccountAddress()}} </a>
           </span>
           </div>
        </div>


  </div>

<div class="w-full lg:w-auto block lg:inline-block" v-for="item in navConfig.dropdowns" :key="item.title">
    <div class="px-10 py-4">
        <img class="inline-block mb-1 " width="48" height="48" src="/images/Discord-Logo-Color.png" />
    </div>
</div>



</nav>
</template>


<script>
import Web3NetButton from './Web3NetButton.vue'
import Config from '../config/UpperNav.js'
export default {
  name: 'UpperNav',
  props: ['web3Plug'  ],
  components:{Web3NetButton},
  data() {
    return {
      activeAccountAddress:null,
      activeNetworkId: null,
      navConfig: null
    }
  },
  created(){
    this.navConfig = Config;
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
          console.log('stateChanged',connectionState);
          this.activeAccountAddress = connectionState.activeAccountAddress
          this.activeNetworkId = connectionState.activeNetworkId
           this.$forceUpdate();
        }.bind(this));


  },
  methods: {

          connectToWeb3(){
            this.web3Plug.connectWeb3( )
          },
          getEtherscanBaseURL(){
              if(this.activeNetworkId == 42){
                return  'https://kovan.etherscan.io'
              }
              return 'https://etherscan.io'
          },
  }
}
</script>
