import React, { Component } from 'react';
import './index.scss';
import "antd/dist/antd.css";
import Welcome from '../Welcome';
import { cryptoCurrencies, cryptoColor } from '../../constants/cryptos';
import CryptoMenu from '../../components/CryptoMenu';
import DetailsTab from '../DetailsTab';
import Settings from '../Settings';
import Loader from '../../components/Loader';
import * as BlockchainInteraction from '../../utils/SubmitTransactions/ReturnInstances';

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toggleMenu: false,
            selectedCrypto: 0,
            cryptoValue: 0,
            showLoading: false
        }
    }

    toggleCryptoMenu = () => {
        if (window.innerWidth < 491)
            this.setState({ toggleMenu: true })
    }

    // componentDidMount() {
    //     this.renderDetailsTab();
    // }

    // componentWillReceiveProps(nextProps) {
    //     // this.renderDetailsTab();
    // }

    renderDetailsTab = () => {
        let selectedCrypto = window.location.href
        selectedCrypto = selectedCrypto.split('?')[2] || 0;
        let crypto = cryptoCurrencies[selectedCrypto].label;
        let blockchainInteraction = BlockchainInteraction.getInstance(crypto);
        if (blockchainInteraction === undefined) {
            this.setState({ cryptoValue: 0, showLoading: false });
            return
        }
        this.setState({ showLoading: true }, () => {
            blockchainInteraction.getBalance().then(res => {
                res = res.toString();
                this.setState({ cryptoValue: res.substr(0, 4), showLoading: false });
            })
        });
    }

    renderHomePage = () => {
        let hash = window.location.hash
        hash = hash.split('?')[1];
        switch (hash) {

            case "recover":
                this.props.history.push("/recover");
                break;
            case "portfolio":
                return <Welcome />
            case "cryptoMenu":
                return (
                    <div>
                        {
                            this.state.showLoading ? <Loader /> :
                                <div>
                                    <div>
                                        <CryptoMenu renderDetailsTab={this.renderDetailsTab} toggle={this.state.toggleMenu} />
                                    </div>
                                    <div>
                                        <DetailsTab cryptoValue={this.state.cryptoValue} toggle={this.state.toggleMenu} toggleMenu={this.toggleCryptoMenu} selectedCrypto={this.state.selectedCrypto} />
                                    </div>
                                </div>
                        }
                    </div>
                )

            case "settings":
                return <Settings />
            default:
            // return 
        }
    }

    render() {
        return (
            <div>
                {this.renderHomePage()}
            </div>
        )
    }
}

export default HomePage;
