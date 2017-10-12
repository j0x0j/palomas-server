import React from 'react'
import axios from 'axios'
import qs from 'query-string'
import dateformat from 'dateformat'
import PropTypes from 'prop-types'
import { PageHeader } from 'react-bootstrap'
import Chip from 'material-ui/Chip'
import Avatar from 'material-ui/Avatar'
import {
  Card,
  CardHeader,
  CardText
} from 'material-ui/Card'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentReply from 'material-ui/svg-icons/content/reply'

const SERVER_ADDR = 'http://localhost:8080'

class Thread extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      threadId: '',
      messages: []
    }
  }

  componentWillMount () {
    const query = qs.parse(location.search)
    this.setState({ threadId: query.id })
  }

  componentDidMount () {
    this.getMessages()
  }

  getMessages () {
    const self = this
    const { threadId } = this.state
    axios({
      method: 'get',
      url: `${SERVER_ADDR}/thread/message/list/${threadId}`,
      responseType: 'json'
    })
      .then(response => {
        const { receiverPhone, messages } = response.data
        // Setup receiver phone for threads
        const phone = localStorage.getItem('phone')
        const name = localStorage.getItem('name')
        if (!phone) {
          localStorage.setItem('phone', receiverPhone)
        }
        if (!name) {
          localStorage.setItem('name', messages[0].receiverName)
        }
        self.setState({ messages })
      })
      .catch(error => { alert(error.message) })
  }

  render () {
    const { threadId, messages } = this.state
    const data = messages.slice()
    data.reverse()
    return (
      <div className='thread-component'>
        <PageHeader>
          Conversación <small style={{fontSize: '16px'}}>{threadId}</small>
        </PageHeader>

        {this.state.messages.length < 1
          ? <p>No encontramos esta conversación</p> : null}

        <div style={{ marginBottom: '60px' }}>
          {data.map((message, i) => {
            const { senderName, content, createdAt } = message
            const date = dateformat(createdAt, '\'en\' d.mm.yy')
            return (
              <Card key={i}>
                <CardHeader
                  style={{ overflow: 'hidden' }}
                  title={
                    <Chip>
                      <Avatar size={32}>
                        {(senderName.charAt(0)).toUpperCase()}
                      </Avatar>{senderName} <small><i>{date}</i></small>
                    </Chip>
                  }
                />
                <CardText>{content}</CardText>
              </Card>
            )
          })}
        </div>

        <FloatingActionButton
          secondary
          style={{
            position: 'fixed',
            bottom: '15px',
            right: '15px'
          }}
          onClick={() => {
            this.props.history.push(
              `/create?id=${threadId}&to=${this.state.messages[0].senderName}`
            )
          }}
        >
          <ContentReply />
        </FloatingActionButton>
      </div>
    )
  }
}

Thread.contextTypes = {
  router: PropTypes.object
}

export default Thread
