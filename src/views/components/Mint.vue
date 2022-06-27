<template>
    <div class="">

        <Loading
        v-show="showSpinner == true"
        />

        <NetworkError
        v-show="networkError == true"
        />

        <div class="mb-4 lg:mb-0" v-if="saleStatus && showSpinner == false && networkError == false">
            <div class="sale-container bg-transparent">
                    <h1 class="color-six text-center tracking-wider text-4xl lg:text-6xl" style="text-shadow: 2px 2px #8789ED;">Rinkeby <br>  Mint is live!</h1>
                    <div class="border-4 rounded-xl shadow-lg p-4 mx-2" style="border: 4px solid #B3FFC6; background-color: #8789ED;">
                        <div class="custom-number-input h-10 justify-center content-center text-center px-2">
                              <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-2">
                                <button v-on:click="decrementMint" class=" bg-transparent text-white text-3xl h-full w-20 rounded-l cursor-pointer outline-none">
                                    <span class="text-3xl font-bold" style="font-family: sans-serif;">-</span>
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  max="16"
                                  v-model="mintAmount"
                                  class="outline-none focus:outline-none text-center w-full bg-transparent font-bold text-lg sm:text-3xl hover:text-gray-300 focus:text-gray-300  md:text-basecursor-default flex items-center text-white outline-none "></input>
                                <button v-on:click="incrementMint" data-action="increment" class="bg-transparent text-white h-full w-20 rounded-r cursor-pointer">
                                    <span class="text-3xl font-bold" style="font-family: sans-serif;">+</span>
                              </button>
                            </div>
                        </div>
                        <div>
                            <div v-if="false" class="text-center text-white py-3 mb-0 font-medium text-xl">
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
                    <div class="mx-auto text-center my-6">
                        <p class="text-gray-200 text-md font-medium mt-2" style="text-shadow: 2px 2px #8789ED;">
                            <a v-bind:href="'https://rinkeby.etherscan.io/address/' + contractAddress" target="_blank" class="text-gray-200 text-md font-medium mt-2 no-underline"> View the <span class="color-six font-bold ">Vibers contract</span>.</a>
                        </p>

                        <div class="my-6">
                            <router-link to="/allowlist" class='no-underline' >
                                <p class="text-gray-200 text-md font-medium mt-2" style="text-shadow: 2px 2px #8789ED;">Mint via the <span class="color-six font-bold">Allowlist</span></p>
                            </router-link>
                        </div>
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
        <div class="text" v-if="!saleStatus && showSpinner == false && networkError == false">
            <div class="title-container bg-transparent" >
                <div
                  class=""
                >
                    <div class="text-black text-s inline">
                      <Countdown
                      :endDate="endDate"
                      />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>

// Import Components
import Countdown from "./Countdown.vue";
import NetworkError from './NetworkError.vue';
import Loading from './Loading.vue';
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

//Web3Modal Wallets
import WalletConnectProvider from "@walletconnect/web3-provider";

export default {
  name: "Mint",
  props: [],
  components: {Countdown, NetworkError, Loading},
  data() {
    return {
      // SET MINT DATE
      web3Plug: new Web3Plug(),
      signedInToWeb3: false,
      balances: {},
      mintAmount: 1,
      errorMessage: null,
      saleStatus: false,
      nftContract: [],
      tokenId: 0,
      userAddress: null,
      showSpinner: true,
      networkError: false,
      contractAddress: null,
    };
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
      let subscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'setActive' && mutation.payload == true) {
          this.setActiveContract()
          subscribe()
      }
      if (mutation.type == 'setContract' && mutation.payload == true) {
          this.getSaleStatus()
          subscribe()
      }
    })

    this.getSaleStatus()
    setInterval(this.getSaleStatus.bind(this), 5000);
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
            let cost = this.mintAmount * 0.01;
            return cost;
        }

    },

    getNFTContract() {
        console.log("this.$store.getters.getNFTContract", this.$store.getters.getNFTContract)
        return this.$store.getters.getNFTContract
    },

    getSaleReleaseDate() {
        return this.$store.getters.getSaleReleaseDate
    },

    getTotalSupply() {
        return this.$store.getters.getTotalSupply
    },
  },
  mixins: [web3Modal],
  methods: {


    canMint() {
      return this.getTotalSupply >= 9999;
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

    async setActiveContract() {
        const contractData = await this.web3Plug.getContractDataForActiveNetwork();
        this.activeNetwork = contractData
        this.contractAddress = contractData.vibers.address
        let contractAddress = this.contractAddress
        let abi = ERC721ABI
        this.$store.dispatch("setContract", {abi, contractAddress});
    },

    async getSaleStatus() {
      const now = new Date();
      if (this.web3Modal.active) {
          let nftContract = this.getNFTContract
          try {
              this.saleStatus = await nftContract.hasSaleStarted();
          } catch (err) {
              console.error(err);
              this.networkError = true
          } finally {
              this.showSpinner = false
          }
          console.log('has the sale started?', this.saleStatus)
      } else if (this.getSaleReleaseDate > now.getTime()) {
              this.saleStatus = false
              console.log('sale is in the future')
      } else if (this.getSaleReleaseDate <= now.getTime()) {
              this.saleStatus = true
              console.log('sale started in the past')
      }
      },


    async mint() {
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

      const price = 0.01;
      const overrides = {
        value: (price * Math.pow(10, 18) * amt).toString(),
        gasLimit: Math.floor(
          200000 * amt - ((200000 * amt) / 100) * (amt - amt * 0.20)
        ).toString(),
      };

      const contractData = await this.web3Plug.getContractDataForActiveNetwork();
      this.contractAddress = contractData.vibers.address
      let contractAddress = this.contractAddress
      const abi = ERC721ABI

      this.$store.commit('setContract', {abi, contractAddress})
      const nftContract = await this.web3Modal.contract

      await nftContract.mint(amt, overrides)
    },



    async getBalances() {
      /*
            const smasherAddress = '0xbf3122b2aa3102693e3194df7870e1a7ae146b50'

            const currencyAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' //WETH9

            const currencyContract = this.web3Plug.getTokenContract( currencyAddress )

            let wethBalanceRaw = await currencyContract.methods.balanceOf( smasherAddress ).call()

            this.balances['WETH'] = this.web3Plug.rawAmountToFormatted(wethBalanceRaw, 18)

            console.log(' this.balances',  this.balances)

            this.$forceUpdate()
*/
    },

  },
};
</script>
