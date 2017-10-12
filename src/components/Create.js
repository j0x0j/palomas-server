import React from 'react'
import axios from 'axios'
import qs from 'query-string'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

const { SERVER_ADDR } = process.env

class Create extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      senderName: '',
      senderPhone: '',
      receiverName: '',
      receiverPhone: '',
      message: '',
      threadId: '',
      isNew: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    const query = qs.parse(location.search)
    const senderName = localStorage.getItem('name')
    const senderPhone = localStorage.getItem('phone')
    this.setState({
      threadId: query.id,
      receiverName: query.to,
      isNew: query.new === '1',
      senderName,
      senderPhone
    })
  }

  handleChange (e) {
    const target = e.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    // get our form data out of state
    const self = this
    const {
      threadId,
      senderName,
      senderPhone,
      receiverName,
      receiverPhone,
      message,
      isNew
    } = this.state

    if (!message) {
      return alert('Debe escribir un mensaje')
    }

    let url, data

    if (isNew) {
      url = `${SERVER_ADDR}/thread`
      data = {
        isNew,
        content: message,
        senderName,
        senderPhone,
        receiverName,
        receiverPhone
      }
    } else {
      url = `${SERVER_ADDR}/thread/message`
      data = {
        threadId,
        senderName,
        receiverName,
        content: message
      }
    }

    axios({ method: 'post', url, data })
      .then(res => {
        self.props.history.push(`/thread?id=${threadId || res.data.threadId}`)
      })
      .catch(error => { alert(error.message) })
  }

  render () {
    return (
      <div className='create-component'>
        <Subheader>Envía tu mensaje</Subheader>
        <Paper
          style={{ padding: '20px' }}
          zDepth={1}
        >
          <form onSubmit={this.handleSubmit}>
            <label>
              <TextField
                hintText='De'
                floatingLabelText='Quien escribe'
                name='senderName'
                value={this.state.senderName}
                onChange={this.handleChange}
                required
              />
            </label>
            <label>
              <TextField
                hintText='Para'
                floatingLabelText='A quien le escribes'
                name='receiverName'
                value={this.state.receiverName}
                onChange={this.handleChange}
                valueLink
                required
              />
            </label>
            {this.state.isNew
              ? <label>
                <TextField
                  hintText='7871230000'
                  floatingLabelText='El número móvil'
                  name='receiverPhone'
                  value={this.state.receiverPhone}
                  onChange={this.handleChange}
                  required
                />
              </label> : null
            }
            <label>
              <TextField
                hintText='Escriba su mensaje'
                floatingLabelText='Mensaje'
                multiLine
                rows={2}
                name='message'
                value={this.state.message}
                onChange={this.handleChange}
                required
              />
            </label>
            <RaisedButton
              type='submit'
              label='Enviar'
              primary
            />
          </form>
        </Paper>
      </div>
    )
  }
}

Create.contextTypes = {
  router: PropTypes.object
}

export default Create
