<template>
    <div class="text">
        <div class="title-container bg-transparent" v-if="canMint" >
                <div v-show="saleStatus" class="custom-number-input h-10 justify-center content-center text-center px-2">
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
                <div v-show="saleStatus">
                    <div v-if="web3Modal.active" class="text-center py-3 mb-0 font-medium text-xl">
                        {{ totalSupply }} / 10,000
                    </div>
                    <div v-else class="">
                        <br>
                    </div>
                </div>

                <div
                  class="
                    select-none
                    bg-two
                    hover:bg-green-400
                    shadow-md
                    hover:shadow-lg
                    sm:py-4
                    py-3
                    sm:px-8
                    px-4
                    text-md
                    sm:text-3xl
                    text-center
                    md:rounded-xl
                    rounded-md
                    font-bold
                    cursor-pointer
                  "
                  @click="mint"
                  v-show="saleStatus"
                >
                    <div class="text-black text-s inline">
                      Mint {{ mintCostDisplayAmount }} <span  style="font-family: sans-serif;">Ξ</span>
                    </div>
                </div>

                <div
                  class=""
                  v-show="!saleStatus"
                >
                    <div class="text-black text-s inline">
                      <Countdown
                      :endDate="endDate"
                      />
                    </div>
                </div>
                <div class="text-center my-4 color-four">
                    8,451 Vibers burning books near you
                </div>
            </div>

            <div class="text-white text-xs">
              {{ errorMessage }}
            </div>

            <div class="w-full lg:w-1/2 text-center p-8" v-if="!canMint">
              <div>
                <div class="text-white text-xl">
                  This collection has been completely minted!
                </div>
              </div>
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

//Web3Modal Wallets
import WalletConnectProvider from "@walletconnect/web3-provider";

export default {
  name: "Mint",
  props: [],
  components: {Countdown},
  data() {
    return {
      // SET MINT DATE
      endDate: new Date(2022, 4, 1, 10, 10, 10, 10),
      web3Plug: new Web3Plug(),
      signedInToWeb3: false,
      balances: {},
      totalSupply: 0,
      mintAmount: 1,
      errorMessage: null,
      saleStatus: false,
      nftContract: [],
      tokenId: 0,
      donationAmount: 0,
      userAddress: null,
      encodedMetadata:
        "data:application/json;base64,eyJuYW1lIjogIjB4QlRDIFN0YXRzICMwIiwgImRlc2NyaXB0aW9uIjogIk1pbmVhYmxlIHRva2VuIHN0YXRpc3RpY3MuIiwgImltYWdlIjogImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIQnlaWE5sY25abFFYTndaV04wVW1GMGFXODlJbmhOYVc1WlRXbHVJRzFsWlhRaUlIWnBaWGRDYjNnOUlqQWdNQ0F6TlRBZ016VXdJajQ4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTJjSGc3SUgwOEwzTjBlV3hsUGp4eVpXTjBJSGRwWkhSb1BTSXhNREFsSWlCb1pXbG5hSFE5SWpFd01DVWlJR1pwYkd3OUltSnNZV05ySWlBdlBqeDBaWGgwSUhnOUlqRXdJaUI1UFNJeU1DSWdZMnhoYzNNOUltSmhjMlVpUGkwdExTQXdlRUpVUXlCVGRHRjBjeUF0TFMwOEwzUmxlSFErUEhSbGVIUWdlRDBpTVRBaUlIazlJalF3SWlCamJHRnpjejBpWW1GelpTSStUV2x1WldRZ1UzVndjR3g1T2lBMU1EQXdQQzkwWlhoMFBqeDBaWGgwSUhnOUlqRXdJaUI1UFNJMk1DSWdZMnhoYzNNOUltSmhjMlVpUGsxcGJtbHVaeUJFYVdabWFXTjFiSFI1T2lBeFBDOTBaWGgwUGp4MFpYaDBJSGc5SWpFd0lpQjVQU0k0TUNJZ1kyeGhjM005SW1KaGMyVWlQazFwYm1sdVp5QlNaWGRoY21RNklEVXdQQzkwWlhoMFBqd3ZjM1puUGc9PSJ9",
      encodedImageSVG: null,
    };
  },

  created() {
    // this.getSaleStatus()
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
          // this.getSaleStatus()
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
        let answers = [0.66, 0.9, 1.26, 1.32, 1.62, 1.80, 1.86]

        if (numbers.includes(this.mintAmount)) {
            let position = numbers.indexOf(this.mintAmount);
            let cost = answers[position];
            return cost;
        } else {
            let cost = this.mintAmount * 0.06;
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

    getSaleStatus() {
      const now = new Date();
      if (this.web3Modal.active) {
          this.saleStatus = this.nftContract.hasSaleStarted();
      } else if (this.endDate > now.getTime()) {
              this.saleStatus = false
              console.log('sale is in the future')
      } else if (this.endDate <= now.getTime()) {
              this.saleStatus = true
              console.log('sale is in the past')
      }

      console.log('time', this.endDate.getTime(), now.getTime())
      console.log('getSaleStatus', this.saleStatus)
      },


    async getTotalSupply() {
        if (this.web3Modal.active) {
            const contractData = await this.web3Plug.getContractDataForActiveNetwork();
            const contractAddress = contractData.cosmiccaps_dev.address
            const abi = ERC721ABI
            this.$store.commit('setContract', {abi, contractAddress})
            this.nftContract = await this.web3Modal.contract
            console.log('nftContract call', this.nftContract)
            this.totalSupply = await this.nftContract.totalSupply();
            this.$forceUpdate();
        }
        this.getSaleStatus()
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

      // let ethValue = parseInt(amt) * 6 * 10000002000000000;
      // console.log("ethvalue:" + ethValue);
      // request contract address
      // let contractData = await this.web3Plug.getContractDataForActiveNetwork();

      const price = 0.06;
      const overrides = {
        value: (price * Math.pow(10, 18) * amt).toString(),
        gasLimit: Math.floor(
          200000 * amt - ((200000 * amt) / 100) * (amt - amt * 0.2)
        ).toString(),
      };
      // let ethBalance = await this.web3Plug.getETHBalance(this.userAddress);
      // console.log("ethBalance: " + ethBalance);

      let ethBalance = this.web3Modal.balance
      console.log('this.web3Modal.balance', this.web3Modal.balance)

      const contractData = await this.web3Plug.getContractDataForActiveNetwork();
      const contractAddress = contractData.cosmiccaps_dev.address
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
