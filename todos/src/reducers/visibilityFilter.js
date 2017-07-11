// 底部 筛选器 的响应
const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter// 返回的是一个字符串
    default:
      return state
  }
}

export default visibilityFilter
