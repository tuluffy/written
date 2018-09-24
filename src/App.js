import React from 'react';
import CameraSelector from './components/CameraSelector';
import {mergeState_simple} from './utils/helper/merge';
import {getSelectorCount} from './components/CameraSelector/auxiliaryLogic/getSelectorCount';
import {dataSource} from './utils/mock/dataSource';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showCamera: false,  // 相机模态框状态，默认不显示
            selectorCount: 0,   // 摄像头数量
        }

        this._UI_showCameraModal = this._UI_showCameraModal.bind(this);
        this._UI_hideCameraModal = this._UI_hideCameraModal.bind(this);
        this.$selected = this.$selected.bind(this);
    }

    // 展示CameraModal
    _UI_showCameraModal() {
        this.setState(mergeState_simple('showCamera', true))
    }

    // 关闭CameraModal
    _UI_hideCameraModal() {
        this.setState(mergeState_simple('showCamera', false))
    }

    // 选择的摄像头信息汇总
    $selected(value) {
        let count = getSelectorCount(value);

        this.setState(mergeState_simple('selectorCount', count));
    }

    render() {
        const {showCamera, selectorCount} = this.state;

        return (
            <div className="app-container">
                <div className='camera-content'
                     onClick={this._UI_showCameraModal}
                >{!!selectorCount ? `已选择${selectorCount}个摄像头` : '选择摄像头'}</div>

                {
                    <CameraSelector show={showCamera}
                                    dataSource={dataSource}
                                    outsideHide
                                    outsideHideCb={this._UI_hideCameraModal}
                                    communicationCb={this.$selected}
                    />
                }
            </div>
        );
    }
}

export default App;
