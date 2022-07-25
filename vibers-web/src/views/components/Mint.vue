<template>
    <div class="">

        <Loading
        v-show="getLoading == true"
        />

        <NetworkError
        v-show="networkError == true"
        />


        <div class="mb-4 lg:mb-0" v-if="getPublicSale == true && getLoading == false && networkError == false">
            <div class="sale-container bg-transparent">
                    <h1 class="color-six text-center tracking-wider text-4xl lg:text-6xl" style="text-shadow: 2px 2px #8789ED;">Rinkeby Public<br>  Mint is live!</h1>
                    <div class="border-4 rounded-xl shadow-lg p-4 mx-2" style="border: 4px solid #B3FFC6; background-color: #8789ED;">
                        <div v-if="!getTransactionPending">
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

                            <div class="text-center mx-auto whitespace-nowrap text-3xl lg:text-5xl px-4 w-full">
                                <button  class="button pushable font-bold inline mx-auto text-md sm:text-3xl tracking-widest w-full" @click="mint">
                                  <span class="mint-front">
                                    Mint {{ mintCostDisplayAmount }} <span  style="font-family: sans-serif;">Ξ</span>
                                  </span>
                                </button>
                            </div>
                        </div>
                        <div v-if="getTransactionPending" class="text-center">
                            <img
                            src="@/assets/gifs/rolling.gif"
                            alt="waiting for transaction"
                            class="mx-auto w-20 my-6 mx-20"/>
                            <p class="text-gray-200 text-md font-medium mt-2">
                                <a v-bind:href="transactionHashURL" target="_blank" class="text-gray-200 text-md font-medium mt-2 no-underline tracking-wide"> View <span class="color-six font-bold ">Transaction</span>.</a>
                            </p>

                        </div>
                    </div>
                    <div class="mx-auto text-center my-6">
                        <p class="text-gray-200 text-md font-medium mt-2" style="text-shadow: 2px 2px #8789ED;">
                            <a v-bind:href="'https://rinkeby.etherscan.io/address/' + contractAddress" target="_blank" class="text-gray-200 text-md font-medium mt-2 no-underline tracking-wide"> View the <span class="color-six font-bold ">Vibers contract</span>.</a>
                        </p>

                        <div class="my-6">
                            <router-link to="/allowlist" class='no-underline' >
                                <p class="text-gray-200 text-md font-medium mt-2 tracking-wide" style="text-shadow: 2px 2px #8789ED;">Mint via the <span class="color-six font-bold">Allowlist</span></p>
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
        <div class="text" v-if="!getPublicSale && getLoading == false && networkError == false">
            <div class="title-container bg-transparent" >
                <div
                  class=""
                >
                    <div class="text-black text-s inline">
                      <Countdown
                      />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>

import Countdown from "./Countdown.vue";
import NetworkError from './NetworkError.vue';
import Loading from './Loading.vue';

import {resolveRoutedApiQuery} from '../../js/rest-api-helper.ts'
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
import {messages} from "../../js/mixins.js";
import messageStore from "../../store/modules/messages.js";

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
      nftContract: [],
      tokenId: 0,
      userAddress: null,
      approvalPending: false,
      networkError: false,
      contractAddress: null,
      transactionPending: false,
      transactionHash: null,
    };
  },

  created() {

  },
  mounted: function () {

  },

  computed: {

      transactionHashURL() {
          if (this.transactionHash != null) {
              let url = 'https://rinkeby.etherscan.io/tx/' + this.transactionHash.hash
              return url
          }
      },

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

    getTransactionPending() {
        return this.$store.getters.getTransactionPending
    },

    getNFTContract() {
        return this.$store.getters.getNFTContract
    },

    getPublicSale() {
        return this.$store.getters.getPublicSale
    },

    getTotalSupply() {
        return this.$store.getters.getTotalSupply
    },

    getEthBalance() {
        return this.$store.getters.getEthBalance
    },

    getLoading() {
        return this.$store.getters.getLoading
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

      let price = 0.01;
      let overrides = {
        value: (price * Math.pow(10, 18) * amt).toString(),
        gasLimit: Math.floor(
          200000 * amt - ((200000 * amt) / 100) * (amt - amt * 0.20)
        ).toString(),
      };
      let nftContract = this.getNFTContract
      let userBalance = this.getUserBalance()


      if (userBalance >= price * this.mintAmount) {
          try {

              let transactionHash = await nftContract.mint(amt, overrides)
              if (transactionHash != null) {
                  console.log("transactionHash", transactionHash)
                  this.transactionHash = transactionHash
                  await this.requestTransaction(transactionHash.from, '0x0000000000000000000000000000000000000000', transactionHash.to)

              }
          } catch (err) {
              console.error(err)
          }
      } else {
          console.error("Insufficient Funds in wallet!")
      }
    },

    getUserBalance() {
            let balance = this.web3Plug.rawAmountToFormatted(this.web3Modal.balance, 18)
            return balance
    },

    async getERC721TransfersByAddress(to, from, contractAddress) {
        let query = {
         "to": to,
         "from": from,
         "contractAddress": contractAddress
        }
        try {
             let result = await resolveRoutedApiQuery('ERC721TransfersByAddress', query )
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
        let timeStamp = new Date().getTime()
        console.log("timestamp of transaction: ", timeStamp)
        let counter = 0;
        while (counter < 300) {
            this.$store.commit('setTransactionPending', true)
            let result = await this.getERC721TransfersByAddress(to, from, contractAddress)
            counter++
            if (result.success == true && result.data.length > 0 && result.data[0].createdAt > timeStamp) {
              this.$store.commit('setTransactionPending', false)
              this.transferEvents = result.data
              console.log('Transfers Found', this.transferEvents)
              break
            }

        await this.delay(1000)
      } this.$store.commit('setTransactionPending', false)
      this.approvalPending = false
    }

  },
};
</script>
