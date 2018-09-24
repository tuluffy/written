/**
 * @description: 初始化数据结构，加入特殊标志
 * @param data
 * @return {Object|Uint8Array|any[]|Int32Array|Uint16Array|Uint32Array|*}
 */
export function init(data) {
    let newData = data.map(item => {
        item['outline'] = 0;    // 节点点亮状态
        item['show'] = true;    // 节点显示状态

        let children = item.children;

        if(typeof children === 'object'){
            init(children);
        }

        return item;
    })

    return newData;
}