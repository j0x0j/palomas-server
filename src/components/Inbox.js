import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import Badge from 'material-ui/Badge'
import {
  Link
} from 'react-router-dom'

const SERVER_ADDR = 'http://localhost:8080'

class Inbox extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      phone: '',
      threads: []
    }
  }

  componentWillMount () {
    const phone = localStorage.getItem('phone')
    this.setState({ phone })
  }

  componentDidMount () {
    if (!this.state.phone) {
      // should redirect to registration
      this.props.history.push(`/join`)
      return
    }
    this.getThreads()
  }

  getThreads () {
    const self = this
    const { phone } = this.state
    axios({
      method: 'get',
      url: `${SERVER_ADDR}/thread/list/${phone}`,
      responseType: 'json'
    })
      .then(response => {
        self.setState({ threads: response.data })
      })
      .catch(error => { alert(error.message) })
  }

  render () {
    return (
      <div className='inbox-component'>
        <List>
          <Subheader>Aquí están sus conversaciones</Subheader>

          {this.state.threads.length < 1
            ? <ListItem>No hay conversaciones disponibles</ListItem> : null}

          {this.state.threads.map((thread, i) => {
            const { threadId } = thread
            const path = `/thread?id=${threadId}`
            return (
              <ListItem
                key={i}
                primaryText={thread.messages[0].senderName}
                containerElement={<Link to={path} />}
                secondaryText={
                  <p>{thread.messages[0].content}</p>
                }
                secondaryTextLines={2}
                rightIcon={
                  <Badge
                    badgeContent={1}
                    primary
                  />}
              />
            )
          })}
        </List>
        <Divider />
      </div>
    )
  }
}

Inbox.contextTypes = {
  router: PropTypes.object
}

export default Inbox
