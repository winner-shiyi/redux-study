/**
 * 切换具体某一个todo完成状态的reducer
 */

const customItemReducer = (state, action) => { 
    // 这个时候的state是一个对象，放的是这个todo的id、text、compeleted，肯定是已经存在了
    switch(action.type) {
        case 'CHANGE_CUSTOM_ITEM_COMPLETION_STATUS_ACTION':
        if(action.id !== state.id) {
            return state
        }
        return { 
            // 切忌不能直接修改state，使用es6的对象合并的方法，返回的是一个新的对象
            // ompleted 重新覆盖了state对象中的completed
            ...state,
           completed: !state.completed
        }
        default:
        return state
    }
} 
export default customItemReducer