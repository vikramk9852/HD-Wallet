import React, { Component } from 'react';
import { Row, Card, Menu, Select } from 'antd';
import { withRouter } from 'react-router';
import { cryptoCurrencies, cryptoColor } from '../../constants/cryptos';
import './index.scss';
import "antd/dist/antd.css";

const Option = Select.Option;

class Settings extends React.Component {
	state = {
		current: 'localization',
	}

	handleClick = (e) => {
		this.setState({
			current: e.key,
		});
	}

	setDefaultCurrency = (e) => {
		localStorage.setItem("defaultCurrency", e);
	}

	logout = () => {
		this.props.history.push('/login');
	}

	render() {
		const defaultCurrency = localStorage.getItem("defaultCurrency") || "USD";
		return (
			<div className="settingContainer">
				<Menu
					onClick={this.handleClick}
					selectedKeys={[this.state.current]}
					mode="horizontal"
				>
					<Menu.Item key="localization">
						Localization
        			</Menu.Item>
					<Menu.Item key="theme">
						Theme
					</Menu.Item>
				</Menu>
				<button className="createWallet__responseButton_box_button"
					style={{ backgroundImage: "linear-gradient(to right, #243949 0%, #517fa4 100%)", bottom: "20%", position: "absolute" }}
					onClick={this.logout}
				>
					Logout
				</button>
				{
					this.state.current === "logout" ?
						<Card
							className="settingContainer__logout"
							bordered={false}
						>
							<h1 style={{ margin: "30px auto 30px auto", width: "fit-content" }}>Logout from the Wallet</h1>

						</Card>
						:
						this.state.current === "localization" ?
							<div>
								<p style={{ fontSize: "40px", color: "white", margin: "10px auto 0 auto" }}>Currency</p>
								<p style={{ fontSize: "15px", color: "gray", marginBottom: "50px" }}>Set your Preffered Currency</p>
								<Select defaultValue={defaultCurrency} style={{ width: "280px" }} onChange={this.setDefaultCurrency}>
									<Option value="USD">USD</Option>
									<Option value="INR">INR</Option>
									<Option value="EUR">EUR</Option>
								</Select>
							</div>
							:
							<div></div>
				}
			</div>
		);
	}
}

export default withRouter(Settings);
