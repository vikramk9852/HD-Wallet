import React, { Component } from 'react';
import { message, Row, Col, Card } from 'antd';
import * as WalletFunction from '../../utils/Wallet';
import ModalCircle from '../../components/ModalCircle';
import './index.scss';

const initialState = {
    passwordValue: "",
    showLoading: false,
}

class LogIn extends Component {

    constructor(props) {
        super(props);
        this.state = initialState
        this.onHandleChange = this.onHandleChange.bind(this);
        this.login = this.login.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    onHandleChange(e) {
        this.setState({
            passwordValue: e.target.value
        });
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            this.login();
        }
    }

    handleCircleClick = (circleNo) => {
        switch (circleNo) {
            case 0:

                break;
            case 1:
                this.props.history.push("/recover");
                break;
            case 2:
                this.props.history.push("/createwallet");
                break;
        }
    }

    login = () => {
        let result;
        let password = document.getElementById("password").value;
        result = WalletFunction.logIn(password);
        if (result) {
            message.success("Successfully logged in", 1);
            this.props.history.push('./home?portfolio');
        }
        else {
            message.error("Wrong password", 1);
        }
    }

    render() {

        return (

            <div className="login">
                <h1 className="login__heading">LogIn</h1>
                <Row className="login__passwordBox">
                    <Col align="middle">
                        <input id="password" type="password" autoFocus onKeyPress={this.handleKeyPress} />
                    </Col>
                </Row>
                <Row className="circleRow" gutter={24} style={{ margin: "0 auto" }}>
                    <Col align="middle" span={8}><ModalCircle onClick={() => { this.handleCircleClick(0) }} type="question" />Help</Col>
                    <Col align="middle" span={8}><ModalCircle onClick={() => { this.handleCircleClick(1) }} type="undo" />Recover</Col>
                    <Col align="middle" span={8}><ModalCircle onClick={() => { this.handleCircleClick(2) }} type="export" />Quit</Col>
                </Row>
            </div>
        )
    }
}

export default LogIn;
