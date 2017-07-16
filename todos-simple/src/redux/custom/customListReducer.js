/**
 * todo列表的reducer，主要处理增加todo的action和切换完成状态的action
 * @param state 存放todos的数组（原来的state）
 * @param action
 * @return {*处理后的state}
 */

// import customItemReducer from './customItemReducer'

const customListReducer = (state = [], action) => {
    console.log('customListReducer的初始state是：', state, ' action是： ', action)
    switch(action.type) {
        /**
         * 添加customItem
         */
        case 'ADD_CUSTOM_ITEM_ACTION':
        // let newCustomItem = { // 定义Item需要哪些字段
        //     id: action.id,
        //     text: action.text,
        //     completed: false,
        // }
        // // 切忌不可以直接修改、赋值原来的state
        // let newState = [...state] // 复制一份state，变成一个包含旧的state的新数组
        // newState.push(newCustomItem) // 向新数组中push添加的item
        // return newState // 返回新的state数组

        return [
            ...state,
            {
                id: action.id,
                text: action.text,
                completed: false,
            }
        ]
        
        case 'CHANGE_CUSTOM_ITEM_COMPLETION_STATUS_ACTION':

        return state.map((customItem, index) => {
            // customItem 就等于customItemReducer里面的参数state
            // return customItemReducer(customItem, action)

            if(customItem.id === action.id) {
                return {...customItem, completed: !customItem.completed}
            } else {
                return customItem
            }
        })
        default:
        return state
    }
}

export default customListReducer