import React, { Component } from 'react';
import { Icon, Input, Row, Col, message } from 'antd';
import * as WalletFunction from '../../utils/Wallet';
import './index.scss';
const textBodyArray = [
    "Type your 12-word Phrase",
    "You must remember your password-it cannot be recovered.\nUse a different from your social media accounts in case someone gets\naccess to your system",
    "Write down your password and keep it somewhere safe, like a safe\ndeposit box, until you memorize it.",
    "Your wallet is restored successfully.\nNow you can send and receive\ncrypto securely"
]
const textHeadArray = [
    "Restore Wallet",
    "Create your password",
    "Confirm Password",
    "Account Restored"
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
    backgroundColor: "#F0F1F5",
    borderRadius: "35px",
    // opacity: "0.5",
    fontSize: "16px",
    "color": "gray",
    "font-weight": "200"
}

const icon = <Icon type="check" />

const initialState = {
    textHead: textHeadArray[0],
    textBody: textBodyArray[0],
    primaryButtonAlign: "center",
    secondaryButtonAlign: "left",
    primaryButtonText: "Submit",
    secondaryButtonText: "Back",
    password: "",
    passPhrase: "",
    previousState: {},
    passwordValue: "",
    inputBox: 1,
    windowSize: "63.02%",
    roundCircle: [coloredCircle, transparentCircle, transparentCircle, transparentCircle],
    show: [1, 2, 3, 4],
    stepNo: 1,
    textBodyBottomPadding: "2rem",
    showLoading: false
}

class RecoverWallet extends Component {

    constructor(props) {
        super(props);
        this.state = initialState
        this.handlePrimaryChange = this.handlePrimaryChange.bind(this);
        this.handleSecondaryChange = this.handleSecondaryChange.bind(this);
        this.onHandleChange = this.onHandleChange.bind(this);
        this.splittedInputBox = this.splittedInputBox.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handlePaste(event) {
        event.preventDefault()
        var mnemonic = event.clipboardData.getData('Text').split(' ')
        var len = mnemonic.length
        var id = event.target.id
        var idNo
        for (var i = 0; i < len; i++) {
            if (id != "field12") {
                var inpField = document.getElementById(id)
                inpField.focus()
                inpField.value = mnemonic[i]

                if (id.length == 7) {
                    idNo = parseInt(id[5] + id[6])
                }
                else {
                    idNo = parseInt(id[5])
                }
                id = "field" + (idNo + 1)
            }
        }
    }


    onHandleChange(e, props) {
        this.setState({
            passwordValue: e.target.value
        });
    }

    handleKeyPress(event) {
        if (event.which == 32) {
            var id = event.target.id
            var value = document.getElementById(id).value
            var idNo
            if (id != "field11") {
                if (id.length == 7) {
                    idNo = parseInt(id[5] + id[6])
                }
                else {
                    idNo = parseInt(id[5])
                }
            }
            else {
                return
            }
            id = "field" + (idNo + 1)
            var nextInput = document.getElementById(id)
            nextInput.focus()
        }
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
                var input = "";
                var id;
                for (let i = 0; i < 12; i++) {
                    id = "field" + i;
                    var text = document.getElementById(id).value;
                    input += text.trim() + ' ';
                }
                input = input.trim()
                this.setState({
                    passPhrase: input,
                    textBodyBottomPadding: "80px"

                })
                if (!WalletFunction.validateMnemonic(input)) {
                    message.error("Pass phrase is invalid", 1);
                    this.setState(initialState);
                }
                return

            case 2:
                this.setState({
                    password: document.getElementById('password').value,
                    passwordValue: ""
                })
                return
            case 3:
                this.setState({
                    primaryButtonText: "Proceed",
                })
                var confirmPassword = document.getElementById('password').value
                if (this.state.password === confirmPassword) {
                    localStorage.clear();
                    this.setState({ showLoading: true });
                    WalletFunction.restoreWallet(confirmPassword, this.state.passPhrase).then(() => {
                        this.setState({ showLoading: false });
                    })
                    message.success("successfully restored acount", 1);
                    return
                }
                message.error("password doesn't match", 1);
                this.setState(this.state)
                return
            case 4:
                this.props.history.push('/home?portfolio');
                break;
            default:
                break;
        }

    }

