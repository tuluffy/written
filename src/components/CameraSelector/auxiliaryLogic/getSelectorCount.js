/**
 * @description: 获取选择的摄像头数量
 * @param dataSource
 * @return {number}
 */
export function getSelectorCount(dataSource) {
    let count = 0;

    function loop(data) {
        for(let item of data){
            if(!!item.children && typeof item.children === 'object'){
                loop(item.children);
            } else {
                !!item['outline'] && count++;
            }
        }
    }

    loop(dataSource);

    return count;
}