import React, { Component } from 'react';
import { Modal, Card, Menu, Select, message, Row, Col } from 'antd';
import { withRouter } from 'react-router';
import BordererdButtom from '../../components/BorderedButton';
import * as WalletFunction from '../../utils/Wallet';
import './index.scss';
import "antd/dist/antd.css";

const Option = Select.Option;

class Settings extends React.Component {
	state = {
		current: 'localization',
		changePassword: false
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

	changePassword = () => {
		let oldPassword = document.getElementById("oldPassword").value;
		let newPassword = document.getElementById("newPassword").value;
		let confirmPassword = document.getElementById("confirmPassword").value;
		if (newPassword === confirmPassword) {
			let changeResult = WalletFunction.changePassword(oldPassword, newPassword)
			if (changeResult) {
				message.success("Password Changed Successfully", 1);
				this.setState({ changePassword: false });
			}
			else {
				message.error("Please Enter correct Old password", 1);
			}
		}
		else {
			message.warning("New Passwords doesn't match", 1);
		}
	}

	togglePasswordChangeModal = () => {
		this.setState({ changePassword: !this.state.changePassword });
	}

	render() {
		const defaultCurrency = localStorage.getItem("defaultCurrency") || "USD";
		return (
			<div className="settingContainer">
				{this.state.changePassword &&
					<Modal
						onCancel={this.togglePasswordChangeModal}
						visible={true}
						footer={null}
						centered={true}
						keyboard={true}
						maskClosable={false}
						closable={true}
						width="720px"
					>
						<div className="settingContainer__changePassword">
							<input id="oldPassword" type="password" autoFocus placeholder="Enter Your Old password" />
							<input id="newPassword" type="password" placeholder="Enter New Password" />
							<input id="confirmPassword" type="password" placeholder="Confirm New Password" />
						</div>
						<BordererdButtom text="Submit" onClick={() => { this.changePassword() }} />

					</Modal>
				}
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
				<Row style={{position: "absolute", bottom: "10%"}}>
					<Col style={{padding: "10px"}}>
						<button className="createWallet__responseButton_box_button"
							style={{ backgroundImage: "linear-gradient(to right, #243949 0%, #517fa4 100%)"}}
							onClick={this.togglePasswordChangeModal}
						>
							Change Password
							
						</button>
					</Col>
					<Col>
						<button className="createWallet__responseButton_box_button"
							style={{ backgroundImage: "linear-gradient(to right, #243949 0%, #517fa4 100%)"}}
							onClick={this.logout}
						>
							Logout
						</button>
					</Col>
				</Row>
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
