import {getLibrary} from "../../js/web3";
import {ethers} from "ethers";
import {parseInt} from 'lodash'

const ERC721ABI = require("../../contracts/ERC721ABI.json");
import Web3Plug from "../../js/web3-plug.js";
import web3utils from 'web3-utils'
// const contractData = require('../config/contractdata.json')

const web3ModalStore = {
    state: {
        web3Modal: null,
        Web3Plug: new Web3Plug(),
        library: getLibrary(),
        active: false,
        account: null,
        chainId: 0,
        contract: null,
        contractAddress: null,
        signer: null,
        abi: null,
        balance: 0,
        signer: null,
        authToken: null,
        totalSupply: 0,
        publicSaleReleaseDate: null,
        publicSale: false,
        allowlistSale: false,
        loading: false,
        networkError: false,


    },
    getters: {
        getNFTContract: state => state.contract,

        getEthBalance: state => state.balance,

        getSaleReleaseDate: state => state.saleReleaseDate,

        getPublicSale: state => state.publicSale,

        getLoading: state => state.loading,

        getNetworkError: state => state.networkError,
    },
    mutations: {
        setWeb3Modal(state, web3Modal) {
            state.web3Modal = web3Modal
        },
        setLibrary(state, library) {
            state.library = library
        },
        setActive(state, active) {
            state.active = active
        },
        setAccount(state, account) {
            if (account) {
                state.account = account.toLowerCase()
            }
        },
        setChainId(state, chainId) {
            state.chainId = chainId
        },

        setEthBalance(state, balance) {
            state.balance = balance
        },

        setSigner(state, signer) {
            state.signer = signer
        },

        setAuthToken(state, authToken) {
            state.authToken = authToken
        },

        setTotalSupply(state, totalSupply) {
            state.totalSupply = totalSupply
        },

        setContract(state, contract) {
            console.log("setContract")
            state.contract = contract
        },

        setPublicSaleReleaseDate(state, payload) {
            state.publicSaleReleaseDate = payload;
        },

        setPublicSale(state, payload) {
            state.publicSale = payload;
        },

        setAllowlistSale(state, payload) {
            state.allowlistSale = payload;
        },

        setLoading(state, payload) {
            state.loading = payload;
        },

        setNetworkError(state, payload) {
            state.networkError = payload;
        },


    },
    actions: {

        async setPublicSaleStatus({state, commit, dispatch}) {
            let now = new Date();
            let releaseDate = state.publicSaleReleaseDate
            if (state.active) {
                commit('setLoading', true)
                let result = await state.contract.hasPublicSaleStarted();
                if (result == true) {
                    commit('setPublicSale', result)
                    commit('setLoading', false)
                }
                console.log('has the public sale started?', result)
            } else if (state.releaseDate > now.getTime()) {
                    commit('setPublicSale', false)
                    console.log('public sale is in the future')
            } else if (state.releaseDate <= now.getTime()) {
                    commit('setPublicSale', true)
                    console.log('public sale started in the past')
            }
        },

        async setContract({state, commit, dispatch}) {
            let contractList = await state.Web3Plug.getContractDataForNetworkID(state.chainId)
            let contractAddress = contractList.vibers.address
            let abi = ERC721ABI
            let signer = state.signer;
            let contract = new ethers.Contract(contractAddress, abi, signer);
            console.log("setting Contract")
            commit('setContract', contract)
        },

        async setTotalSupply({state, commit, dispatch}) {
            let totalSupply = await state.contract.totalSupply();
            commit('setTotalSupply', totalSupply)
        },

        async connect({state, commit, dispatch}) {
            let provider = await state.web3Modal.connect();
            let library = new ethers.providers.Web3Provider(provider)
            let signer = library.getSigner()
            commit('setSigner', signer)

            library.pollingInterval = 12000
            commit('setLibrary', library)

            let accounts = await library.listAccounts()
            if (accounts.length > 0) {
                commit('setAccount', accounts[0])

            }

            console.log(accounts[0])
            let balance = await library.getBalance(accounts[0]);
            commit('setEthBalance', balance)


            let network = await library.getNetwork()
            commit('setChainId', network.chainId)
            commit('setActive', true)

            provider.on("connect", async (info) => {
                let chainId = parseInt(info.chainId)
                commit('setChainId', chainId)
                console.log("connect", info)
            });

            await dispatch('setContract')
            await dispatch('setPublicSaleStatus')


            provider.on("accountsChanged", async (accounts) => {
                if (accounts.length > 0) {
                    commit('setAccount', accounts[0])
                } else {
                    await dispatch('resetApp')
                }
                console.log("accountsChanged")
            });
            provider.on("chainChanged", async (chainId) => {
                chainId = parseInt(chainId)
                commit('setChainId', chainId)
                console.log("chainChanged", chainId)
            });

        },
        async resetApp({state, commit}) {
            try {
                await state.web3Modal.clearCachedProvider();
            } catch (error) {
                console.error(error)
            }
            commit('setAccount', null)
            commit('setActive', false)
            commit('setLibrary', getLibrary())
        },
    }
}

export default web3ModalStore;
