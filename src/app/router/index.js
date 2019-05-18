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
import Backup from '../containers/Backup';
import Settings from '../containers/Settings';
import './index.scss';

const { Header, Content, Footer, Sider } = Layout;

class Router extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			landingPage: false
		}
	}
	componentWillMount() {
		if (localStorage.length === 0) {
			this.props.history.push("/")
		}
	}
	componentDidMount() {

		if (this.isLoginPage()) {
			let status = localStorage.getItem("masterSeed");
			if (status === null) {
				//navigation to launch screen
				this.props.history.push('/')
			}
			else {
				//navigation to login screen
				this.props.history.push('/login')
			}
		}
	}

	isLoginPage() {
		let currentPage = window.location.hash;
		currentPage = currentPage.replace("#", "");
		currentPage = currentPage.split('?')[0];
		return currentPage === "" || currentPage === "/" || currentPage === "/login"
	}

	landingPage = () => {
		let hash = window.location.hash;
		return hash === "#/recover" || hash === "#/" || hash === "#/createwallet" || hash === "#/login" ;
	}

	render() {
		return (
			<Layout className="uiContainer">
				<Layout className="mainLayout">
					{!this.landingPage() && <LeftMenu renderRight={this.menuItemClick} />}
					<Content style={{ overflow: 'initial' }}>
						<Switch>
							<Route exact path='/' component={LandingPage} />
							<Route path='/home' component={HomePage} />
							<Route path='/createwallet' component={CreateWallet} />
							<Route path='/recover' component={RecoverWallet} />
							<Route path='/login' component={Login} />
							<Route path='/backup' component={Backup} />
							<Route path='/settings' component={Settings} />
						</Switch >
					</Content>
				</Layout>
			</Layout>
		);
	}
}

export default withRouter(Router);

