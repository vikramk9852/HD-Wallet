import Ethereum from '../SubmitTransactions/Ethereum/index';
import Bitcoin from '../SubmitTransactions/Bitcoin';
import { Eth } from 'web3-eth';


class BlockchainInteraction {
    constructor() {
        this.Ethereum = new Ethereum();
        this.Bitcoin = new Bitcoin();
    }

}

export default BlockchainInteraction;