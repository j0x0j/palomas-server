import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

class Join extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      phone: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    const name = localStorage.getItem('name')
    const phone = localStorage.getItem('phone')
    this.setState({ name, phone })
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
    const { name, phone } = this.state

    if (!name || !phone) {
      return alert('Debe entrar la información correcta')
    }
    if (phone.length !== 10 || /[a-zA-Z]/i.test(phone)) {
      return alert('Debe entrar su número móvil completo sin espacios, puntos o rallas')
    }

    localStorage.setItem('name', name)
    localStorage.setItem('phone', phone)

    this.props.history.push(`/inbox`)
  }

  render () {
    return (
      <div className='create-component'>
        <Subheader>
          Para acceder tus mensajes
        </Subheader>
        <Paper
          style={{ padding: '20px' }}
          zDepth={1}
        >
          <form onSubmit={this.handleSubmit}>
            <label>
              <TextField
                hintText='Nombre completo'
                floatingLabelText='¿Cuál es tu nombre?'
                name='name'
                onChange={this.handleChange}
                required
              />
            </label>
            <label>
              <TextField
                hintText='Número móvil'
                floatingLabelText='¿Cuál es tu número móvil?'
                name='phone'
                onChange={this.handleChange}
                required
                type='number'
                maxLength='10'
              />
            </label>
            <RaisedButton
              type='submit'
              label='Acceder'
              primary
            />
          </form>
        </Paper>
      </div>
    )
  }
}

Join.contextTypes = {
  router: PropTypes.object
}

export default Join
