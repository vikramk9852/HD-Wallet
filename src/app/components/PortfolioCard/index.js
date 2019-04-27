import React, { Component } from 'react';
import { Icon } from 'antd';
import BorderedButton from '../BorderedButton'
import './index.scss';
import "antd/dist/antd.css";

class PortfolioBox extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="portfolioBox">
        <Icon type={this.props.icon} />
        <p>{this.props.text}</p>
        <BorderedButton onClick={this.props.onClick} text="click"/>
      </div>
    )
  }
}

export default PortfolioBox;
