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
                    8,451 DystoSkulls burning books near you
                    <svg width="25" height="25" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.72343 11.1371C9.56757 12.7996 9.4582 15.7418 10.4398 16.9942C10.4398 16.9942 9.97773 13.7621 14.1203 9.70705C15.7883 8.07463 16.1738 5.85432 15.5914 4.18908C15.2605 3.24572 14.6562 2.46642 14.1312 1.92228C13.825 1.60236 14.0602 1.07463 14.5059 1.09377C17.2019 1.21408 21.5715 1.9633 23.4281 6.62267C24.243 8.66799 24.3031 10.7817 23.9148 12.9309C23.6687 14.3035 22.7937 17.3551 24.7898 17.7297C26.2144 17.9977 26.9035 16.8656 27.2125 16.0508C27.341 15.7117 27.7867 15.627 28.0273 15.8977C30.4336 18.6348 30.6387 21.8586 30.141 24.634C29.1785 29.9988 23.7453 33.9035 18.3477 33.9035C11.6047 33.9035 6.2371 30.0453 4.84531 23.0617C4.28476 20.2426 4.56914 14.6645 8.91679 10.727C9.23945 10.4317 9.76718 10.6942 9.72343 11.1371Z" fill="url(#paint0_radial_8_49)"/>
                    <path d="M20.8113 21.1696C18.3258 17.9704 19.4387 14.32 20.0484 12.8653C20.1305 12.6739 19.9117 12.4934 19.7395 12.611C18.6703 13.3383 16.4801 15.0501 15.4602 17.459C14.0793 20.7157 14.1777 22.3098 14.9953 24.2567C15.4875 25.4297 14.916 25.6786 14.6289 25.7223C14.35 25.7661 14.093 25.5801 13.8879 25.386C13.3 24.8254 12.8762 24.0954 12.6738 23.3079C12.6301 23.1383 12.4086 23.0919 12.3074 23.2313C11.5418 24.2895 11.1453 25.9876 11.1262 27.1879C11.066 30.8985 14.1313 33.9063 17.8391 33.9063C22.5121 33.9063 25.9164 28.7383 23.2313 24.418C22.452 23.1602 21.7191 22.3372 20.8113 21.1696Z" fill="url(#paint1_radial_8_49)"/>
                    <defs>
                    <radialGradient id="paint0_radial_8_49" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17.0122 33.9886) rotate(-179.751) scale(19.3013 31.6696)">
                    <stop offset="0.3144" stop-color="#FF9800"/>
                    <stop offset="0.6616" stop-color="#FF6D00"/>
                    <stop offset="0.9715" stop-color="#F44336"/>
                    </radialGradient>
                    <radialGradient id="paint1_radial_8_49" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18.0961 14.7818) rotate(90.5787) scale(20.1951 15.1983)">
                    <stop offset="0.2141" stop-color="#FFF176"/>
                    <stop offset="0.3275" stop-color="#FFF27D"/>
                    <stop offset="0.4868" stop-color="#FFF48F"/>
                    <stop offset="0.6722" stop-color="#FFF7AD"/>
                    <stop offset="0.7931" stop-color="#FFF9C4"/>
                    <stop offset="0.8221" stop-color="#FFF8BD" stop-opacity="0.804"/>
                    <stop offset="0.8627" stop-color="#FFF6AB" stop-opacity="0.529"/>
                    <stop offset="0.9101" stop-color="#FFF38D" stop-opacity="0.2088"/>
                    <stop offset="0.9409" stop-color="#FFF176" stop-opacity="0"/>
                    </radialGradient>
                    </defs>
                    </svg>

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
      endDate: new Date(2022, 3, 1, 10, 10, 10, 10),
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
