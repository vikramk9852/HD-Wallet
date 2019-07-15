import React, { Component } from 'react';
import { message, Row, Col, Icon } from 'antd';
import * as WalletFunction from '../../utils/Wallet';
import BorderedButton from '../../components/BorderedButton';
import './index.scss';
import printJS from 'print-js';

const initialState = {
    passwordValue: "",
    showLoading: false,
    buttonText: "Backup",
    enterPassword: false,
    backupHeading: "Take Backup of Your Wallet",
    backupText: ""
}

class Backup extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
        this.onHandleChange = this.onHandleChange.bind(this);
        this.backup = this.backup.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    onHandleChange(e) {
        this.setState({
            passwordValue: e.target.value
        });
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            this.backup();
        }
    }

    backup = () => {
        if (this.state.buttonText === "Backup") {
            this.setState({ buttonText: "Submit", enterPassword: true, backupHeading: "Enter Your Password" });
            return;
        }
        let result;
        let password = document.getElementById("password").value;
        result = WalletFunction.logIn(password, true);
        if (result) {
            this.setState({backupPhrase: result},()=>{
                document.getElementById("backupPhrase").style.display = "block";
                printJS('backupPhrase', 'html');
                document.getElementById("backupPhrase").style.display = "none";
            })
        }
        else {
            message.error("Wrong password", 1);
        }
    }

    render() {
        return (
            <div className="backup">
                <h1 className="backup__heading">{this.state.backupHeading}</h1>
                <p className="backup__text">You will get your 12 Word Phrase, which may be used to recover your account</p>
                <Row className="backup__passwordBox">
                <p id="backupPhrase" style={{float: "left", color: "transparent", width: "600px", display: "none" }}>{this.state.backupPhrase}</p>
                    {this.state.enterPassword ?
                        <Col align="middle">
                            <input id="password" type="password" autoFocus onKeyPress={this.handleKeyPress} />
                        </Col>
                        :
                        <Col align="middle">
                            <Icon type="undo" style={{fontSize: "80px", color: "gray"}} />
                        </Col>
                    }
                </Row>
                <Row className="circleRow" gutter={24} style={{ margin: "0 auto" }}>
                    <BorderedButton text={this.state.buttonText} onClick={this.backup} />
                </Row>
            </div>
        )
    }
}

export default Backup;
