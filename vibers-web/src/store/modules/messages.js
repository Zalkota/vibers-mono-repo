import {getLibrary} from "../../js/web3";
import {parseInt} from 'lodash'


const messageStore = {
    state: {
        transactionPending: false,
    },
    getters: {
        getTransactionPending: state => state.transactionPending,

    },
    mutations: {
        setTransactionPending(state, payload) {
            console.log('setTransactionPending', payload)
            state.transactionPending = payload
        },

    },
    actions: {

    }
}

export default messageStore;
