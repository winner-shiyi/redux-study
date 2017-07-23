import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Menu,
  Icon,
} from 'antd'
import {
  Link,
} from 'react-router'
import { connect } from 'react-redux'
import { common } from '../../store/common'
import { Scrollbars } from 'react-custom-scrollbars'

const { SubMenu } = Menu

class SideMenu extends Component {

  constructor (props) {
    super(props)
    props.menuLoad()
      .then(() => {

      })
    //   .then((json) => {
    //   const matchMenu = json.find(item => {
    //     return item.subItems.find(subItem => {
    //       return subItem.link === pathname || subItem.link + 'Detail' === pathname
    //     })
    //   })
    //   matchMenu && this.props.menuOpen([matchMenu.id + ''])
    // })
  }

  static propTypes = {
    menuData: PropTypes.array.isRequired,
    selectedKeys: PropTypes.array,
  }

  onClick ({ key }) {
    this.props.clickMenuItem(key)
  }

  onTitleClick ({ key }) {
    this.props.clickSubMenu(key)
  }

  onOpenChange (openKeys) {
    this.props.menuOpen(openKeys)
  }

  render () {
    const menuData = this.props.menuData
    const selectedKeys = this.props.selectedKeys
    const openKeys = this.props.openKeys

    return (
      <Scrollbars
        style={{ height: document.body.clientHeight - 300 }}
      >
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[...selectedKeys]}
          openKeys={openKeys}
          onOpenChange={::this.onOpenChange}
          onClick={::this.onClick}
        >
          {
            menuData[0].map((pItem, i) => {
              let subMapItems = menuData[1].map((item, j) => { // TODO
                if (pItem.id === item.parentId) {
                  return (
                    <Menu.Item key={item.id}>
                      <Link to={item.href}>{item.name}</Link>
                    </Menu.Item>
                  )
                } else {
                  return
                }
              })

              let subItems = subMapItems.filter(i => !!i)

              const createSubMenu = () => {
                if (subItems.length > 0) {
                  return (
                    <SubMenu
                      key={pItem.id}
                      title={
                        <span>
                          {pItem.icon && <Icon type={pItem.icon} />}
                          <span>{pItem.name}</span>
                        </span>
                      }
                      onTitleClick={::this.onTitleClick}
                    >
                      {subItems}
                    </SubMenu>
                  )
                } else {
                  return ''
                }
              }

              return createSubMenu()
            })
          }
        </Menu>
      </Scrollbars>
    )
  }
}

const mapStateToProps = (state) => {
  const menuData = state.common.sideMenuData
  return {
    selectedKeys: state.common.selectedKeys || [],
    openKeys: state.common.openedKeys || [],
    menuData: menuData,
  }
}

const mapDispatchToProps = {
  menuLoad: common.menuLoad,
  menuOpen: common.menuOpen,
  clickTopMenu: common.clickTopMenu,
  clickSubMenu: common.clickSubMenu,
  clickMenuItem: common.clickMenuItem,
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu)
