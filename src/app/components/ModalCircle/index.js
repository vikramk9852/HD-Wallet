import React, { Component } from 'react';
import { Icon } from 'antd';
import { withRouter } from 'react-router';
import { cryptoCurrencies, cryptoColor } from '../../constants/cryptos';
import './index.scss';
import "antd/dist/antd.css";

class LeftMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            circleColor: "#4C7799"
        }
    }

    componentDidMount() {
        this.setCircleColor();
    }

    componentWillReceiveProps() {
        this.setCircleColor();
    }


    setCircleColor = () => {
        let selectedCrypto = window.location.href
        selectedCrypto = selectedCrypto.split('?')[2];
        if(selectedCrypto === undefined){
            return ;
        }
        this.setState({ circleColor: cryptoColor[cryptoCurrencies[selectedCrypto].label] })
    }

    render() {
        return (
            <div className="modalCircle" onClick={this.props.onClick} onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave}
                style={{ color: this.state.circleColor, border: `3px solid ${this.state.circleColor}` }}>
                <div className="circleIcon"><Icon type={this.props.type} /></div>
            </div>
        )
    }
}

export default withRouter(LeftMenu);
