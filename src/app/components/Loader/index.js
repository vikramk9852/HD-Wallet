import React, { Component } from 'react';
import './index.css';


class Loader extends Component {

    render() {
        return (
            <div class="drawing" id="loading">
                <div class="loading-dot"></div>
            </div>
        )
    }
}

export default Loader;
