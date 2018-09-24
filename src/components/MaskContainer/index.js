import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 挂载点的实例
const maskParentDOM = document.getElementById('mask');

export default class MaskContainer extends React.Component {
    constructor(props) {
        super(props);

        this.maskRootDOM = document.createElement('div'); // 包裹元素的实例

        this.$outsideHide = this.$outsideHide.bind(this);
    }

    // 挂载
    componentDidMount() {
        maskParentDOM.appendChild(this.maskRootDOM);
    }

    // 卸载
    componentWillUnmount() {
        maskParentDOM.removeChild(this.maskRootDOM);
    }

    $outsideHide(){
        const { outsideHideCb, } = this.props;
        !!outsideHideCb && outsideHideCb();
    }

    render() {
        return ReactDOM.createPortal(
            <div className='mask-container' onClick={this.$outsideHide}>{this.props.children}</div>,
            this.maskRootDOM,
        )
    }
}