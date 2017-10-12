import React from 'react'
import axios from 'axios'
import {
  Link
} from 'react-router-dom'

import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

const { SERVER_ADDR } = process.env

class Header extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false,
      env: ''
    }
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentWillMount () {
    this.checkHealth()
  }

  checkHealth () {
    const self = this
    const url = `${SERVER_ADDR}/health`
    axios({ method: 'get', url })
      .then(res => { self.setState({ env: res.data.env }) })
      .catch(error => { alert(error.message) })
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
        <Drawer open={this.state.open}>
          {this.state.env !== 'offgrid'
            ? <MenuItem onClick={this.handleToggle}>
              <Link to='/home'>Inicio</Link>
            </MenuItem> : null
          }
          <MenuItem onClick={this.handleToggle}>
            <Link to='/join'>Acceder</Link>
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
