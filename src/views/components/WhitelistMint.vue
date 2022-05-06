<template>
    <div class="">
        <div class="mb-4 lg:mb-0">
            <div class="">
                <button class="button pushable font-bold inline mx-auto text-md sm:text-3xl tracking-widest w-full" @click="signChallenge">
                  <span class="mint-front">
                    signChallenge
                  </span>
                </button>
            </div>
            <div class="sale-container bg-transparent" v-if="whitelistSaleStatus">
                    <h1 class="text-white tracking-wider text-4xl lg:text-6xl">Minting Is Live!</h1>
                    <div class="border-4 rounded-xl shadow-lg p-4 mx-2" style="border: 2px solid #B3FFC6;">
                        <div class="custom-number-input h-10 justify-center content-center text-center px-2">
                              <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-2">
                                <button v-on:click="decrementMint" class=" bg-transparent text-white text-3xl h-full w-20 rounded-l cursor-pointer outline-none">
                                    <span class="text-3xl font-bold">-</span>
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  max="16"
                                  v-model="mintAmount"
                                  class="outline-none focus:outline-none text-center w-full bg-transparent font-bold text-lg sm:text-3xl hover:text-gray-300 focus:text-gray-300  md:text-basecursor-default flex items-center text-white outline-none "></input>
                                <button v-on:click="incrementMint" data-action="increment" class="bg-transparent text-white h-full w-20 rounded-r cursor-pointer">
                                    <span class="text-3xl font-bold">+</span>
                              </button>
                            </div>
                        </div>
                        <div>
                            <div v-if="web3Modal.active" class="text-center text-white py-3 mb-0 font-medium text-xl">
                                {{ totalSupply }} / 10,000
                            </div>
                            <div v-else class="">
                                <br>
                            </div>
                        </div>

                        <div class="text-center mx-auto whitespace-nowrap text-3xl lg:text-5xl pr-2 px-4 w-full" style="border-color: #A9ECE3;">
                            <button class="button pushable font-bold inline mx-auto text-md sm:text-3xl tracking-widest w-full" @click="mint">
                              <span class="mint-front">
                                Mint {{ mintCostDisplayAmount }} <span  style="font-family: sans-serif;">Ξ</span>
                              </span>
                            </button>
                        </div>
                    </div>
                    <div class="mx-auto text-center">
                        <p class="text-gray-200 text-md font-thin mt-2">View the <a v-bind:href="'https://etherscan.io/address/' + contractAddress" target="_blank" class="color-six font-medium">Vibers contract</a>.</p>
                    </div>

                    <div class="w-full lg:w-1/2 text-center p-8" v-if="!canMint">
                      <div>
                        <div class="text-white text-xl">
                          This collection has been completely minted!
                        </div>
                      </div>
                    </div>

                    <div class="text-white text-xs">
                      {{ errorMessage }}
                    </div>
            </div>

        </div>
        <div class="text" v-if="whitelistSaleStatus">

        </div>
    </div>
</template>


<script>

// Import Components
import Countdown from "./Countdown.vue";

import FrontendHelper from "../../js/frontend-helper.js";
const ERC721ABI = require("../../contracts/ERC721ABI.json");

// Web3 Module
import Web3Plug from "../../js/web3-plug.js";
import web3utils from 'web3-utils'
// Web3Modal-Vue
import {getLibrary} from "../../js/web3";
import {ethers} from "ethers";
import {parseInt} from 'lodash'
import Web3ModalVue from "web3modal-vue";
import web3ModalStore from "../../store/modules/web3Modal.js";
import {web3Modal} from "../../js/mixins.js";
import { Contract } from "@ethersproject/contracts";
import { Web3Provider } from "@ethersproject/providers";

//degen auth
import {AuthTools} from 'degen-auth'



//give the authtoken to the user so they store it in their LocalStorage to use for authenticated API requests

//Web3Modal Wallets
import WalletConnectProvider from "@walletconnect/web3-provider";

