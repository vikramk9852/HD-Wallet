import React, { Component } from 'react';
import { Row, Col, Table, Progress } from 'antd';
import { withRouter } from 'react-router';
import { cryptoCurrencies, cryptoColor, noOfCrypto, currencySymbols } from '../../constants/cryptos';
import * as BlockchainInteraction from '../../utils/SubmitTransactions/ReturnInstances';
import Loader from '../../components/Loader';
import * as CryptoCompare from '../../utils/CryptoCompare';
import './index.scss';
import "antd/dist/antd.css";

const importAll = require =>
	require.keys().reduce((acc, next) => {
		acc[next.replace("./", "")] = require(next);
		return acc;
	}, {});

const images = importAll(
	require.context("../../../../src/assets/images", false, /\.(png|jpe?g|svg)$/)
);

class Statistics extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			showLoading: false,
			progressPercent: 0
		}
		this.columns = [
			{
				title: "Coin",
				dataIndex: 'coin',
				key: 'coin',
				width: '20%',
			},{
				title: "MarketCap",
				dataIndex: 'marketCap',
				key: 'marketCap',
				width: '10%',
				editable: false,
			},
			{
				title: "Balance",
				dataIndex: 'balance',
				key: 'balance',
				width: '10%',
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
		if(window.innerWidth < "890"){
			this.columns.splice(1, 1);
			console.log(this.columns)
		}
	}

	componentDidMount() {
		this.setState({ showLoading: true }, async () => {
			let dataSource = [], percent = 0;
			// let balance = new Array(noOfCrypto);
			// for (let i = 0; i < noOfCrypto; i++) {
			// 	var cryptoCurrency = cryptoCurrencies[i];
			// 	dataSource.push({
			// 		key: `row${i}`,
			// 		coin: <div><img src={images[`${cryptoCurrency.currency.toUpperCase()}.svg`]} width="40px" style={{ paddingRight: "10px" }} /><p style={{ display: "inline" }}>{cryptoCurrency.label}</p></div>,
			// 		marketCap: "MarketCap",
			// 		value: "Value",
			// 		percent: "0%",
			// 		onMouseEnter: this.mouseEnter
			// 	})
			// 	this.blockchainInteraction = BlockchainInteraction.getInstance(cryptoCurrency.label);
			// 	let currency = cryptoCurrency.currency.toUpperCase();
			// 	let currencyColor = cryptoColor[cryptoCurrency.label];
			// 	console.log(currency)
			// 	this.blockchainInteraction.getBalance().then(res => {
			// 		res = res.substr(0, 4);
			// 		let cryptoBalance = res + " " + currency;
			// 		dataSource[i].balance = <d style={{ color: currencyColor }}> {cryptoBalance}</d>;
			// 		if (i === noOfCrypto - 1) {
			// 			this.setState({ showLoading: false, dataSource: dataSource });
			// 		}
			// 	}).catch(err => {
			// 		dataSource[i].balance = <d style={{ color: currencyColor }}> 0 {currency} </d>;
			// 		if (i === noOfCrypto - 1) {
			// 			this.setState({ showLoading: false, dataSource: dataSource });
			// 		}					
			// 	});
			// }
			for (let i = 0; i < noOfCrypto; i++) {
				let cryptoCurrency = cryptoCurrencies[i];
				this.blockchainInteraction = BlockchainInteraction.getInstance(cryptoCurrency.label);
				let balance, value;
				let currency = cryptoCurrency.currency.toUpperCase();
				let localCurrency = localStorage.getItem("defaultCurrency");
				let localCurrencySymbol = currencySymbols[localCurrency];
				var fiatValue;
				try {
					balance = await this.blockchainInteraction.getBalance();
					value = await CryptoCompare.convert(currency, localCurrency);
					value = JSON.parse(value);
					fiatValue = value[currency.toString()][localCurrency];
					value = fiatValue * balance;
					value = value.toFixed(2);
					balance = parseFloat(balance);
					balance = balance.toFixed(2);
				} catch (err) {
					value = await CryptoCompare.convert(currency, localCurrency);
					value = JSON.parse(value);
					fiatValue = value[currency.toString()][localCurrency];
					balance = "0.00";
					value = "0.00";
				}
				let currencyColor = cryptoColor[cryptoCurrency.label];
				let cryptoBalance = balance + " " + currency;
				value = localCurrencySymbol + " " + value;
				let label = localCurrencySymbol + fiatValue + " " + localCurrency;
				dataSource.push({
					key: `row${i}`,
					coin: <div>
						<img src={images[`${cryptoCurrency.currency.toUpperCase()}.svg`]} width="40px" style={{ paddingRight: "10px", verticalAlign: "sub" }} />
						<span className="cryptoLabel">
							<p>{cryptoCurrency.label}</p><br />
							<p>{label}</p>
						</span>
					</div>,
					marketCap: "MarketCap",
					balance: <d style={{ color: currencyColor }}> {cryptoBalance}</d>,
					value: value,
					percent: "0%",
					onMouseEnter: this.mouseEnter
				})
				percent += (100 / noOfCrypto);
				this.setState({ progressPercent: parseInt(percent) });
			}
			this.setState({ dataSource: dataSource, showLoading: false });
			this.props.showLoader();
		})


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
			<div className="statistics" style={{ marginTop: "20px" }}>
				{this.state.showLoading ?
					<div className="statistics__loader">
						<Progress
							type="circle"
							percent={this.state.progressPercent}
							strokeColor="green"
						/>
						<div style={{ marginTop: "-60px" }}><Loader /></div>
					</div>
					:
					<Table
						bordered
						onRow={(record, rowIndex) => {
							return {
								onClick: (event) => { this.handleRowClick(rowIndex) },
								onMouseEnter: (event) => { this.mouseEnter(rowIndex) },
								onMouseLeave: (event) => { this.mouseLeave(rowIndex) },
							};
						}}
						dataSource={this.state.dataSource}
						columns={this.columns}
						pagination={false}
						rowClassName={(record) => record.key}
						style={{ overflow: "auto", backgroundColor: "rgba(42, 46, 50, 0.2)" }}
					/>
				}
			</div>
		)
	}
}

export default withRouter(Statistics);
