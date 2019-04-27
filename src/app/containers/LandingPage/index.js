import React, { Component } from 'react';
import { Layout } from 'antd';
import './index.scss';
import "antd/dist/antd.css";
import Welcome from '../Welcome';

class LandingPage extends Component {

    render() {
        return (
            <Welcome from="landingPage"/>
        )
    }
}

export default LandingPage;
