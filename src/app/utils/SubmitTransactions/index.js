import Ethereum from '../SubmitTransactions/Ethereum/index';
import Bitcoin from '../SubmitTransactions/Bitcoin';
import EthereumClassic from '../SubmitTransactions/EthereumClassic';


class BlockchainInteraction {
    constructor() {
        this.Ethereum = new Ethereum();
        this.Bitcoin = new Bitcoin();
        this.EthereumClassic = new EthereumClassic();
    }

}

export default BlockchainInteraction;