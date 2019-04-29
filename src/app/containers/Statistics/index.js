import React, { Component } from 'react';
import { Row, Col, Table, Icon } from 'antd';
import { withRouter } from 'react-router';
import { cryptoCurrencies, cryptoColor } from '../../constants/cryptos';
import './index.scss';
import "antd/dist/antd.css";

const importAll = require =>
	require.keys().reduce((acc, next) => {
		acc[next.replace("./", "")] = require(next);
		return acc;
	}, {});

const images = importAll(
	require.context("../../../../node_modules/cryptocurrency-icons/svg/color", false, /\.(png|jpe?g|svg)$/)
);
const noOfCrypto = 13;

class Statistics extends Component {

	constructor(props) {
		super(props);
		this.state={
			dataSource: []
		}
		this.columns = [
			{
				title: "Icon",
				dataIndex: 'icon',
				key: 'icon',
				width: '20%',
			}, 
			{
				title: "MarketCap",
				dataIndex: 'marketCap',
				key: 'marketCap',
				width: '10%',
				editable: false,
			},
			{
				title: "Currency",
				dataIndex: 'currency',
				key: 'currency',
				width: '20%',
				editable: false,
			},
			{
				title: "Value",
				dataIndex: 'value',
				key: 'value',
				width: '10%',
				editable: false,
			},
			{
				title: "Percent",
				dataIndex: 'percent',
				key: 'percent',
				width: '5%',
				editable: false
			}
		]
	}

	componentDidMount(){
		let dataSource = []
		for(let i = 0; i < noOfCrypto; i++){
			let selectedCrypto = i
			let cryptoCurrency = cryptoCurrencies[selectedCrypto]
			dataSource.push({
				key: `row${i}`,
				icon: <div><img src={images[`${cryptoCurrency.currency}.svg`]} width="40px" style={{paddingRight:"10px"}}/><p style={{display: "inline"}}>{cryptoCurrency.label}</p></div>,
				marketCap: "MarketCap",
				currency: <d style={{color: cryptoColor[cryptoCurrency.label]}}>{cryptoCurrency.currency.toUpperCase()}</d>,
				value: "Value",
				percent: "0%",
				onMouseEnter: this.mouseEnter
			})
		}
		this.setState({dataSource: dataSource})
	}

	mouseEnter = (rowIndex) => {
		let borderRightColor = cryptoColor[cryptoCurrencies[rowIndex].label];
		document.getElementsByClassName(`row${rowIndex}`)[0].style.borderRight = `4px solid ${borderRightColor}`;
	}

	mouseLeave = (rowIndex) => {
		document.getElementsByClassName(`row${rowIndex}`)[0].style.borderRight = "4px solid transparent";
	}

	handleRowClick = (cryptoIndex) => {
		this.props.history.push(`home?cryptoMenu?${cryptoIndex}`);
	}

	renderCryptoDetails = rows => {
		let row = [];
		for (let i = 0; i < rows; i++) {
			row.push(
				<Row gutter={24} id={`row${i}`} className="detailsRow"
					style={{ backgroundColor: "rgba(42, 46, 50, 0.2)" }}
					onMouseEnter={() => this.mouseEnter(i)}
					onMouseLeave={() => this.mouseLeave(i)}
					onClick={() => this.handleRowClick(i)}
				>
					<Col span={4} align={"middle"} className="rowIcon"><img width="49px" src={images[`${cryptoCurrencies[i].currency.toUpperCase()}.svg`]} /></Col>
					<Col span={4} align={"middle"} className="rowCrypto">{cryptoCurrencies[i].label}</Col>
					<Col span={4} align={"middle"} className="rowMarketCap">MarketCap</Col>
					<Col span={4} align={"middle"} className="rowBalance" style={{ color: cryptoColor[cryptoCurrencies[i].label] }}>{"0 " + cryptoCurrencies[i].currency}</Col>
					<Col span={4} align={"middle"} className="rowValue">Value</Col>
					<Col span={4} align={"middle"} className="rowAssetPercent">Percent</Col>
				</Row>
			)
		}
		return row;
	}

	render() {
		return (
			<div className="statistics" style={{marginTop: "20px"}}>
				<Table
					bordered
					onRow={(record, rowIndex) => {
						return {
						  onClick: (event) => {this.handleRowClick(rowIndex)},    
						  onMouseEnter: (event) => {this.mouseEnter(rowIndex)}, 
						  onMouseLeave: (event) => {this.mouseLeave(rowIndex)}, 
						};
					  }}
					dataSource={this.state.dataSource}
					columns={this.columns}
					pagination={false}
					rowClassName={(record)=>record.key}
					style={{ overflow: "auto", backgroundColor: "rgba(42, 46, 50, 0.2)" }}
              />
			</div>
		)
	}
}

export default withRouter(Statistics);
