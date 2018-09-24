import React from 'react';
import SelectorItem from '../../SelectorItem/index';

/**
 * @description: 创建与组合Selector
 * @return: {loop}
 */
export function createSelector() {
    return function loop(data, $choice) {
        let arr;

        return data.map(item => {
            arr = [];
            const Comp = (props) => <SelectorItem key={item.id} dataSource={item} choice={$choice}>{props.children}</SelectorItem>

            if (typeof item.children === 'object') {
                let dataSource = item.children;
                let ChildComp = loop(dataSource, $choice)

                arr.push(ChildComp)
            }

            return (
                <Comp key={item.id}>
                    {
                        !!arr && !!arr.length && <div className='cameraselector-selectoritem-child'>{arr}</div>
                    }
                </Comp>
            )
        })
    }
}