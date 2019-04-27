import React, { Component } from 'react';
import './index.scss';
import { cryptoCurrencies, cryptoColor } from '../../constants/cryptos';

const noOfCryptos = 13;

class Button extends Component {

  constructor(props){
    super(props);
    this.state={
      backgroundImage: "linear-gradient(to right, #243949 0%, #517fa4 100%)"
    }
  }

  componentDidMount(){
    let selectedCrypto = window.location.href
    selectedCrypto = selectedCrypto.split('?')[2];
    if(selectedCrypto === undefined){
      return;
    }
    this.setState({backgroundImage: `linear-gradient(101deg, ${cryptoColor[cryptoCurrencies[selectedCrypto].label]}, ${cryptoColor[cryptoCurrencies[selectedCrypto].label]}`})
  }

  componentWillReceiveProps(props){
    let selectedCrypto = window.location.href
    selectedCrypto = selectedCrypto.split('?')[2];
    if(selectedCrypto === undefined){
      return;
    }
    this.setState({backgroundImage: `linear-gradient(101deg, ${cryptoColor[cryptoCurrencies[selectedCrypto].label]}, ${cryptoColor[cryptoCurrencies[selectedCrypto].label]}`})
  }

  render() {
    return (
      <a className="coloredBorder" onClick={this.props.onClick} style={{backgroundImage: this.state.backgroundImage}}>
        <span>{this.props.text}</span>
      </a>
    )
  }
}

export default Button;
