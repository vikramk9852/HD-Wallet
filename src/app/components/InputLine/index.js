import React, { Component } from 'react';
import { Input } from 'antd';
import { withRouter } from 'react-router';
import { cryptoCurrencies, cryptoColor } from '../../constants/cryptos';
import * as CryptoCompare from '../../utils/CryptoCompare';
import BlockchainInteraction from '../../utils/SubmitTransactions'
import './index.scss';
import "antd/dist/antd.css";

class LeftMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lineColor: "#aeaeae",
            currencyValue: null,
            fiatValue: null
        }
    }

    componentDidMount() {
        this.setLineColor();
    }

    componentWillReceiveProps() {
        this.setLineColor();
    }

    setToAddress=(event)=>{
        let toAddress = event.target.value;
        if(BlockchainInteraction.Ethereum.validateAddress(toAddress)){
            this.props.setToAddress(toAddress);
        }
        else{
            this.setState({lineColor: "red"});
        }
    }

    calculateFiatValue = (event) => {
        let value = event.target.value;
        let inputId = event.target.id;
        if (isNaN(value[value.length - 1]) && value[value.length - 1] != '.') {
            console.log("value", value);
            if(inputId === "fiat"){
                this.setState({currencyValue: "0.00", fiatValue: value});
            }
            else{
                this.setState({fiatValue: "0.00", currencyValue: value});
            }
            return;
        }

        let currency = this.state.currency.toUpperCase()
        let fiat = localStorage.getItem("defaultCurrency");
        CryptoCompare.convert(currency, fiat).then((res) => {
            res = JSON.parse(res);
            let convertedValue = res[currency][fiat]
            if(inputId === "fiat"){
                if(convertedValue != 0){
                    convertedValue = 1/convertedValue;
                }
                let currencyValue = convertedValue * value;
                currencyValue = currencyValue.toFixed(8);
                currencyValue = currencyValue.toLocaleString();
                this.setState({currencyValue: currencyValue, fiatValue: value});
            }
            else{
                let fiatValue = convertedValue * value;
                fiatValue = fiatValue.toFixed(2);
                fiatValue = fiatValue.toLocaleString();
                this.setState({ fiatValue: fiatValue, currencyValue: value});
            }
            this.props.setTransactionValue(this.state.currencyValue);
        })
    }


    setLineColor = () => {
        let selectedCrypto = window.location.href
        selectedCrypto = selectedCrypto.split('?')[2] || 0;
        selectedCrypto = cryptoCurrencies[selectedCrypto]
        this.setState({ currency: selectedCrypto.currency, lineColor: cryptoColor[selectedCrypto.label] })
    }

    render() {
        return (
            <div className="inputLine">
            <input
                id="crypto"
                autoFocus={this.props.autoFocus}
                placeholder={this.props.placeholder}
                defaultValue={this.props.value}
                style={{color: this.state.lineColor, borderBottom: `2px solid ${this.state.lineColor}` }}
                onChange={this.props.value ? this.calculateFiatValue : this.setToAddress}
                value={this.props.value && this.state.currencyValue}
                autoComplete="off"
            />
            {this.props.value&&
            <input 
                id="fiat" 
                style={{ margin: "0 auto 40px auto", color: "white" }} 
                defaultValue="0.00" 
                onChange={this.calculateFiatValue}
                value={this.state.fiatValue}
                autoComplete="off"
            />
            }
            </div>
        )
    }
}

export default withRouter(LeftMenu);
