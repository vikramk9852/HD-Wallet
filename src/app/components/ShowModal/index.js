import React, { Component } from 'react';
import { Modal, Row, Col, Card, message } from 'antd';
import { QRCode } from "react-qr-svg";
import BorderedButton from '../BorderedButton';
import CopyToClipboard from 'react-copy-to-clipboard'
import './index.scss';
import "antd/dist/antd.css";
import InputLine from '../InputLine';
import { cryptoCurrencies, cryptoColor } from '../../constants/cryptos';
import ModalCircle from '../ModalCircle';
import * as BlockchainInteraction from '../../utils/SubmitTransactions';
import Loader from '../../components/Loader';
import printJS from 'print-js';

const importAll = require =>
    require.keys().reduce((acc, next) => {
        acc[next.replace("./", "")] = require(next);
        return acc;
    }, {});

const images = importAll(
    require.context("../../../../node_modules/cryptocurrency-icons/svg/color", false, /\.(png|jpe?g|svg)$/)
);

const textArray = ["COPY THIS ADDRESS", "PRINT THIS ADDRESS", "EMAIL THIS ADDRESS", "VIEW ON BLOCKCHAIN"];

class ShowModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showLoader: false,
            crypto: "0x",
            currency: "zrx",
            addressText: `YOUR ${this.props.crypto} ADDRESS`,
            address: '0x6e88F3Cc26d4F85bea332987D3Cb27487D7fD31D',
            toAddress: "",
            fiatValue: "0.00",
            transactionValue: 0
        }
    }

    componentDidMount() {
        this.setCryptoName();
    }

    componentWillReceiveProps() {
        this.setCryptoName();
    }

    setCryptoName() {
        let selectedCrypto = window.location.href
        selectedCrypto = selectedCrypto.split('?')[2] || 0;
        this.setState({ crypto: cryptoCurrencies[selectedCrypto].label, currency: cryptoCurrencies[selectedCrypto].currency });
    }

    setToAddress(toAddress) {
        this.setState({ toAddress: toAddress });
    }

    setTransactionValue(transactionValue) {
        this.setState({ transactionValue: transactionValue })
        console.log(transactionValue);
    }

    onMouseEnter = (index) => {
        this.setState({ addressText: textArray[index] });
    }

    handleMouseLeave = () => {
        this.setState({ addressText: `YOUR ${this.props.crypto} ADDRESS` });
    }

    handleCircleClick = (index) => {
        switch (index) {
            case 0:
                this.setState({ addressText: "ADDRESS COPIED TO CLIPBOARD" });
                break;
            case 1:
                this.print();
                break;
            case 2:
                this.sendMail();
                break;
            case 3:
                this.openAddress();
                break;
        }
    }

    sendMail() {
        window.open(`mailto:?subject=Bitcoin%20Address&body=My%20Bitcoin%20address%20is:%20${this.state.address}`)
    }

    openAddress() {
        window.open("https://ropsten.etherscan.io/address/" + this.state.address)
    }


    print() {
        printJS('printAddress', 'html');
    }

    handleOk = () => {
        this.setState({ showLoader: true }, () => {
            let to = this.state.toAddress;
            if (to.length === 0) {
                message.error("Invalid address")
                this.props.hideModal();
                this.setState({ showLoader: false });
                return;
            }
            let value = this.state.transactionValue;
            if (value == 0) {
                message.warning("Please enter Non-zero value");
                this.setState({ showLoader: false });
                return;
            }
            BlockchainInteraction.Ethereum.submitTransaction(to, value).then((res) => {
                this.props.refreshTransactionTable();
                this.props.hideModal();
            }).catch((err) => {
                this.props.hideModal();
                console.log(err)
            });
        })
    }

    handleCancel = () => {
        this.props.hideModal();
    }

    render() {
        return (
            <div className="showModal">


                <Modal
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    visible={true}
                    footer={null}
                    centered={true}
                    keyboard={true}
                    maskClosable={false}
                    closable={true}
                    width="720px"
                >
                    <img className="modalLogo" width="82px" src={images[`${this.state.currency}.svg`]} />
                    {
                        this.props.buttonText === "send" ?
                            <div>
                                <div className="modalInput" style={{ paddingTop: "40px" }}>
                                    <InputLine setToAddress={(toAddress) => this.setToAddress(toAddress)} autoFocus="autoFocus" placeholder={`Send to ${this.state.crypto} Address`} />
                                </div>
                                {this.state.showLoader && <Loader />}
                                <div className="modalInput" id="modalInput2" style={{ position: "relative" }}>
                                    <InputLine setTransactionValue={(transactionValue) => this.setTransactionValue(transactionValue)} style={{ marginBotto: "0px !important" }} value="0.00" />
                                    <span style={{ color: cryptoColor[this.state.crypto] }} className="transactionCurrency">{this.state.currency.toUpperCase()}</span>
                                    <span style={{ color: "white", top: "41px" }} className="transactionCurrency">
                                    {localStorage.getItem("defaultCurrency")}
                                </span></div>
                                <div className="sendCryptoButton"><BorderedButton text="Send" onClick={this.handleOk} /></div>
                            </div>
                            :

                            <div className="receiveModal">
                                <Card style={{ width: "170px", height: "170px" }}>
                                    <QRCode
                                        bgColor="#FFFFFF"
                                        fgColor="#000000"
                                        level="Q"
                                        style={{ width: 160, margin: "4px" }}
                                        value={this.state.address}
                                    />
                                </Card>
                                <p className="addressText">{this.state.addressText}</p>
                                <p className="addressText" id="printAddress" style={{ fontSize: "18px", color: cryptoColor[this.state.crypto] }}>{this.state.address}</p>
                                <Row className="circleRow" gutter={24} style={{ margin: "0 auto" }}>
                                    <CopyToClipboard text={this.state.address}>
                                        <Col align="middle" span={6}><ModalCircle onClick={() => { this.handleCircleClick(0) }} onMouseEnter={() => { this.onMouseEnter(0) }} onMouseLeave={this.handleMouseLeave} type="copy" /></Col>
                                    </CopyToClipboard>
                                    <Col align="middle" span={6}><ModalCircle onClick={() => { this.handleCircleClick(1) }} onMouseEnter={() => { this.onMouseEnter(1) }} handleMouseLeave={this.handleMouseLeave} type="printer" /></Col>
                                    <Col align="middle" span={6}><ModalCircle onClick={() => { this.handleCircleClick(2) }} onMouseEnter={() => { this.onMouseEnter(2) }} handleMouseLeave={this.handleMouseLeave} type="mail" /></Col>
                                    <Col align="middle" span={6}><ModalCircle onClick={() => { this.handleCircleClick(3) }} onMouseEnter={() => { this.onMouseEnter(3) }} handleMouseLeave={this.handleMouseLeave} type="link" /></Col>
                                </Row>
                            </div>

                    }
                </Modal>
            </div>
        )
    }
}

export default ShowModal;
