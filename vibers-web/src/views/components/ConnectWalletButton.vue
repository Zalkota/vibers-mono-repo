<template>
    <div class=" max-w-3xl mx-auto text-center shadow-md rounded-sm mx-auto mt-12 mb-64">
      <div class="bg-four font-bold text-2xl lg:text-4xl  text-white p-6 py-8 sm:px-6 lg:px-10 rounded-t-2xl">
         <h2 class="" style="font-family: Prompt;">Connect Your Wallet</h2>
         <p class="text-gray-500 text-lg font-thin pt-2">Connect your wallet with the available wallet providers.</p>
      </div>
      <div class="text-center container shadow-md bg-four text-gray-500 text-sm rounded-sm p-4 sm:px-8 py-10 border-t border-gray-800 rounded-b-2xl">
          <div class="text-center max-w-sm mx-auto">
              <button class="button pushable font-bold inline text-lg sm:text-3xl tracking-widest w-full " @click="connect()">
                  <span class="mint-front">
                    Connect
                  </span>
              </button>
          </div>

      </div>
    </div>

</template>


<script>

// Web3Modal-Vue
const INFURA_ID = process.env.INFURA_ID
import Web3ModalVue from "web3modal-vue";
import web3ModalStore from "../../store/modules/web3Modal.js";
import {web3Modal} from "../../js/mixins.js";
//Wallets
import WalletConnectProvider from "@walletconnect/web3-provider";



export default {
  name: 'ConnectWalletButton',
  props: [],
  components:{Web3ModalVue},
  data() {
    return {
      activeAccountAddress:null,
      activeNetworkId: null,
      navConfig: null,
      theme: 'light',
      // route: this.$route,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: INFURA_ID,
          }
        }
      },
    }
  },
  mixins: [web3Modal],
  created(){

  },

  mounted: function () {

  },
  methods: {

    connect() {
        this.$store.dispatch('connect')
    },


  }
}
</script>
