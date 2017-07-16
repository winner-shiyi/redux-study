/**
 * action 集合
 */

/**
 * 添加todo
 * @param customItemText 添加的具体某项内容
 * @return {type: string, text: *}
 */
let nextId = 0
export const addCustomItemAction = (customItemText) => {
    return {
        type: 'ADD_CUSTOM_ITEM_ACTION',
        text: customItemText,
        id: nextId++,
    }
}

/**
 * 切换todo的完成状态
 */

export const changeCustomItemCompletionStatusAction = (customItemId) => {
    return {
       type: 'CHANGE_CUSTOM_ITEM_COMPLETION_STATUS_ACTION',
       id: customItemId
    }
}