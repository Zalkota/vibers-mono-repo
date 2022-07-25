import {mapGetters, mapState} from "vuex";
import {getMultiplier} from "./helpers";

// const messages = {
//     computed: {
//         ...mapState(['messages']),
//         // ...mapGetters(['web3Modal'])
//     },
//     transactionPending() {
//         return this.messages.transactionPending
//     },
// }

const web3Modal = {
    computed: {
        ...mapState(['web3Modal']),
        // ...mapGetters(['web3Modal'])
    },
    active() {
        return this.web3Modal.active
    },

    account() {
        return this.web3Modal.account
    }
}



export {
    web3Modal,
}
