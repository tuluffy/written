import React from 'react';
import check from './../../lib/image/check.png';
import checkUnstable from '../../lib/image/check-unstable.png';
import icheckOutline from './../../lib/image/check-outline.png';
import './index.css';

function getIcon(status) {
    let icon;

    switch (status){
        case 0: icon = icheckOutline; break;
        case 1: icon = check; break;
        case 2: icon = checkUnstable; break;
        default: icon = icheckOutline;
    }

    return icon;
}

export default class SelectorItem extends React.Component {
    constructor(props) {
        super(props);

        this.$choice = this.$choice.bind(this);
    }

    $choice() {
        const {dataSource, choice} = this.props;
        !!choice && choice(dataSource);
    }

    render() {
        let {dataSource, } = this.props;
        let {show, } = dataSource;
        let {outline, name, id} = dataSource;
        let icon = getIcon(outline);

        return (
            !!show && <React.Fragment>
                <div className='selectoritem-container'
                     onClick={this.$choice}
                >
                    <img className='selectoritem-icon'
                         src={icon}
                    />
                    <div>{name}</div>
                </div>

                {this.props.children}
            </React.Fragment>
        )
    }
}