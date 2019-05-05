import React, { Component } from 'react';
import { message, Row, Col, Icon } from 'antd';
import * as WalletFunction from '../../utils/Wallet';
import './index.scss';
import printJS from 'print-js';

// const Step = Steps.Step;

const textBodyArray = [
    "You must remember your password-it cannot be recovered.\nUse a different from your social media accounts in case someone gets\naccess to your system",
    "Write down your password and keep it somewhere safe, like a safe\ndeposit box, until you memorize it.",
    "This set of 12 words allows you to recover your wallet in case of loss or damage.\nWrite or print this on paper and keep it safe. Without it you are not able to recover\nyour money.",
    "Your Param account is created successfully.\nNow you can create and share digital\nreceipts securely"
]
const textHeadArray = [
    "Create your password",
    "Confirm Password",
    "12 Phrase Recovery Words",
    "Account Created"
]


const coloredCircle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "35px",
    height: "35px",
    backgroundImage: "linear-gradient(to right, #243949 0%, #517fa4 100%)",
    borderRadius: "35px",
    color: "#ffffff",
    fontSize: "16px"
}

const transparentCircle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "35px",
    height: "35px",
    border: "solid 1px #979797",
    backgroundColor: "#464d51",
    borderRadius: "35px",
    fontSize: "16px",
    color: "gray",
    "font-weight": "200"
}

const icon = <Icon type="check" />


const initialState = {
    textHead: textHeadArray[0],
    textBody: textBodyArray[0],
    primaryButtonAlign: "center",
    primaryButtonText: "Next",
    secondaryButtonText: "Back",
    password: "",
    passPhrase: "",
    previousState: {},
    passwordValue: "",
    confirmPasswordValue: "",
    windowSize: "40.88%",
    roundCircle: [coloredCircle, transparentCircle, transparentCircle, transparentCircle],
    show: [1, 2, 3, 4],
    stepNo: 1,
    textBodyBottomPadding: "100px",
    showLoading: false
}

class CreateWallet extends Component {

    constructor(props) {
        super(props);
        this.state = initialState
        this.handlePrimaryChange = this.handlePrimaryChange.bind(this);
        this.handleSecondaryChange = this.handleSecondaryChange.bind(this);
        this.showPassPhrase = this.showPassPhrase.bind(this);
        this.onHandleChange = this.onHandleChange.bind(this);

    }

    onHandleChange(e) {
        this.setState({
            passwordValue: e.target.value
        });
    }

    goToInitialStep = () => {
        if (this.state.stepNo === 1)
            this.props.history.push('/');
    }

    handlePrimaryChange() {
        const newCircleArray = this.state.roundCircle.slice()
        newCircleArray[this.state.stepNo] = coloredCircle

        const newShowArray = this.state.show.slice()
        newShowArray[this.state.stepNo - 1] = icon

        this.setState({
            stepNo: this.state.stepNo + 1,
            textBody: textBodyArray[this.state.stepNo],
            textHead: textHeadArray[this.state.stepNo],
            previousState: this.state,
            roundCircle: newCircleArray,
            show: newShowArray
        });

        switch (this.state.stepNo) {
            case 1:
                this.setState({
                    password: document.getElementById('password1').value,
                    passwordValue: "",
                })
                if (document.getElementById('password1').value.length === 0) {
                    message.warning("password cannot be empty", 1)
                    this.setState(initialState)
                }
                return
            case 2:
                this.setState({
                    secondaryButtonText: "Print",
                    windowSize: "63.02%",
                    textBodyBottomPadding: "24px",
                })
                var confirmPassword = document.getElementById('password1').value
                if (this.state.password === confirmPassword) {
                    this.setState({ showLoading: true })
                    localStorage.clear();
                    localStorage.setItem("password", this.state.password)
                    WalletFunction.createWallet(confirmPassword).then((wallet) => {
                        this.setState({
                            passPhrase: wallet.mnemonic,
                            showLoading: false
                        })
                    })
                    return
                }
                else {
                    message.error("Passwords didn't match", 1)
                    this.setState(this.state)
                    return
                }
                break;

            case 3:
                this.setState({
                    primaryButtonText: "Proceed",
                    primaryButtonAlign: "center",
                    windowSize: "34.16%",
                    textBodyBottomPadding: "34px",
                    passPhrase: ""
                })
                return
            case 4:
                this.props.history.push('/home?portfolio');
                break;

            default:
                break;
        }

    }

    handleSecondaryChange() {
        if (this.state.stepNo === 2) {
            this.setState(this.state.previousState)
        }
        else {
            printJS('printPassPhrase', 'html');
        }
    }

    showPassPhrase() {
        let passArray = this.state.passPhrase.split(' ')
        let column = []
        for (let i = 0; i < 12; i++) {
            var first = <div className="passPhraseBox">{i + 1}</div>
            var second = <div className="passPhraseText">{passArray[i]}</div>
            column.push(<Col className="gutter-row" xl={6} l={6} md={8} sm={8} xs={12} align="middle" style={{ paddingBottom: "5pxrem", paddingRight: "2rem" }}>{first}{second}</Col>)
        }
        return <Row>{column}</Row>
    }

