<template>
<div>
   <div class="section px-0 lg:px-1">
        <Navbar
       />
   </div>

   <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-">
       <div class="text-center pb-2 mt-10">
           <span class="text-3xl color-five font-bold bg-six px-4 py-1">Known Origin - XCOPY</span>
           <h1 class="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-black-800 mt-0 pt-0">
               Transaction History
           </h1>

           <div class="">
               {{ transferEvents }} {{ tokenId }}
           </div>

           <button class="button" v-on:click="requestTransaction('0x9787b715a9Ea9Ef26be9c03bb49664e357e279c9', tokenId, $route.params.contractAddress)">
               Button
           </button>

           <TransactionPending
           v-if="transactionPending"/>

       </div>

   </section>
  <Footer/>
</div>
</template>

<script>


import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import TransactionPending from './components/TransactionPending.vue';
const INFURA_ID = process.env.INFURA_ID
import Web3ModalVue from "web3modal-vue";
import web3ModalStore from "../store/modules/web3Modal.js";
import {web3Modal} from "../js/mixins.js";
import {resolveRoutedApiQuery} from '../js/rest-api-helper.ts'

export default {
    name: 'Transactions',
    props: [],
    components: {Navbar, Footer, TransactionPending},
    data() {
        return {
            transferEvents: null,
            tokenId: 10104,
            showSpinner: true,
            networkError: false,
            transactionPending: false,

        }
    },

    mounted: function () {
        // this.getERC721Transfers(this.tokenId, this.$route.params.contractAddress)
    },
    mixins: [web3Modal],
    methods: {
        async getERC721Transfers(to, from, contractAddress) {
            let filterObject = {
             "contractAddress": contractAddress,
             "to": this.useraddress,
             "from": '0x0000000000000000000000000000000000000000'
            }
            try {
                 let result = await resolveRoutedApiQuery('ERC721TransfersByToken', filterObject )
                 if(result.success){
                      return result
                 }
            } catch (err) {
                    console.error(err);
                    this.networkError = true
            }
        },

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        },

        async requestTransaction(to, from, contractAddress) {
            let counter = 0;
            while (counter < 300) {
                let result = await this.getERC721Transfers(to, from, contractAddress)
                counter++
                this.transactionPending = true
                if (result.success == true && result.data.length > 0) {
                  this.transactionPending = false
                  this.transferEvents = result.data
                  console.log('Transfers Found', this.transferEvents)
                  break
                }

            await this.delay(1000)
          }
        }

    }
}
</script>
