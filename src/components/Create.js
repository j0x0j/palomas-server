import React from 'react'
import axios from 'axios'

class Create extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      nameFrom: '',
      nameTo: '',
      message: '',
      threadId: 'bo34t08q4rfes4q'
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
    const { threadId, nameFrom, nameTo, message } = this.state

    axios({
      method: 'post',
      url: 'http://localhost:8080/thread/message',
      data: {
        threadId,
        nameFrom,
        nameTo,
        message
      }
    })
      .then(function (response) {
        console.log('llegué')
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  render () {
    return (
      <div className='create-component'>
        <form onSubmit={this.handleSubmit}>
          <label>
            quien lo envía:
            <input
              type='text'
              name='nameFrom'
              value={this.state.nameFrom}
              onChange={this.handleChange}
            />
          </label>
          <label>
            quien lo recibe:
            <input
              type='text'
              name='nameTo'
              value={this.state.nameTo}
              onChange={this.handleChange}
            />
          </label>
          <label>
            mensaje:
            <textarea
              name='message'
              value={this.state.message}
              onChange={this.handleChange}
            />
          </label>
          <input
            type='submit'
            value='Submit'
          />
        </form>
      </div>
    )
  }
}
export default Create
