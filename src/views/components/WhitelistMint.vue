<template>
    <div class="">
        <div class="mb-4 lg:mb-0">
            <div class="sale-container bg-transparent">
                    <h1 class="color-six text-center tracking-wider text-4xl lg:text-6xl " style="text-shadow: 2px 2px #8789ED;">Rinkeby Allowlist<br> Mint is live!</h1>
                    <div class="border-4 rounded-xl shadow-lg p-4 mx-2 max-w-md mx-auto" style="border: 4px solid #B3FFC6; background-color: #8789ED;">
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
                        <div>
                            <!-- <div v-if="web3Modal.active" class="text-center text-white py-3 mb-0 font-medium text-xl">
                                {{ totalSupply }} / 10,000
                            </div>
                            <div v-else class="">
                                <br>
                            </div> -->
                        </div>

                        <div class="text-center mx-auto whitespace-nowrap text-3xl lg:text-5xl pr-2 px-4 w-full" style="border-color: #A9ECE3;">
                            <button class="button pushable font-bold inline mx-auto text-md sm:text-3xl tracking-widest w-full" @click="allowListMint()">
                              <span class="mint-front">
                                Mint {{ mintCostDisplayAmount }} <span  style="font-family: sans-serif;">Ξ</span>
                              </span>
                            </button>
                        </div>
                    </div>
                    <div class="mx-auto text-center">
                        <p class="text-gray-200 text-md font-medium my-8" style="text-shadow: 2px 2px #8789ED;">
                            <a v-bind:href="'https://etherscan.io/address/' + contractAddress" target="_blank" class="text-gray-200 text-md font-medium mt-2 no-underline"> View the <span class="color-six font-bold ">Vibers contract</span>.</a>
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
      web3Plug: new Web3Plug(),
      signedInToWeb3: false,
      balances: {},
      totalSupply: 0,
      mintAmount: 1,
      errorMessage: null,
      contractAddress: null,

      showSpinner: false,
      networkError: false,

      tokenId: 0,
      donationAmount: 0,
      userAddress: null,
      signature: null,


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

        console.log('hexRoot root is ', hexRoot)

        let leaf = keccak256(userAddress)
        let proof = tree.getProof(leaf)
        let hexproof = tree.getHexProof(leaf)

        console.log("tree verify", tree.verify(proof, leaf, root)) // true
        return hexproof


    },


    async getContract() {
        let contractData = await this.web3Plug.getContractDataForActiveNetwork();
        this.contractAddress = contractData.vibers.address
        let contractAddress = this.contractAddress

        let abi = ERC721ABI

        this.$store.commit('setContract', {abi, contractAddress})
        let nftContract = await this.web3Modal.contract

        return nftContract
    },


    async allowListMint() {
      console.log("calling mint");

      if (!this.web3Modal.active) {
        this.$store.dispatch('connect')
        return;
      }

      this.userAddress = this.web3Modal.account;
      console.log("Mint: userAddress:" + this.web3Modal.account);

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
          200000 * amt - ((200000 * amt) / 100) * (amt - amt * 0.5)
        ).toString(),
      };

      let ethBalance = this.web3Modal.balance
      console.log('this.web3Modal.balance', this.web3Modal.balance)


      try {
          this.showSpinner = true

          let nftContract = await this.getContract()

          let hexProof = await this.calculateMerkleTreeProof(this.userAddress)

          await nftContract.whitelistMint(this.userAddress, amt, hexProof, overrides)

          // await airdropTokenContract.connect(user).mintWithProof( hexproof );
          // let tokenBalance = await airdropTokenContract.connect(user).balanceOf(  userAddress  )

          console.log("executing allowlist mint method on", nftContract);

      } catch (err) {
            console.error(err);
            // show error message
            this.networkError = true
        } finally {
            // hide spinner
            this.showSpinner = false
        }

    },

  },
};
</script>