export default {
  name: "Mint",
  props: [],
  components: {Countdown},
  data() {
    return {
      // SET MINT DATE
      endDate: new Date(2022, 4, 1, 10, 10, 10, 10), // month behind 4 = may
      web3Plug: new Web3Plug(),
      signedInToWeb3: false,
      balances: {},
      totalSupply: 0,
      mintAmount: 1,
      errorMessage: null,
      whitelistSaleStatus: false,
      nftContract: [],
      tokenId: 0,
      donationAmount: 0,
      userAddress: null,

      contractAddress: null,
      activeNetwork: null,
      encodedMetadata:
        "data:application/json;base64,eyJuYW1lIjogIjB4QlRDIFN0YXRzICMwIiwgImRlc2NyaXB0aW9uIjogIk1pbmVhYmxlIHRva2VuIHN0YXRpc3RpY3MuIiwgImltYWdlIjogImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIQnlaWE5sY25abFFYTndaV04wVW1GMGFXODlJbmhOYVc1WlRXbHVJRzFsWlhRaUlIWnBaWGRDYjNnOUlqQWdNQ0F6TlRBZ016VXdJajQ4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTJjSGc3SUgwOEwzTjBlV3hsUGp4eVpXTjBJSGRwWkhSb1BTSXhNREFsSWlCb1pXbG5hSFE5SWpFd01DVWlJR1pwYkd3OUltSnNZV05ySWlBdlBqeDBaWGgwSUhnOUlqRXdJaUI1UFNJeU1DSWdZMnhoYzNNOUltSmhjMlVpUGkwdExTQXdlRUpVUXlCVGRHRjBjeUF0TFMwOEwzUmxlSFErUEhSbGVIUWdlRDBpTVRBaUlIazlJalF3SWlCamJHRnpjejBpWW1GelpTSStUV2x1WldRZ1UzVndjR3g1T2lBMU1EQXdQQzkwWlhoMFBqeDBaWGgwSUhnOUlqRXdJaUI1UFNJMk1DSWdZMnhoYzNNOUltSmhjMlVpUGsxcGJtbHVaeUJFYVdabWFXTjFiSFI1T2lBeFBDOTBaWGgwUGp4MFpYaDBJSGc5SWpFd0lpQjVQU0k0TUNJZ1kyeGhjM005SW1KaGMyVWlQazFwYm1sdVp5QlNaWGRoY21RNklEVXdQQzkwWlhoMFBqd3ZjM1puUGc9PSJ9",
      encodedImageSVG: null,
    };
  },

  created() {
    // this.getwhitelistSaleStatus()
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
      let suscribe = this.$store.subscribe((mutation, state) => {
      console.log(mutation.type)
      console.log(mutation.payload)
      if (mutation.type == 'setActive' && mutation.payload == true) {
          // this.getwhitelistSaleStatus()
          this.getTotalSupply();
          suscribe()
      }
    })
    this.getTotalSupply();
    //
    setInterval(this.getTotalSupply.bind(this), 5000);
  },

  computed: {
      mintCostDisplayAmount: function(){
        let numbers = [11, 15, 21, 22, 27, 30, 31]
        let answers = [0.33, 0.45, 0.63, 0.66, 0.81, 0.9, 0.93]

        if (numbers.includes(this.mintAmount)) {
            let position = numbers.indexOf(this.mintAmount);
            let cost = answers[position];
            return cost;
        } else {
            let cost = this.mintAmount * 0.03;
            return cost;
        }

      }
  },
  mixins: [web3Modal],
  methods: {

    async signChallenge() {
        let degenAuthInterface = await AuthTools.initializeDatabase()

        publicAddress = this.userAddress;
        serviceName = "Vibers"
        let challenge = await AuthTools.upsertNewChallengeForAccount(degenAuthInterface,publicAddress, serviceName)

        // personal sign challenge in metamask
        const signer = await this.web3Modal.signer
        console.log('signer', signer)

        let signature = userWallet.signMessage(challenge)

        let authtoken = await AuthTools.generateAuthenticatedSession(degenAuthInterface,publicAddress, signature)
    },


    canMint() {
      return this.totalSupply >= 9999;
    },

    async incrementMint() {
        if (this.mintAmount < 32) {
            this.mintAmount++;
        }
    },

    async decrementMint() {
        if (this.mintAmount > 1) {
            this.mintAmount--;
        }
    },

    async getwhitelistSaleStatus() {
      const now = new Date();
      if (this.web3Modal.active) {
          this.whitelistSaleStatus = await this.nftContract.hasSaleStarted();
          console.log('has the sale started?', this.whitelistSaleStatus)
      } else if (this.endDate > now.getTime()) {
              this.whitelistSaleStatus = false
              console.log('sale is in the future')
      } else if (this.endDate <= now.getTime()) {
              this.whitelistSaleStatus = true
              console.log('sale started is in the past')
      }

      console.log('time', this.endDate.getTime(), now.getTime())
      console.log('getwhitelistSaleStatus', this.whitelistSaleStatus)
      },


    async getTotalSupply() {
        if (this.web3Modal.active) {
            const contractData = await this.web3Plug.getContractDataForActiveNetwork();
            this.activeNetwork = contractData
            this.contractAddress = contractData.vibers.address
            let contractAddress = this.contractAddress
            const abi = ERC721ABI
            this.$store.commit('setContract', {abi, contractAddress})
            this.nftContract = await this.web3Modal.contract
            console.log('nftContract call', this.nftContract)
            this.totalSupply = await this.nftContract.totalSupply();
            this.$forceUpdate();
        }
        this.getwhitelistSaleStatus()
    },


    async whitelistMint() {
      console.log("calling mint");

      if (!this.web3Modal.active) {
        this.$store.dispatch('connect')
        return;
      }

      this.userAddress = this.web3Modal.account;
      console.log("Mint: userAddress:" + this.web3Modal.account);
      // this.userAddress = web3utils.toChecksumAddress(this.userAddress)

      let amt = this.mintAmount.toString();
      console.log("mintAmount:" + this.mintAmount);

      if (parseInt(amt) > 16) {
        this.errorMessage = "You may only mint up to 16 at once. ";
        return;
      }
      this.errorMessage = null;

      // let ethValue = parseInt(amt) * 6 * 10000002000000000;
      // console.log("ethvalue:" + ethValue);
      // request contract address
      // let contractData = await this.web3Plug.getContractDataForActiveNetwork();

      const price = 0.01;
      const overrides = {
        value: (price * Math.pow(10, 18) * amt).toString(),
        gasLimit: Math.floor(
          200000 * amt - ((200000 * amt) / 100) * (amt - amt * 0.21)
        ).toString(),
      };
      // let ethBalance = await this.web3Plug.getETHBalance(this.userAddress);
      // console.log("ethBalance: " + ethBalance);

      let ethBalance = this.web3Modal.balance
      console.log('this.web3Modal.balance', this.web3Modal.balance)

      const contractData = await this.web3Plug.getContractDataForActiveNetwork();
      this.contractAddress = contractData.vibers.address
      let contractAddress = this.contractAddress
      const abi = ERC721ABI
      // const provider = ethers.getDefaultProvider();
      // console.log('provider', provider)
      // let signer = new Web3Provider(provider).getSigner()
      // request contract methods using ERC721ABI file and contract address

      this.$store.commit('setContract', {abi, contractAddress})
      const nftContract = await this.web3Modal.contract

      // let nftContract = nftContract.connect(this.web3Modal.signer)

      await nftContract.mint(this.userAddress, amt, overrides)
      console.log("calling mint", nftContract);
      // await nftContract.methods.mint(userAddress, amt).send({from: userAddress, value: ethValue});
      // this.totalSupply = this.getTotalSupply();
    },

  },
};
</script>
