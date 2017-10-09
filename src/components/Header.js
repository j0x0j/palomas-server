import React from 'react'
import {
  Link
} from 'react-router-dom'

import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

class Header extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false
    }
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentWillMount () {

  }

  handleToggle () {
    this.setState({
      open: !this.state.open
    })
  }

  render () {
    return (
      <div className='header-component'>
        <AppBar
          title='Palom.as'
          onLeftIconButtonTouchTap={this.handleToggle}
        />
        <Drawer
          open={this.state.open}
        >
          <MenuItem onClick={this.handleToggle}>
            <Link to='/home'>Inicio</Link>
          </MenuItem>
          <MenuItem onClick={this.handleToggle}>
            <Link to='/inbox'>Mensajes</Link>
          </MenuItem>
        </Drawer>
      </div>
    )
  }
}

export default Header
