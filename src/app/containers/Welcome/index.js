import React, { Component } from 'react';
import { Row, Col, Icon } from 'antd';
import './index.scss';
import BorderedButton from '../../components/BorderedButton'
import "antd/dist/antd.css";
import { withRouter } from 'react-router';
import Statistics from '../Statistics';

class Welcome extends Component {

	constructor(props){
		super(props);
		this.state={
			text: "Create Account",
			boxText: "Create a new account to start doing Crypto"
		}
	}

	componentWillMount(){
		if(this.props.from !== "landingPage")
			this.setState({text: "Send assets", boxText: "Do Crypto with any supported digital asset"})
	}

	handleOnClick = (action) => {
		if(action === "recover"){
			this.props.history.push("/recover");
		}
		else{
			if(this.props.from === "landingPage"){
				this.props.history.push("/createwallet");
			}
			else{
				this.props.history.push('?cryptoMenu?0')
			}
		}
	}

	render() {
		return (
			<div className="mainPage">
				<div style={{ textAlign: 'center' }}>
					<Row className="welcomePage" gutter={24}>
						<Col span={24} align="middle">
							<h1 className="welcome">Welcome</h1>
						</Col>
						<Col xl={12} lg={12} sm={24} md={12} xs={24} align="middle">
							<div className="portfolioBox">
								<Icon className="portfolioIcon" type="user-add" />
								<p className="portfolioText">{this.state.boxText}</p>
								<BorderedButton className="welcomeButton" onClick={()=>{this.handleOnClick("sendAssets")}} text={this.state.text} />
							</div>
						</Col>
						<Col xl={12} lg={12} sm={24} md={12} xs={24} align="middle">
							<div className="portfolioBox">
								<Icon className="portfolioIcon" type="user-add" />
								<p className="portfolioText">{"Restore using your 12-word Phrase or email recovery file."}</p>
								<BorderedButton className="welcomeButton" onClick={()=>{this.handleOnClick("recover")}} text="Recover" />
							</div>
						</Col>
					</Row>
				{this.props.from !== "landingPage"&&	
				<Statistics />
				}
				</div>
			</div>
		)
	}
}

export default withRouter(Welcome);
