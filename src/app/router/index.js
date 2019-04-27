import React from 'react';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { Layout, Menu, Icon, Affix } from 'antd';
import HomePage from '../containers/HomePage';
import LeftMenu from '../components/Menu';
import LandingPage from '../containers/LandingPage';
import CreateWallet from '../containers/CreateWallet';
import RecoverWallet from '../containers/RecoverWallet';
import Login from '../containers/Login';
import './index.scss';

const { Header, Content, Footer, Sider } = Layout;

class Router extends React.Component {

	constructor(props){
		super(props);
		this.state={
			landingPage: false
		}
	}

	componentWillMount(){
		let hash = window.location.hash

		if(localStorage.getItem("hashedPassword") !== null){
			this.props.history.push("/login");
			return ;
		}

		if(hash === "#/recover" || hash === "#/" || hash === "#/createwallet" || hash === "#/login"){
			this.setState({landingPage: true});
		}
		else{
			this.setState({landingPage: false});
		}
	}

	componentWillReceiveProps(nextProps){
		if(this.props != nextProps){
			let hash = window.location.hash
			if(hash === "#/recover" || hash === "#/" || hash === "#/createwallet" || hash === "#/login"){
				this.setState({landingPage: true});
			}
			else{
				this.setState({landingPage: false});
			}
		}
	}

	render() {
		console.log("render", this.state.landingPage)
		return (
			<Layout className="uiContainer">
				<Layout className="mainLayout">
					{window.innerWidth > 769 && !this.state.landingPage && <LeftMenu renderRight={this.menuItemClick} />}
					<Content style={{ overflow: 'initial' }}>
						<Switch>
							<Route exact path='/' component={LandingPage} />
							<Route path='/home' component={HomePage} />
							<Route path='/createwallet' component={CreateWallet} />
							<Route path='/recover' component={RecoverWallet} />
							<Route path='/login' component={Login} />
						</Switch >
					</Content>
				</Layout>
			</Layout>
		);
	}
}

export default withRouter(Router);

