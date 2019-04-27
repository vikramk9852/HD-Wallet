import React, { Component } from 'react';
import './index.scss';


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

    }

    handlePrimaryChange() {
        const newCircleArray = this.state.roundCircle.slice()
        newCircleArray[this.state.stepNo] = coloredCircle

        const newShowArray = this.state.show.slice()
        newShowArray[this.state.stepNo - 1] = icon

        this.setState({
            roundCircle: newCircleArray,
            show: newShowArray
        });
    }


    render() {

        return (

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
                

        );
    }


}

export default CreateWallet;
