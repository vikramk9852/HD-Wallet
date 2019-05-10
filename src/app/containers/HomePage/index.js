import React, { Component } from 'react';
import { Icon, Menu, Dropdown, Modal } from 'antd';
import './index.scss';
import "antd/dist/antd.css";
import Welcome from '../Welcome';
import { cryptoCurrencies, cryptoColor } from '../../constants/cryptos';
import CryptoMenu from '../../components/CryptoMenu';
import DetailsTab from '../DetailsTab';
import Settings from '../Settings';
import Loader from '../../components/Loader';
import * as BlockchainInteraction from '../../utils/SubmitTransactions/ReturnInstances';
import ShowModal from '../../components/ShowModal';

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toggleMenu: false,
            selectedCrypto: 0,
            cryptoValue: 0,
            showLoading: false,
            menuStyling: document.getElementById("leftMenu"),
            walletInfo: undefined,
            crypto: "0x"
        }
    }

    toggleCryptoMenu = () => {
        if (window.innerWidth < 491)
            this.setState({ toggleMenu: true })
    }

    componentWillReceiveProps() {
        let hash = window.location.hash;
        hash = hash.split('?')[1];
        this.setState({ urlHash: hash, menuStyling: document.getElementById("leftMenu") });
        let selectedCrypto = window.location.href
        selectedCrypto = selectedCrypto.split('?')[2] || 0;
        let crypto = cryptoCurrencies[selectedCrypto];
        this.setState({ crypto: crypto.label, currency: crypto.currency });
    }
    componentWillMount() {
        let hash = window.location.hash;
        hash = hash.split('?')[1];
        this.setState({ urlHash: hash });
        let selectedCrypto = window.location.href
        selectedCrypto = selectedCrypto.split('?')[2] || 0;
        let crypto = cryptoCurrencies[selectedCrypto];
        this.setState({ crypto: crypto.label, currency: crypto.currency });
    }

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

        switch (this.state.urlHash) {

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

    handleRightDropDown = (event) => {
        switch (event.key) {
            case "viewPrivateKey":
                let selectedCrypto = window.location.href
                selectedCrypto = selectedCrypto.split('?')[2] || 0;
                let crypto = cryptoCurrencies[selectedCrypto].label;
                let blockchainInteraction = BlockchainInteraction.getInstance(crypto);
                if (blockchainInteraction != undefined) {
                    let walletInfo = blockchainInteraction.getWalletInfo();
                    this.setState({ walletInfo: walletInfo });
                }
                else {
                    this.setState({ walletInfo: undefined });
                }
                break;
            case "toggleMenu":
                this.state.menuStyling.style.display = "block";
                break;
            case "logout":
                this.props.history.push("/login");
                break;
        }
    }

    handleCancel = () => {
        this.setState({ walletInfo: undefined });
    }

    render() {

        const menu = (
            <Menu onClick={this.handleRightDropDown}>
                {
                    this.state.urlHash === "cryptoMenu" &&
                    <Menu.Item key="viewPrivateKey">
                        View Private Key
                    </Menu.Item>
                }{
                    window.innerWidth < 769 &&
                    <Menu.Item key="toggleMenu">
                        Show Menu
                    </Menu.Item>
                }
                <Menu.Item key="logout">
                    Logout
                </Menu.Item>
            </Menu>
        );

        return (
            <div>
                {this.state.walletInfo !== undefined &&

                    <ShowModal
                        crypto={this.state.crypto}
                        currency={this.state.currency}
                        walletInfo={this.state.walletInfo}
                        hideModal={this.handleCancel}
                    />
                }
                <div className="rightDropDown">
                    <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
                        <Icon type="more" />
                    </Dropdown>
                </div>
                {this.renderHomePage()}
            </div>
        )
    }
}

export default HomePage;
