/**
 * @props: show {Boolean}`Modal控制状态
 * @props: dataSource {Array<Objecy>}   源数据
 * @props: outsideHide  {Boolean}   点击非内容区域是否关闭Modal
 * @props: outsideHideCb    {Func}  关闭Modal的回调函数
 * @props: communicationCb  {Func}  通讯回调函数
 *
 * */
import React from 'react';
import MaskContainer from './../MaskContainer';
import {mergeState_simple} from '../../utils/helper/merge';
import {throttle} from '../../utils/helper/throttle';
import {createSelector} from './auxiliaryLogic/createSelector';
import {init} from "./auxiliaryLogic/init";
import {getCoordinate, getSearchResult} from './auxiliaryLogic/getCoordinate';
import './index.css';

export default class CameraSelector extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            searchText: '',
            dataSource: [],
        }

        this.searchREF = React.createRef();

        this.$preventEffect = this.$preventEffect.bind(this);
        this.$outsideHide = this.$outsideHide.bind(this);
        this.$inputSearch = this.$inputSearch.bind(this);
        this.$choice = this.$choice.bind(this);
        this.$search = this.$search.bind(this);
        this.$choiceAll = this.$choiceAll.bind(this);
        this.$communication = this.$communication.bind(this);
    }

    // 阻止双向冒泡，拦截点击事件的副作用
    $preventEffect(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    // 隐藏Selector Modal
    $outsideHide() {
        const {outsideHideCb} = this.props;
        !!outsideHideCb && outsideHideCb();
    }

    // 搜索
    $inputSearch() {
        // TODO: 由于当前React、React-dom版本存在问题：无法在DidMount获取current，暂时采取替代方案
        let {value} = this.searchREF.current;

        this.setState(mergeState_simple('searchText', value), this.$search)
    }

    // 搜索回调
    $search(){
        let {searchText, dataSource, } = this.state;
        let newDataSource = getSearchResult(dataSource, searchText);

        this.setState(mergeState_simple('dataSource', newDataSource), this.$communication);
    }

    /**
     * @description: 全选相关操作
     * @param value 0：取消 1：全选
     */
    $choiceAll(value){
        const {searchText, dataSource} = this.state;
        let newDataSource = getSearchResult(dataSource, searchText, value);
        this.setState(mergeState_simple('dataSource', newDataSource), this.$communication);
    }

    // 选择节点相关操作
    $choice(args){
        let {dataSource} = this.state;
        let newDataSource = getCoordinate(dataSource, args);

        // 切换选择状态
        this.setState(mergeState_simple('dataSource', newDataSource), this.$communication)
    }

    // 通讯
    $communication(){
        const {dataSource} = this.state;
        const {communicationCb, show} = this.props;

        !!show && !!communicationCb && communicationCb(dataSource)
    }

    componentDidMount() {
        const {dataSource, } = this.props;
        const data = JSON.parse(JSON.stringify(dataSource))

        // 初始化数据结构
        const newData = init(data);

        this.setState(mergeState_simple('dataSource', newData))
    }

    // 针对关闭Modal做的特殊处理
    componentWillReceiveProps(nextProps) {
        let {show, } = nextProps;

        // 清除searchText的影响
        !show && this.setState(mergeState_simple('searchText', ''), this.$search);
    }

    render() {
        const {show,} = this.props;
        const {dataSource,} = this.state;

        if (!show) {
            return null;
        }

        return (
            <MaskContainer outsideHideCb={this.$outsideHide}>
                <div className='cameraselector-container'
                     onClick={this.$preventEffect}
                >
                    <div className='cameraselector-theme'>
                        <div className='cameraselector-theme-title'>请选择摄像头</div>
                        <div className='cameraselector-theme-handler'>
                            <div onClick={() => this.$choiceAll(1)}>全选</div>
                            <div onClick={() => this.$choiceAll(0)}>清空</div>
                        </div>
                    </div>

                    <input className='cameraselector-search'
                           type='text'
                           placeholder='请输入筛选条件'
                           ref={this.searchREF}
                           onChange={throttle(this.$inputSearch, 1000)}
                    />

                    <div className='cameraselector-selectoritem'>
                        {
                            createSelector()(dataSource, this.$choice)
                        }
                    </div>
                </div>
            </MaskContainer>
        )
    }
}