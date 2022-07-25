import Vue from 'vue'
import Vuex from 'vuex'
import web3ModalStore from "@/store/modules/web3Modal";
import messageStore from "@/store/modules/messages";

const ERC721ABI = require("../contracts/ERC721ABI.json");
import Web3Plug from "../js/web3-plug.js";
import web3utils from 'web3-utils'

// entry into vuex

Vue.use(Vuex)

export default new Vuex.Store({
    state: {

    },
    getters: {

    },
    mutations: {

    },
    actions: {

    },
    modules: {
        web3Modal: web3ModalStore,
        messages: messageStore,
    }
})
