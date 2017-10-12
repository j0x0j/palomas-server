import React from 'react'
import axios from 'axios'
import qs from 'query-string'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

const SERVER_ADDR = 'http://localhost:8080'

class Create extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      nameFrom: '',
      nameTo: '',
      message: '',
      threadId: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    const query = qs.parse(location.search)
    const nameFrom = localStorage.getItem('name')
    this.setState({
      threadId: query.id,
      nameTo: query.to,
      nameFrom
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
    const { threadId, nameFrom, nameTo, message } = this.state

    if (!message) {
      return alert('Debe escribir un mensaje')
    }

    axios({
      method: 'post',
      url: `${SERVER_ADDR}/thread/message`,
      data: {
        threadId,
        senderName: nameFrom,
        receiverName: nameTo,
        content: message
      }
    })
      .then(() => {
        self.props.history.push(`/thread?id=${threadId}`)
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
                name='nameFrom'
                value={this.state.nameFrom}
                onChange={this.handleChange}
                required
              />
            </label>
            <label>
              <TextField
                hintText='Para'
                floatingLabelText='A quien le escribes'
                name='nameTo'
                value={this.state.nameTo}
                onChange={this.handleChange}
                valueLink
                required
              />
            </label>
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
