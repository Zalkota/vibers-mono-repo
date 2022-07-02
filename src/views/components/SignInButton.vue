<template>

    <div class=" max-w-3xl mx-auto text-center shadow-md rounded-sm mx-auto mt-12 mb-64 rounded-2xl">
        <div class="bg-four font-bold text-2xl lg:text-4xl  text-white p-6 py-8 sm:px-6 lg:px-10 rounded-t-2xl">
             <h2 class="" style="font-family: Prompt;">Sign In Required</h2>
             <p class=" text-gray-500 text-lg font-thin pt-2">Sign the string to verify you are the owner of your wallet. <br> <a class="color-six" href="https://docs.metamask.io/guide/signing-data.html">Learn more</a> about signing data with MetaMask.     </p>
        </div>
        <div class="text-center container shadow-md bg-four  text-sm rounded-sm rounded-t-nonep-4 sm:px-8 py-10 mx-auto border-t border-gray-800 rounded-b-2xl">
            <div class="text-center max-w-sm mx-auto">
                <button v-if="approvalPending == false" class="button pushable font-bold inline text-lg text-gray-500 sm:text-3xl tracking-widest w-full" @click="signChallenge()">
                    <span class="mint-front">
                      Sign Message
                    </span>
                </button>
                <button v-if="approvalPending == true" class="px-12 bg-gray-500 cursor-default py-4 rounded-xl font-bold inline text-md text-gray-900 sm:text-2xl tracking-widest w-full">
                    <span class="">
                      Awaiting Approval..
                    </span>
                </button>
            </div>
        </div>
    </div>

</template>


<script>

// Web3Modal-Vue
const INFURA_ID = process.env.INFURA_ID
import web3utils from 'web3-utils'
import Web3ModalVue from "web3modal-vue";
import web3ModalStore from "../../store/modules/web3Modal.js";
import {web3Modal} from "../../js/mixins.js";
//Wallets
import WalletConnectProvider from "@walletconnect/web3-provider";
//degen auth
import {AuthTools} from 'degen-auth'
import {resolveRoutedApiQuery} from '../../js/rest-api-helper.ts'

import VueCookies from 'vue-cookies'


export default {
  name: 'SignInButton',
  props: ['userAddress'],
  components:{Web3ModalVue},
  data() {
    return {
      authToken: null,
      signature: null,
      approvalPending: false,
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



      emitAuthTokenEvent() {
          this.$emit('authTokenEvent', { authToken: this.authToken })
      },

      async handleAction(actionName){
          console.log('handle action',actionName)

          if(actionName == 'ping'){
              // generateUserSession

              let pingResponse = await resolveRoutedApiQuery('ping', 'ping')
              console.log('new order data ')

              if(pingResponse.success){

                 //get this from api call
                let pong = generateChallengeResponse.data.
                console.log("ping success", pong)

                //navigate to the order
                // routeTo(this.$router, {name: 'OrderCheckout'  , params: {orderId} }  )

              }

          }

          if(actionName == 'generateChallenge'){

              let publicAddress = this.userAddress
              let serviceName = "Vibers"

              let generateChallengeResponse = await resolveRoutedApiQuery('generateChallenge', {publicAddress: publicAddress, serviceName: serviceName} )

              if(generateChallengeResponse.success){

                let challenge = generateChallengeResponse.data.challenge
                console.log("challenge success", challenge)

                return challenge
              }

          }

          if(actionName == 'generateUserSession'){

              let publicAddress = this.userAddress
              let signature = this.signature

              let generateUserSessionResponse = await resolveRoutedApiQuery('generateUserSession', {publicAddress: publicAddress, signature: signature} )

              if(generateUserSessionResponse.success){

                return generateUserSessionResponse.data.authToken.authToken.token
                console.log("session generated, authToken=", generateUserSessionResponse.data.authToken.authToken.token)

              }
          }
      },

      async signChallenge() {
          this.approvalPending = true
          // let logger = new ethers.utils.Logger()
          let challenge = await this.handleAction('generateChallenge')


          // personal sign challenge in metamask
          const signer = await this.web3Modal.signer

          // await signer.signMessage(challenge)
          //   .catch(e => this.approvalPending = false)
          //   .then((x) => if(x != null) {this.approvalPending = false})

          try {
              this.signature = await signer.signMessage(challenge)
          } catch (e) {
              this.approvalPending = false
              console.log(e)
          }
          if (this.signature != null) {
               this.approvalPending = false
          }

          this.authToken = await this.handleAction('generateUserSession')
          // this.$store.commit('setAuthToken', this.authToken)
          window.$cookies.config('1d')
          window.$cookies.set("authToken", this.authToken)
          this.emitAuthTokenEvent()

      },





  }
}
</script>
