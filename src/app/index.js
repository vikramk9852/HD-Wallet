import './index.scss';

import React, { Component } from 'react';
import { Route, HashRouter } from 'react-router-dom';
import Router from '../app/router';


class App extends React.Component {

    render() {
        return (
            <HashRouter>
                <Route path="/" component={ Router } />
            </HashRouter>
        );
    }
}

export default App;