/**
 * @description: 合并基本数据类型
 * @param field
 * @param value
 * @return {function(): {}}
 */
export const mergeState_simple = (field, value) => () => ({ [field]: value, })