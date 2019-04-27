import React, { Component } from 'react';
import { Layout } from 'antd';
import './index.scss';
import "antd/dist/antd.css";
import Welcome from '../Welcome';
import { cryptoCurrencies, cryptoColor } from '../../constants/cryptos';
import CryptoMenu from '../../components/CryptoMenu';
import DetailsTab from '../DetailsTab';
import Statistics from '../Statistics';
import Loader from '../../components/Loader';
import * as WaitLogo from '../../../assets/images/orb.gif';
import * as BlockchainInteraction from '../../utils/SubmitTransactions';

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
        if(window.innerWidth < 491)
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
        let crypto = cryptoCurrencies[selectedCrypto];
        this.setState({ showLoading: true }, () => {
            if (crypto.label === "Ethereum") {
                BlockchainInteraction.Ethereum.getBalance().then(res => {
                    console.log("cryptoValue", res)
                    res = res.toString();
                    this.setState({ cryptoValue: res.substr(0, 4), showLoading: false });
                })
            }
            else {
                this.setState({ cryptoValue: 0, showLoading: false });
            }
        });
    }

    renderHomePage = () => {
        let hash = window.location.hash
        console.log(hash)
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
