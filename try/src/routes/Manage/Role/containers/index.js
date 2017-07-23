import { connect } from 'react-redux'
import { actions } from '../modules'
import { moduleName } from '../index'

import View from '../components'

const mapDispatchToProps = { ...actions }

const mapStateToProps = (state, ownProps) => {
  const localState = state[moduleName]
  let record = localState.record
  record && record.menuList && record.menuList.forEach((item) => {
    if (item.isShow === '1') { // parent node
      record[item['parentIds'] + item['id'] + ','] = []
    }
  })

  record && record.menuList && record.menuList.forEach((item) => {
    if (item.parentIds in record) {
      record[item['parentIds']].push(item.id)
    }
  })

  return {
    ...localState,
    leafMenuData: state.common.leafMenuData,
    permission: state.common.permission[state.common.selectedKeys[0]] || {},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(View)
