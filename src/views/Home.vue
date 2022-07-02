<template>
<div>
    <!-- Navbar -->
     <div>
        <Navbar
       />
     </div>

    <!-- Header -->
    <div class="bg-triangle hero">
        <Mint/>
    </div>


    <!-- Welcome  -->
    <div class=" section  bg-six relative">
        <div class="spike-three-top">
            <img
            src="@/assets/images/waves/spike_three_top.svg"
            alt="Three Cosmic Cap Mushrooms"
            class="unhide"/>
        </div>
        <div class="container px-12 pt-12 pb-24 md:pt-24 lg:py-64 sm:px-4 mx-auto text-black">
                <div class="lg:flex">
                        <div class="lg:flex-1">
                                <h1 class=" text-3xl md:text-4xl font-bold text-black mb-3 color-four tracking-wider" style="text-shadow: 2px 2px #99D9A9;">Welcome to Vibers</h1>
                                <p>Vibers is 10k NFT collection that encompasses the ethos of web3 by taking inspiration from a wide range of iconic NFT collections to create an entirely new and original CC0 project. </p>
                                <br>
                                <p>The end result is a fun collection where you can spot aspects from many projects including CrypToadz, DystoPunks, CryptoSkulls, Doodles, Nouns, CryptoPunks. Basically the dopest art rolled into one.</p>
                                <br>
                                <p>Vibers are stored as <a href="https://ethereum.org/en/developers/docs/standards/tokens/erc-721/">ERC721 tokens</a> on the Ethereum blockchain. </p>
                                <br>
                        </div>
                        <div class="lg:flex-1">
                                <img
                                src="@/assets/images/vibers/skulls_1.png"
                                alt="Three Cosmic Cap Mushrooms"
                                class="mx-auto lg:max-w-sm "/>
                        </div>
                </div>
        </div>
    </div>

    <div class="section bg-six relative">
        <div class="spike-three-bottom">
            <img
            src="@/assets/images/waves/spike_three_bottom.svg"
            alt="Three Cosmic Cap Mushrooms"
            class="unhide"/>
        </div>
    </div>

    <div class="section py-8 bg-three mx-auto ">
        <div class="container mx-auto  lg:px-0  mx-4 px-10  my-10 text-black">
                <div class=" flex-col lg:flex-row flex">
                        <div class="flex-1 m-1 pt-4 lg:pt-0">
                                <img
                                src="@/assets/images/vibers/skull_21.png"
                                alt="Three Cosmic Cap Mushrooms"
                                class="mx-auto lg:max-w-xs  p-2"/>
                        </div>
                        <div class="flex-1 pt-4 lg:pt-0 m-1">
                                <img
                                src="@/assets/images/vibers/skull_22.png"
                                alt="Three Cosmic Cap Mushrooms"
                                class="mx-auto lg:max-w-xs  p-2"/>
                        </div>
                        <div class="flex-1 pt-4 lg:pt-0 m-1">
                                <img
                                src="@/assets/images/vibers/skull_23.png"
                                alt="Three Cosmic Cap Mushrooms"
                                class="mx-auto lg:max-w-xs  p-2"/>
                        </div>
                        <div class="flex-1 pt-4 lg:pt-0 m-1">
                                <img
                                src="@/assets/images/vibers/skull_24.png"
                                alt="Three Cosmic Cap Mushrooms"
                                class="mx-auto lg:max-w-xs  p-2"/>
                        </div>

                </div>
                <div class="flex-col lg:flex-row flex">
                        <div class="flex-1 pt-4 lg:pt-0 m-1">
                                <img
                                src="@/assets/images/vibers/skull_25.png"
                                alt="Three Cosmic Cap Mushrooms"
                                class="mx-auto lg:max-w-xs   p-2"/>
                        </div>
                        <div class="flex-1 pt-4 lg:pt-0 m-1">
                                <img
                                src="@/assets/images/vibers/skull_26.png"
                                alt="Three Cosmic Cap Mushrooms"
                                class="mx-auto lg:max-w-xs  p-2"/>
                        </div>
                        <div class="flex-1 pt-4 lg:pt-0 m-1">
                                <img
                                src="@/assets/images/vibers/skull_27.png"
                                alt="Three Cosmic Cap Mushrooms"
                                class="mx-auto lg:max-w-xs  p-2"/>
                        </div>
                        <div class="flex-1 pt-4 lg:pt-0 m-1">
                                <img
                                src="@/assets/images/vibers/skull_28.png"
                                alt="Three Cosmic Cap Mushrooms"
                                class="mx-auto lg:max-w-xs  p-2"/>
                        </div>

                </div>
        </div>
    </div>
    <Footer/>
</div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import Mint from "./components/Mint.vue";
import FrontendHelper from "../js/frontend-helper.js";


export default {
  name: "Home",
  props: [],
  components: { Navbar, Footer, Mint},

  mounted: function() {
      let subscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'setContract') {
          console.log("mutation.type setContract")
          subscribe()
      }
    })
  }
};
</script>
