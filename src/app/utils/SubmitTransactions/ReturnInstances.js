import BlockchainInteraction from '../SubmitTransactions';

export function getInstance(crypto) {
    let Interaction = new BlockchainInteraction()
    switch (crypto) {
        case "0x":
            return Interaction.Zrx;
        case "Augur":
            return Interaction.Augur;
        case "Binance":
            return Interaction.Binance;
        case "Bitcoin":
            return Interaction.Bitcoin;
        case "Bitcoin Cash":
            return Interaction.BitcoinCash;
        case "Bitcoin SV":
            return Interaction.BitcoinSV;
        case "ChainLink":
            return Interaction.ChainLink;
        case "Dash":
            return Interaction.Dash;
        case "Decred":
            return Interaction.Decred;
        case "DigiByte":
            return Interaction.DigiByte;
        case "Ethereum":
            return Interaction.Ethereum;
        case "Ethereum Classic":
            return Interaction.EthereumClassic;
        case "Litecoin":
            return Interaction.Litecoin;
        case "Ripple":
            return Interaction.Ripple;
    }
}