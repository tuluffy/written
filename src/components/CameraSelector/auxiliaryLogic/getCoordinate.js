/**
 * @description: 更新目标节点，并调整状态
 * @param: dataSource
 * @param: target
 * @return: dataSource
 */
export function getCoordinate(dataSource, target) {
    let outline;    // SelectorItem被选中的状态

    function loop(data) {
        for (let item of data) {
            let children = item.children;

            if (item.id === target.id) {
                outline = item['outline'] === 0 ? 1 : 0
                item['outline'] = outline;

                !!children && loopChild(children);
            } else {
                !!children && loop(children);
            }
        }
    }

    function loopChild(data) {
        for (let item of data) {
            let children = item.children;
            item['outline'] = outline;

            !!children && loopChild(children);
        }
    }

    loop(dataSource);

    return fixParentState(dataSource);
}

// 修正父节点的状态
export function fixParentState(dataSource) {
    function loop(data) {
        for (let item of data) {
            let children = item.children;

            !!children && loop(children);

            if (!!children) {
                let showResult = children.filter(item => !!item['show'])
                let parentOutlineCheck = showResult.some(item => item['outline'] === 1)
                let parentOutlineCheckOutline = showResult.some(item => item['outline'] === 0)

                if(!parentOutlineCheckOutline){
                    item['outline'] = 1;
                } else if(!parentOutlineCheck){
                    item['outline'] = 0;
                } else {
                    item['outline'] = 2;
                }
            }
        }
    }

    loop(dataSource);

    return dataSource;
}

// 搜索和全选相关操作
export function getSearchResult(dataSource, key, choiceStatus) {
    // TODO: 使用Immutable可能是一个更好的解决方案？
    dataSource = JSON.parse(JSON.stringify(dataSource))

    function filter(data, parentShow) {
        // TODO: 忽略了一个问题，如果data中的某一项存在子节点？
        // TODO: 已解决 13:30
        data.forEach(item => {
            let children = item.children;

            if(!!children){
                // TODO: 循环嵌套，后续优化
                loop(children);
            } else {
                let filterFlag = item.name.indexOf(key) !== -1;

                // 全选相关操作
                if (typeof choiceStatus !== 'undefined' && (parentShow || filterFlag)) {
                    item['outline'] = choiceStatus;
                }

                // 搜索相关操作
                item['show'] = parentShow || filterFlag;
            }
        })

        // 如果存在子节点被匹配，父节点也需要显示
        data['show'] = data.some(item => !!item['show'])

        return data;
    }

    function loop(data) {
        for (let item of data) {
            let result = [];
            let parentShow = false;

            // 如果匹配到了根节点，显示根节点及其所有子节点，状态标志位：parentShow
            if(item.name.indexOf(key) !== -1){
                parentShow = true;
            }

            let children = item.children;

            if (!!children) {
                result = filter(children, parentShow)

                // 如果无子节点匹配成功，则不显示父节点
                item['show'] = result.some(item => !!item['show'])
            } else {
                // 如果无子节点
                item['show'] = item.name.indexOf(key) !== -1;

                // 全选状态
                if (typeof choiceStatus !== 'undefined') {
                    item['outline'] = choiceStatus;
                }

            }
        }
    }

    loop(dataSource);

    return fixParentState(dataSource);
}