import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import Badge from 'material-ui/Badge'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { Link } from 'react-router-dom'

const { SERVER_ADDR } = process.env

class Inbox extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      phone: '',
      threads: []
    }
  }

  componentWillMount () {
    const name = localStorage.getItem('name')
    const phone = localStorage.getItem('phone')
    this.setState({ name, phone })
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
            let threadName
            if (
              thread.messages[0].receiverName === this.state.name
            ) {
              threadName = thread.messages[0].senderName
            } else {
              threadName = thread.messages[0].receiverName
            }
            return (
              <ListItem
                key={i}
                primaryText={threadName}
                containerElement={<Link to={path} />}
                secondaryText={
                  <p>{thread.messages[0].content}</p>
                }
                secondaryTextLines={2}
                rightIcon={
                  <Badge
                    badgeContent='&bull;'
                    primary
                  />}
              />
            )
          })}
        </List>
        <Divider />
        <FloatingActionButton
          secondary
          style={{
            position: 'fixed',
            bottom: '15px',
            right: '15px'
          }}
          onClick={() => {
            this.props.history.push(
              `/create?new=1`
            )
          }}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

Inbox.contextTypes = {
  router: PropTypes.object
}

export default Inbox
