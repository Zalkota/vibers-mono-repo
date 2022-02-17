<template>
    <div class="background-factory-image ">
       <div class="section bg-gray-100 px-0 lg:px-1">
             <div>
                <Navbar
                v-bind:web3Plug="web3Plug"
               />
             </div>
           </div>
           <div >




          <div class="container mt-6 mx-auto flex flex-col">

              <div class="max-w-lg mt-6 px-6 mb-2 md:px-2 lg:px-6 xl:px-8 py-6 mx-auto bg-gray-100 text-gray-900 rounded-lg shadow-lg" v-if="success">
              	<div class="mt-3 text-center">
              		<div
              			class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
              		>
              			<svg
              				class="h-6 w-6 text-green-600"
              				fill="none"
              				stroke="currentColor"
              				viewBox="0 0 24 24"
              				xmlns="http://www.w3.org/2000/svg"
              			>
              				<path
              					stroke-linecap="round"
              					stroke-linejoin="round"
              					stroke-width="2"
              					d="M5 13l4 4L19 7"
              				></path>
              			</svg>
              		</div>
              		<h3 class="text-lg leading-6 font-medium text-gray-900">Success!</h3>
              		<div class="mt-2 px-7 py-3">
              			<p class="text-sm text-gray-600">
              				Order has been submitted, your package will arrive in two weeks!
              			</p>
              		</div>
              		<div class="items-center px-4 py-3">
                        <router-link to="/" class="no-underline px-4 py-2 bg-blue-700 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
              				Return Home
              			</router-link>
              		</div>
              	</div>
              </div>

              <div class="max-w-screen-xl mt-6 px-8 grid gap-8 mb-2 grid-cols-1 md:grid-cols-2 md:px-6 lg:px-8 xl:px-16 py-16 mx-auto bg-gray-100 text-gray-900 rounded-lg shadow-lg" v-else="success">
                <div class="flex flex-col justify-between">
                  <div>
                    <h2 class="text-4xl lg:text-5xl font-bold leading-tight">Cosmic Caps Cargo</h2>
                    <div class="text-gray-700 mt-8">
                      Tis the season, the Cosmic Caps team wants to give back to those that minted a Cosmic Caps NFT this year.
                      <br><br>
                      We will be mailing a Cosmic Cap themed care package to the first 10 verified Cosmic Cap holders to submit this form.
                      <br><br>
                      <h2 class="font-bold">Each package will contain the following:</h2>
                      <br>
                      <ul>
                          <li class="text-sm"><span class="font-bold">1x</span> Cosmic Cap Hoodie with your Cosmic Cap on the back.</li>
                          <li class="text-sm"><span class="font-bold">2x</span> Cosmic Cap Stickers</li>
                          <li class="text-sm"><span class="font-bold">1x</span> Letter from our team</li>
                      </ul>
                      <div class="max-w-sm">
                          <img
                          src="@/assets/images/sweatshirts.png"
                          alt="Three Cosmic Cap Mushrooms"
                          class="mx-auto"/>
                      </div>
                    </div>
                  </div>
                  <div class="mt-8 text-center">

                  </div>
                </div>

                <form ref="form" @submit.prevent="sendEmail">
                    <div>
                      <div>
                        <span class="uppercase text-sm text-gray-700 font-bold">Cosmic Cap NFT # (ie. 2342)</span>
                        <input class="w-full bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline" name="number" type="text" placeholder="">
                      </div>
                      <div class="mt-8">
                          <label class="block mt-4">
                              <span class="uppercase text-sm text-gray-700 font-bold">Sweatshirt Size</span>
                              <select class="form-select w-full bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline" name="size">
                                <option>Large</option>
                                <option>Medium</option>
                                <option>Small</option>
                                <option>Extra Large</option>
                              </select>
                            </label>
                      </div>
                      <div class="mt-8">
                        <span class="uppercase text-sm text-gray-700 font-bold">Mailing Address</span>
                        <input class="w-full bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline" name="address" type="text">
                        <span class="text-sm text-gray-700">Your address will <span class="font-bold">NOT</span> be shared. We will delete the mailing addresses from our database once we mail the packages.</span>
                      </div>

                      <div class="mt-8">
                        <input class="uppercase text-sm font-bold tracking-wide bg-blue-800 text-gray-100 p-3 rounded-lg w-full focus:outline-none focus:shadow-outline" type="submit" value="Submit">
                      </div>

                      <div class="mt-8 bg-yellow-300 text-gray-800 text-sm rounded-lg shadow-lg py-4 px-8">
                          <p class="leading-tight">If you are concerned  about revealing your address, but would still like a Cosmic Cap's sweatshirt. We can provide you with a link to the clothing manufacturer. You could place your order directly through them, but we won't cover the costs.</p>
                      </div>
                    </div>
                </form>

              </div>
          </div>
        </div>
    </div>
</template>


<script>

import Web3Plug from "../../js/web3-plug.js";

import Navbar from "../components/Navbar.vue";

import TabsBar from "../components/TabsBar.vue";

import FrontendHelper from "../../js/frontend-helper.js";

import emailjs from 'emailjs-com';
const EMAIL_SERVICE = process.env.EMAIL_SERVICE
const EMAIL_TEMPLATE = process.env.EMAIL_TEMPLATE
const EMAIL_USER = process.env.EMAIL_USER



export default {
  name: 'HolidayOrderForm',
  props: [],
  components: { Navbar },
  data() {
    return {
        web3Plug: new Web3Plug(),
        number: '',
        size: '',
        address: '',
        success: false,

    }
  },
  created() {
    this.web3Plug.getPlugEventEmitter().on(
      "stateChanged",
      async function (connectionState) {
        console.log("stateChanged", connectionState);

        this.activeAccountAddress = connectionState.activeAccountAddress;
        this.activeNetworkId = connectionState.activeNetworkId;
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

    // init("user_fNg37z6Q0NFs8JNe0yc9S");


  },

  mounted(){

  },
  methods: {
      sendEmail() {
      emailjs.sendForm(EMAIL_SERVICE, EMAIL_TEMPLATE, this.$refs.form, EMAIL_USER)
        .then((result) => {
            console.log('SUCCESS!', result.text);
            this.success = true;

        }, (error) => {
            console.log('FAILED...', error.text);
        });
    },
  },
  computed: {

    },
  }



</script>
