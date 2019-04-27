import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { cryptoCurrencies, cryptoColor } from '../../constants/cryptos';
import onClickOutside from 'react-onclickoutside'
import './index.scss';
import "antd/dist/antd.css";

const noOfCryptos = 13;

class CryptoMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
            prevStyle: {},
            showCryptoMenu: true
        }
        this.cryptoItemClick = this.cryptoItemClick.bind(this);
    }

    componentDidMount() {
        let hash = window.location.href
        hash = hash.split('?')[2];
        this.cryptoItemClick(hash)
        console.log(hash)
    }

    componentWillReceiveProps(props) {
        if (props.toggle && window.innerWidth < 491 && !this.state.showCryptoMenu) {
            this.setState({ showCryptoMenu: true }, ()=>{
                let hash = window.location.href
                console.log(hash)
                hash = hash.split('?')[2];
                this.cryptoItemClick(hash);
            });
        }
    }

    handleClickOutside = () => {
        if (window.innerWidth < 491)
            this.setState({ showCryptoMenu: false })
    }

    renderCryptoList = cryptos => {
        let cryptoList = [];
        let self = this;
        for (let i = 0; i < cryptos; i++) {
            cryptoList.push(
                <a onClick={function(event){self.cryptoItemClick(i); self.handleClickOutside()}} >
                    <p className="crypto" id={`crypto${i}`}>
                        <div className="label">{cryptoCurrencies[i].label}</div>
                        <div className="currency">{cryptoCurrencies[i].currency.toUpperCase()}</div>
                    </p>
                </a>
            )
        }
        return cryptoList;
    }

    cryptoItemClick = (value) => {
        document.getElementById("crypto" + this.state.selected).childNodes[0].style = this.state.prevStyle;
        document.getElementById("crypto" + this.state.selected).childNodes[1].style = this.state.prevStyle;
        document.getElementById("crypto" + this.state.selected).style.borderRight = "2px solid transparent";
        document.getElementById("crypto" + value).childNodes[0].style.color = cryptoColor[cryptoCurrencies[value].label];
        document.getElementById("crypto" + value).childNodes[1].style.color = "#f3f3f3";
        document.getElementById("crypto" + value).style.borderRight = `solid 2px ${cryptoColor[cryptoCurrencies[value].label]}`
        this.setState({
            selected: value,
            prevStyle: document.getElementById("crypto" + this.state.selected).childNodes[0].style
        });

        let currentPage = window.location.href;
        currentPage = currentPage.split('?')[1]
        this.props.history.push('home?' + currentPage + '?' + value);
    }

    render() {
        return (
            <div>
                {
                    (this.state.showCryptoMenu || this.props.toggleMenu) &&
                    <div className="cryptoMenu" style={{ borderRight: `solid 2px ${cryptoColor[cryptoCurrencies[this.state.selected].label]}` }}>
                        {this.renderCryptoList(noOfCryptos)}
                    </div>
                }
            </div>
        )
    }
}

export default withRouter(onClickOutside(CryptoMenu));
