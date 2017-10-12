import React from 'react'

import { PageHeader, Row, Col } from 'react-bootstrap'
import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import FileCloudUpload from 'material-ui/svg-icons/file/cloud-upload'
import RaisedButton from 'material-ui/RaisedButton'

const { SERVER_ADDR } = process.env

const iconStyles = {
  margin: 0
}

class Carrier extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      apid: '',
      env: '',
      packages: [],
      error: '',
      success: '',
      sending: false,
      receiving: false,
      dialogOpen: false,
      remotePackage: `${SERVER_ADDR}/data/messages.json.lz`
    }
    this.handleUploadTouchTap = this.handleUploadTouchTap.bind(this)
    this.handleDownloadTouchTap = this.handleDownloadTouchTap.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentWillMount () {
    this.checkHealth()
  }

  getLocalPackage () {
    const title = `package-${this.state.apid}`
    const base64 = localStorage.getItem(title)
    // If no package locally stored
    if (!base64) return
    const packages = this.state.packages.concat([{ title, base64 }])
    this.setState({ packages })
  }

  requestPackage () {
    const self = this
    const oReq = new XMLHttpRequest()
    oReq.open('GET', this.state.remotePackage, true)
    oReq.responseType = 'blob'
    oReq.onload = (oEvent) => {
      if (oReq.readyState === 4 && oReq.status !== 200) {
        return alert('No encontramos algún paquete')
      }
      const blob = oReq.response
      const reader = new FileReader()
      reader.addEventListener('loadend', () => {
        const dataUrl = reader.result
        const base64 = dataUrl.split(',')[1]
        const title = `package-${self.state.apid}`
        const packages = self.state.packages.concat([{ title, base64 }])
        localStorage.setItem(title, base64)
        self.setState({ packages })
      })
      reader.readAsDataURL(blob)
    }
    oReq.send()
  }

  uploadPackage () {
    if (
      this.state.env !== 'production' &&
      this.state.env !== 'development'
    ) {
      this.setState({
        error: 'Debe estar conectado al internet para subir el paquete',
        success: '',
        dialogOpen: true
      })
      return
    }
    const self = this
    const key = `package-${this.state.apid}`
    const blob = localStorage.getItem(key)
    const oReq = new XMLHttpRequest()
    oReq.open('POST', `${SERVER_ADDR}/package`, true)
    oReq.setRequestHeader('Content-Type', 'application/json')
    oReq.onload = (oEvent) => {
      if (oReq.readyState === 4 && oReq.status !== 200) {
        return self.handleError('Ocurrió un problema al subir el paquete')
      }
      // Uploaded.
      self.setState({
        error: '',
        success: '¡Gracias! Enviaremos estos mensajes ya.',
        sending: false,
        receiving: false,
        dialogOpen: true,
        packages: []
      })
      localStorage.removeItem(key)
    }
    oReq.send(JSON.stringify({ key, blob }))
  }

  checkHealth (cb) {
    const self = this
    const oReq = new XMLHttpRequest()
    oReq.open('GET', `${SERVER_ADDR}/health`, true)
    oReq.responseType = 'json'
    oReq.onload = (oEvent) => {
      if (oReq.readyState === 4 && oReq.status !== 200) {
        return self.handleError(oReq.responseText)
      }
      const { env, apid } = oReq.response
      self.setState({ env, apid })
      self.getLocalPackage()
    }
    oReq.send()
  }

  handleDownloadTouchTap () {
    this.requestPackage()
  }

  handleUploadTouchTap () {
    this.uploadPackage()
  }

  handleClose () {
    this.setState({
      error: '',
      success: '',
      dialogOpen: false
    })
  }

  handleError (error) {
    this.setState({
      error,
      success: '',
      dialogOpen: true
    })
  }

  render () {
    return (
      <div className='thread-component'>
        <PageHeader>
          AP-{this.state.apid} <small>{this.state.env}</small>
        </PageHeader>

        {this.state.packages.length < 1
          ? <Row>
            <Col xs={12}>
              <div className='text-center'>
                <RaisedButton
                  onClick={this.handleDownloadTouchTap}
                  label='Bajar mensajes'
                  primary
                />
              </div>
            </Col>
          </Row> : null}

        {this.state.packages.map((pack, i) => {
          return (
            <Row key={i}>
              <Col xs={7}>
                <Chip>
                  <Avatar
                    color='#444'
                    icon={<FileCloudUpload style={iconStyles} />}
                  />
                  {pack.title}
                </Chip>
                <p style={{ marginTop: '10px' }}>
                  Esta es la collección de mensajes que debes
                  subir cuando tengas acceso a internet
                </p>
              </Col>
              <Col xs={5}>
                <div className='text-right'>
                  <RaisedButton
                    onClick={this.handleUploadTouchTap}
                    label='Subir'
                  />
                </div>
              </Col>
              <Dialog
                actions={[
                  <FlatButton
                    label='Descartar'
                    onClick={this.handleClose}
                    primary
                  />
                ]}
                modal={false}
                open={this.state.dialogOpen}
                onRequestClose={this.handleClose}
              >
                {this.state.success || this.state.error}
              </Dialog>
            </Row>
          )
        })}
      </div>
    )
  }
}

export default Carrier