    handleSecondaryChange() {
        if(localStorage.getItem("masterSeed") !== null){
            this.props.history.go(-1);
        }
        else{
            this.setState(this.state.previousState)
        }
    }

    splittedInputBox() {
        let column = []
        for (let i = 0; i < 12; i++) {
            var fieldId = "field" + i
            if (i == 0) {
                var first = <Input style={{color: "gray"}} autoFocus className="splitted-input" autoComplete="off" id={fieldId} onPaste={this.handlePaste} placeholder={i + 1} onKeyPress={this.handleKeyPress} />
            }
            else {
                var first = <Input style={{color: "gray"}} className="splitted-input" autoComplete="off" id={fieldId} onPaste={this.handlePaste} placeholder={i + 1} onKeyPress={this.handleKeyPress} />
            }
            column.push(<Col className="splitted-input-gutter-row" xl={4} lg={4} md={4} sm={6} xs={12} align="center">{first}</Col>)
        }
        return <Row style={{ width: "80%" }}>{column}</Row>
    }

    redirectBack = () => {
        // //debugger;
        this.props.history.go(-1);
    }

    handleLoginKeyPress = (event) => {
        if (event.key === "Enter") {
            this.handlePrimaryChange();
        }
    }

    render() {
        return (
            <div className="recoverWalletBg">
                <div className="recoverwallet">
                    <div className="recoverwallet__stepper">
                        <Row className="line">
                            <Col align="middle" span={6}><div style={this.state.roundCircle[0]}>{this.state.show[0]}</div></Col>
                            <Col align="middle" span={6}><div style={this.state.roundCircle[1]}>{this.state.show[1]}</div></Col>
                            <Col align="middle" span={6}><div style={this.state.roundCircle[2]}>{this.state.show[2]}</div></Col>
                            <Col align="middle" span={6}><div style={this.state.roundCircle[3]}>{this.state.show[3]}</div></Col>
                        </Row>
                        <Row>
                            <Col align="middle" style={{ color: "gray" }} span={6} className="centerBox">Password</Col>
                            <Col align="middle" style={{ color: "gray" }} span={6} className="centerBox">Confirm</Col>
                            <Col align="middle" style={{ color: "gray" }} span={6} className="centerBox">12 Phrase</Col>
                            <Col align="middle" style={{ color: "gray" }} span={6} className="centerBox">Success</Col>
                        </Row>
                    </div>
                    <Row align="middle">
                        <Col className="recoverwallet__textHead" align="middle">
                            <h1>{this.state.textHead}</h1>
                        </Col>
                        <Col className="createWallet__textBody" align="middle" style={{ paddingBottom: this.state.textBodyBottomPadding }}>
                            {this.state.textBody}
                            <br />
                        </Col>

                    </Row>
                    {
                        this.state.showLoading &&
                        <Row style={{ width: "fit-content", margin: "0 auto" }}>
                            <Col>
                                <Icon type="loading" style={{ fontSize: "40px" }} />
                            </Col>
                        </Row>
                    }

                    {

                        this.state.stepNo === 4 &&
                        <Row>
                            <Col align="middle">
                                <Icon type="edit" style={{ fontSize: "40px" }} />
                            </Col>
                        </Row>
                    }
                    <div className="recoverwallet__gradientBox">
                        {
                            this.state.stepNo > 1 && this.state.stepNo < 4
                                ?
                                <Row className="createWallet__gradientBox__passwordBox">
                                    <Col align="middle">
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Enter Password"
                                            onKeyPress={this.handleLoginKeyPress}
                                            onChange={this.onHandleChange}
                                            value={this.state.passwordValue}
                                        />
                                    </Col>
                                </Row>
                                :
                                <div>
                                    {
                                        this.state.stepNo === 1 &&
                                        <div className="recoverwallet__passPhrase" align="center">
                                            <br />{this.splittedInputBox()}</div>
                                    }
                                </div>
                        }

                        {
                            !this.state.showLoading &&
                            <div style={{ marginTop: "4rem" }}>
                                {this.state.stepNo === 3 || (localStorage.getItem("masterSeed") !== null && this.state.stepNo === 1)
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
            </div>

        );
    }
}

export default RecoverWallet;
