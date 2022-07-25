<template>
    <div class="">
        <div class="mb-4 lg:mb-0">
            <div class="sale-container bg-transparent">
                    <h1 class="color-six text-center tracking-wider text-4xl lg:text-6xl " style="text-shadow: 2px 2px #8789ED;">Rinkeby Allowlist<br> Mint is live!</h1>
                    <div class="border-4 rounded-xl shadow-lg p-4 mx-2 max-w-md mx-auto" style="border: 4px solid #B3FFC6; background-color: #8789ED;">
                        <div v-if="!approvalPending">
                            <div class="custom-number-input h-10 justify-center content-center text-center px-2 ">
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
                            <div class="text-center mx-auto whitespace-nowrap text-3xl lg:text-5xl pr-2 px-4 mt-4 w-full" style="border-color: #A9ECE3;">
                                <button class="button pushable font-bold inline mx-auto text-md sm:text-3xl tracking-widest w-full" @click="allowListMint()">
                                  <span class="mint-front">
                                    Mint {{ mintCostDisplayAmount }} <span  style="font-family: sans-serif;">Ξ</span>
                                  </span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <img
                            v-if="approvalPending"
                            src="@/assets/gifs/rolling.gif"
                            alt="waiting for transaction"
                            class="mx-auto w-20 my-6 mx-20"/>
                        </div>
                    </div>
                    <div class="mx-auto text-center">
                        <p class="text-gray-200 text-md font-medium my-8" style="text-shadow: 2px 2px #8789ED;">
                            <a v-bind:href="'https://rinkeby.etherscan.io/address/' + contractAddress" target="_blank" class="text-gray-200 text-md font-medium mt-2 no-underline"> View the <span class="color-six font-bold ">Vibers contract</span>.</a>
                        </p>
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
    </div>
</template>


<script>

// Import Components
import Countdown from "./Countdown.vue";
import NetworkError from './NetworkError.vue';
import Loading from './Loading.vue';

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
import {resolveRoutedApiQuery} from '../../js/rest-api-helper.ts'

//merkle tree mint
// const addressList = require( '../../config/AllowList.json'  )
import addressList from '../../config/AllowList.json';
// import {keccak256} from "keccak256";
const keccak256 = require('keccak256')
// import {MerkleTree} from "merkletreejs";
const { MerkleTree } = require('merkletreejs')

const ERC721ABI = require("../../contracts/ERC721ABI.json");

//give the authtoken to the user so they store it in their LocalStorage to use for authenticated API requests

//Web3Modal Wallets
import WalletConnectProvider from "@walletconnect/web3-provider";

export default {
  name: "Mint",
  props: ["authToken", "whitelistSaleStatus", "Loading", "NetworkError"],
  components: {Countdown},
  data() {
    return {
      totalSupply: 0,
      mintAmount: 1,
      errorMessage: null,
      contractAddress: null,
      showSpinner: false,
      networkError: false,
      userAddress: null,
      approvalPending: false,
    };
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

    },
    getNFTContract() {
        return this.$store.getters.getNFTContract
    },
  },
  mixins: [web3Modal],
  methods: {

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


    async calculateMerkleTreeProof(userAddress) {
        let leaves = addressList.map((x) => keccak256(x))
        let tree = new MerkleTree(leaves, keccak256, {sortPairs: true})
        let root = tree.getRoot().toString('hex')
        let hexRoot = tree.getHexRoot()

        let leaf = keccak256(userAddress)
        let proof = tree.getProof(leaf)
        let hexproof = tree.getHexProof(leaf)

        console.log("tree verify", tree.verify(proof, leaf, root))
        if (tree.verify(proof, leaf, root)) {
            return hexproof
        } return false
    },


    async allowListMint() {
      console.log("Calling allowListmint");

      if (!this.web3Modal.active) {
        this.$store.dispatch('connect')
        return;
      }

      let userAddress = this.web3Modal.account;

      let amt = this.mintAmount.toString();

      if (parseInt(amt) > 16) {
        this.errorMessage = "You may only mint up to 16 at once. ";
        return;
      }
      this.errorMessage = null;

      let price = 0.01;
      const overrides = {
        value: (price * Math.pow(10, 18) * amt).toString(),
        gasLimit: Math.floor(
          200000 * amt - ((200000 * amt) / 100) * (amt - amt * 0.20)
        ).toString(),
      };

      let hexProof = await this.calculateMerkleTreeProof(userAddress)

      if(hexProof != false){
          this.showSpinner = true

          let nftContract = this.getNFTContract

          let hexProof = await this.calculateMerkleTreeProof(userAddress)

          try {
              this.approvalPending = true
              await nftContract.whitelistMint(amt, hexProof, overrides);
          } catch (e) {
              this.approvalPending = false
              console.log(e)
          }

          console.log("executing allowlist mint method on", nftContract, 'with hexProof equal to: ', hexProof);
      } else {
          let message = 'Failed to verify MerkleTree proof!'
          new Error(message)
          console.error(message)
      }
    },
  },
};
</script>
