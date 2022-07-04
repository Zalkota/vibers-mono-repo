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



       </div>

   </section>
  <Footer/>
</div>
</template>

<script>


import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';


export default {
  name: 'Transactions',
  props: [],
  components: {Navbar, Footer},
  data() {
    return {
        transferEvents: null,
        tokenId: 22020,
        showSpinner: true,
        networkError: false,

    }
  },

  mounted: function () {

  },
  methods: {

      async getERC721Transfers() {
         let contractAddress = this.$route.params.contractAddress
         let userAddress = this.web3Modal.account
         let tokenId = this.tokenId

         let filterObject = {
             "contractAddress": contractAddress,
             "userAddress": userAddress,
             "tokenId": tokenId
         }

         try {
             this.showSpinner = true

             let result = await resolveRoutedApiQuery('ERC721TransfersByToken', filterObject )
             console.log('ERC721TransfersByToken', result.data, )

             if(result.data.success && result.data.data.length > 0){
                  this.transferEvents = result.data.transferEvents
                  console.log('Transfers Found', result.data.transferEvents)
             } else {
                 console.log("Transfers Not Found")
             }

         } catch (err) {
             console.error(err);
             // show error message
             this.networkError = true
         } finally {
             // hide spinner
             this.showSpinner = false
         }
      },

  }
}
</script>
