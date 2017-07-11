import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions'
import Link from '../components/Link'

const mapStateToProps = (state, ownProps) => {// 第二步
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {// 第三步
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))// 对应具体的action里面的
    }
  }
}

const FilterLink = connect( //第一步，先写这个
  mapStateToProps,
  mapDispatchToProps
)(Link)// 这是一个逻辑组件，肯定要传给一个纯展示组件 link

export default FilterLink
