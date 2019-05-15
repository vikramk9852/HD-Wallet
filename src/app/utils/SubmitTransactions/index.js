
import Zrx from '../SubmitTransactions/0x';
import Augur from '../SubmitTransactions/Augur';
import Binance from '../SubmitTransactions/Binance';
import Bitcoin from '../SubmitTransactions/Bitcoin';
import BitcoinCash from '../SubmitTransactions/BitcoinCash';
import BitcoinSV from '../SubmitTransactions/BitcoinSV';
import ChainLink from '../SubmitTransactions/ChainLink';
import Dash from '../SubmitTransactions/Dash';
import Decred from '../SubmitTransactions/Decred';
import DigiByte from '../SubmitTransactions/DigiByte';
import Ethereum from '../SubmitTransactions/Ethereum/index';
import EthereumClassic from '../SubmitTransactions/EthereumClassic';
import Litecoin from '../SubmitTransactions/Litecoin';
import Ripple from '../SubmitTransactions/Ripple';


class BlockchainInteraction {
    constructor() {
        this.Zrx = new Zrx();
        this.Augur = new Augur();
        this.Binance = new Binance();
        this.Bitcoin = new Bitcoin();
        this.BitcoinCash = new BitcoinCash();
        this.BitcoinSV = new BitcoinSV();
        this.ChainLink = new ChainLink();
        this.Dash = new Dash();
        this.Decred = new Decred();
        this.DigiByte = new DigiByte();
        this.Ethereum = new Ethereum();
        this.EthereumClassic = new EthereumClassic();
        this.Litecoin = new Litecoin();
        this.Ripple = new Ripple();
    }

}

export default BlockchainInteraction;