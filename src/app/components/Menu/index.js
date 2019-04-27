import React, { Component } from 'react';
import { Icon } from 'antd';
import { withRouter } from 'react-router';
import './index.scss';
import "antd/dist/antd.css";

const initialMenu = ["", "", "", "", "", ""];
var pages = ["portfolio", "cryptoMenu?0", "stats", "backup", "settings", "help"];
const pageRouting = {
    "portfolio": 0,
    "cryptoMenu": 1,
    "stats": 2,
    "backup": 3,
    "settings": 4,
    "help": 5
};

class LeftMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
        }
        this.itemSelected = initialMenu;
        this.itemSelected[0] = "itemSelected";
    }

    // componentDidMount(){
    //     if(this.state.url == window.location.href){
    //         return ;
    //     }
    //     this.menuItemClick(0);
    //     this.setState({url: window.location.href});
    // }

    componentWillReceiveProps(){
        let hash = window.location.hash;
        if(hash == this.state.url)
            return ;
        this.setState({url: hash})
        hash = hash.split('?');
        if(hash[1] === "cryptoMenu"){
            pages[1] = `cryptoMenu?${hash[2]}`;
        }
        if(hash[0] === "#/recover"){
            return ;
        }
        this.menuItemClick(pageRouting[hash[1]])
    }

    menuItemClick = value => {
        this.itemSelected = ["", "", "", "", "", ""];
        this.itemSelected[value] = "itemSelected";
        let tempUrl = pages[value]||"portfolio";
        if(tempUrl==="cryptoMenu"){
            tempUrl += `?${this.state.url.split('?')[2] || 0}`
        }
        this.props.history.push(`home?${tempUrl}`);
    }

    render() {
        return (
            <div className="leftMenu" style={{background: "	rgba(128,128,128, 0.1)"}}>
                <div className="logo">
                    <Icon type="check-circle" style={{ color: "#9013fe", verticalAlign: "inherit" }} theme="filled" />
                </div>
                <a onClick={() => this.menuItemClick(0)}>
                    <p className={"item" + " " + this.itemSelected[0]}>
                        <Icon type="user" className="menuIcon" />
                        Portfolio
                    </p>
                </a>
                <a onClick={() => this.menuItemClick(1)}>
                    <p className={"item" + " " + this.itemSelected[1]}>
                        <Icon type="user-add" className="menuIcon" />
                        Wallet
                    </p>
                </a>
                <a onClick={() => this.menuItemClick(2)}>
                    <p className={"item" + " " + this.itemSelected[2]}>
                        <Icon type="user" className="menuIcon" />
                        Exchange
                    </p>
                </a>
                <a onClick={() => this.menuItemClick(3)}>
                    <p className={"item" + " " + this.itemSelected[3]}>
                        <Icon type="user" className="menuIcon" />
                        Backup
                    </p>
                </a>
                <hr size="1" style={{ margin: "10px 30px 0 30px", opacity: 0.2 }} />
                <a onClick={() => this.menuItemClick(4)} >
                    <p className={"item settings" + " " + this.itemSelected[4]}>
                        <span className="bottomItems">Settings</span>
                    </p>
                </a>
                <a onClick={() => this.menuItemClick(5)}>
                    <p className={"item" + " " + this.itemSelected[5]}>
                        <span className="bottomItems">Help</span>
                    </p>
                </a>
            </div>
        )
    }
}

export default withRouter(LeftMenu);