    handleKeyPress = (event) => {
        if (event.key === "Enter") {
            this.handlePrimaryChange();
        }
    }

    render() {

        return (

            <div className="createWallet">
                <p id="printPassPhrase" style={{float: "left", color: "transparent", width: "600px" }}>{this.state.passPhrase}</p>
                <div className="createWallet__stepper">
                    <Row className="line">
                        <Col align="middle" span={6}><div style={this.state.roundCircle[0]}>{this.state.show[0]}</div></Col>
                        <Col align="middle" span={6}><div style={this.state.roundCircle[1]}>{this.state.show[1]}</div></Col>
                        <Col align="middle" span={6}><div style={this.state.roundCircle[2]}>{this.state.show[2]}</div></Col>
                        <Col align="middle" span={6}><div style={this.state.roundCircle[3]}>{this.state.show[3]}</div></Col>
                    </Row>
                    <Row>
                        <Col style={{ color: "gray" }} align="middle" span={6} className="centerBox">Password</Col>
                        <Col style={{ color: "gray" }} align="middle" span={6} className="centerBox">Confirm</Col>
                        <Col style={{ color: "gray" }} align="middle" span={6} className="centerBox">12 Phrase</Col>
                        <Col style={{ color: "gray" }} align="middle" span={6} className="centerBox">Success</Col>
                    </Row>
                </div>
                <Row align="middle">
                    <Col className="createWallet__textHead" align="middle">
                        <h1>{this.state.textHead}</h1>
                    </Col>
                    {
                        this.state.stepNo === 4 &&
                        <Row className="createWallet__success">
                            <Col align="middle">
                                {/* <p align="center">Show success Icon</p> */}
                                <Icon type = "edit" style={{ fontSize: "40px" }} />
                            </Col>
                        </Row>
                    }
                    <Col className="createWallet__textBody" align="middle" style={{ paddingBottom: this.state.textBodyBottomPadding }}>
                        <div>{this.state.textBody}</div>
                    </Col>
                </Row>
                <div style={{ margin: "0 auto" }}>
                    {
                        this.state.stepNo < 3
                            ?
                            <div>
                                <Row gutter={24} className="createWallet__gradientBox__passwordBox">
                                    <Col span={24} align="middle">
                                        <input
                                            autoFocus
                                            id="password1"
                                            type="password"
                                            placeholder="Enter Your Password"
                                            onKeyPress={this.handleKeyPress}
                                            onChange={this.onHandleChange}
                                            value={this.state.passwordValue}
                                        />
                                    </Col>
                                </Row>

                                <br />
                                <br />
                            </div>
                            :
                            <div>
                                {
                                    this.state.showLoading &&
                                    <Row style={{width: "fit-content", margin:"0 auto"}}>
                                        <Col>
                                            <Icon type="loading" style={{ fontSize: "40px" }} />
                                        </Col>
                                    </Row>
                                }
                                {
                                    this.state.stepNo === 3 && !this.state.showLoading &&
                                    <Row className="createWallet__gradientBox__passPhrase">
                                        <Col align="middle">{this.showPassPhrase()}</Col>
                                    </Row>
                                }
                            </div>
                    }
                    {
                        !this.state.showLoading &&
                        <div>
                            {this.state.stepNo === 2 || this.state.stepNo === 3
                                ?
                                <Row gutter={24} className="createWallet__responseButton gutter-example">
                                    <div className="createWallet__responseButton_box">
                                        <Col className="gutter-row" xl={12} lg={12} md={24} sm={24} xs={24} align="center">
                                            <button
                                                className="createWallet__responseButton_box_button"
                                                style={{ backgroundColor: "transparent", border: "1px solid white" }}
                                                onClick={this.handleSecondaryChange}>{this.state.secondaryButtonText}
                                            </button>
                                        </Col>
                                        <Col className="gutter-row" xl={12} lg={12} md={24} sm={24} xs={24} align="center">
                                            <button
                                                className="createWallet__responseButton_box_button"
                                                style={{ backgroundImage: "linear-gradient(to right, #243949 0%, #517fa4 100%)" }}
                                                onClick={this.handlePrimaryChange} >{this.state.primaryButtonText}
                                            </button>
                                        </Col>
                                    </div>
                                </Row>
                                :
                                <Row gutter={24} className="createWallet__responseButton">
                                    <Col span={24} align="center">
                                        <button
                                            className="createWallet__responseButton_box_button"
                                            style={{ backgroundImage: "linear-gradient(to right, #243949 0%, #517fa4 100%)" }}
                                            onClick={this.handlePrimaryChange} >{this.state.primaryButtonText}
                                        </button>
                                    </Col>
                                </Row>
                            }
                        </div>
                    }
                </div>

            </div>

        );
    }


}

export default CreateWallet;
