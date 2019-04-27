import React, { Component } from 'react';
import { Row, Col, Collapse, Table } from 'antd';
import ShowModal from '../../components/ShowModal';
import BorderedButton from '../../components/BorderedButton';
import { cryptoCurrencies, cryptoColor } from '../../constants/cryptos';
import './index.scss';
import "antd/dist/antd.css";
import * as BlockchainInteraction from '../../utils/SubmitTransactions';
import Loader from '../../components/Loader';
import * as CryptoCompare from '../../utils/CryptoCompare';


const Panel = Collapse.Panel;

const importAll = require =>
    require.keys().reduce((acc, next) => {
        acc[next.replace("./", "")] = require(next);
        return acc;
    }, {});

const images = importAll(
    require.context("../../../assets/images", false, /\.(svg)$/)
);
const noOfCryptos = 13;


class DetailsTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currency: "",
            showModal: false,
            showLoading: false,
            cryptoValue: "0",
            fiatValue: "0.00"
        }
        this.setCrypto = this.setCrypto.bind(this);
    }

    componentDidMount() {

        this.setCrypto();
    }

    componentWillReceiveProps(props) {
        if (!this.props.toggle)
            this.props.toggleMenu();
        this.setCrypto();
    }

    hideModal = () => {
        this.setState({ showModal: false });
    }

    sendButton = () => {
        this.setState({ showModal: true, buttonText: "send" })
    }

    receiveButton = () => {
        this.setState({ showModal: true, buttonText: "receive" })
    }

    toggleCryptoMenu = () => {
        this.props.toggleMenu();
    }

    setTableData = () => {

        BlockchainInteraction.Ethereum.getTransaction().then(res => {
            let data = JSON.parse(res);
            data = data.result;
            data = data.reverse();
            let dataSource = [];
            for (let i = 0; i < data.length; i++) {
                data[i].value = BlockchainInteraction.Ethereum.fromWeiToEther(data[i].value);
                dataSource.push({
                    key: `key${i + 2}`,
                    transaction: data[i].hash,
                    to: data[i].to,
                    value: data[i].value
                })
            }
            this.setState({ dataSource: dataSource });
        })
    }

    showTransactionDetails = (record) => {
        let txHash = record.transaction;
        let url = `https://ropsten.etherscan.io/tx/${txHash}`
        window.open(url)
    }

    setCrypto = () => {
        let selectedCrypto = window.location.href
        selectedCrypto = selectedCrypto.split('?')[2] || 0;
        let crypto = cryptoCurrencies[selectedCrypto];
        let currency = crypto.currency.toUpperCase();
        this.setState({ showLoading: true }, () => {
            if (crypto.label === "Ethereum") {
                BlockchainInteraction.Ethereum.getBalance().then(res => {
                    CryptoCompare.convert(currency, "USD").then(value => {
                        value = JSON.parse(value);
                        let fiatValue = value[currency.toString()]["USD"] * res;
                        fiatValue = fiatValue.toString();
                        this.setState({ fiatValue: fiatValue.substr(0, 6), showLoading: false });
                    })
                    res = res.toString();
                    this.setState({ cryptoValue: res.substr(0, 4) });
                })
                this.setTableData();
            }
            else {
                this.setState({ cryptoValue: 0, showLoading: false, fiatValue: "0.00", dataSource: [] });
            }
        })
        this.cryptoCurrencyColor = cryptoColor[cryptoCurrencies[selectedCrypto].label]
        this.setState({ crypto: cryptoCurrencies[selectedCrypto].label, currency: cryptoCurrencies[selectedCrypto].currency })
    }

    render() {
        const columns = [
            {
                title: "To",
                dataIndex: 'to',
                key: 'to',
            }, {
                title: "Transaction Hash",
                dataIndex: 'transaction',
                key: 'transaction',
            }, {
                title: "Value",
                dataIndex: "value",
                key: "value",
            }
        ]

        return (
            <div>
                {
                    this.state.showLoading ?
                        <div className="detailsTab" style={{ display: "grid" }}>
                            <Loader />
                        </div>
                        :
                        <div style={{ textAlign: "center" }}>
                            <Row gutter={24} className="detailsTab">
                                <Col align="middle">
                                    <div className="cryptoIcon">
                                        <img width="82px" onClick={this.toggleCryptoMenu} src={images[`${this.state.currency.toUpperCase()}.svg`]} />
                                    </div>
                                </Col>
                                <Col align="middle">
                                    <div>
                                        <div className="cryptoCurrency" style={{ color: this.cryptoCurrencyColor }}>
                                            <span id="check" className="cryptoAvailable">{this.state.cryptoValue}</span><span>{this.state.currency}</span></div>
                                        <div className="defaultCurrency">${this.state.fiatValue} USD</div>
                                    </div>
                                </Col>
                                <div className="buttons">
                                    <Col xs={24} sm={24} md={24} lg={12} xl={12} align="middle" className="sendButton">
                                        <div>
                                            <BorderedButton text="Send" onClick={this.sendButton} />
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={12} xl={12} align="middle" className="receiveButton">
                                        <div>
                                            <BorderedButton text="Receive" onClick={this.receiveButton} />
                                        </div>
                                    </Col>
                                </div>
                                {this.state.showModal &&
                                    <ShowModal crypto={this.state.crypto.toUpperCase()}
                                        buttonText={this.state.buttonText}
                                        hideModal={this.hideModal}
                                        refreshTransactionTable={this.setTableData}
                                    />
                                }
                                <div className="test">
                                    <Col span={24} className="description">
                                        <Collapse accordion bordered={false} >
                                            <Panel align="left" header="DESCRIPTION" key="1">
                                                <p className="descriptionText">
                                                    {"A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world."}
                                                    {"A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world."}
                                                    {"A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world."}
                                                </p>
                                            </Panel>
                                            <Panel header="TRANSACTIONS" key="2" style={{ overflow: "auto" }}>
                                                <Row>
                                                    <Col className="transactionTable" style={{ maxWidth: window.innerWidth - 100 }}>
                                                        <Table
                                                            onRow={(record, rowIndex) => {
                                                                return {
                                                                    onClick: (event) => { this.showTransactionDetails(record) },
                                                                };
                                                            }}
                                                            columns={columns}
                                                            dataSource={this.state.dataSource}
                                                            pagination={false}
                                                            style={{ overflow: "scroll" }}
                                                        // locale={{ emptyText: (<span>not available</span>) }}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Panel>
                                        </Collapse>
                                    </Col>
                                </div>

                            </Row>
                        </div>
                }
            </div>
        )
    }
}

export default DetailsTab;
