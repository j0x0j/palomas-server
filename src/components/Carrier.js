import React from 'react'

import { PageHeader, Row, Col } from 'react-bootstrap'
import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import FileCloudUpload from 'material-ui/svg-icons/file/cloud-upload'
import FileCloudDownload from 'material-ui/svg-icons/file/cloud-download'
import RaisedButton from 'material-ui/RaisedButton'
import Divider from 'material-ui/Divider'
import FloatingActionButton from 'material-ui/FloatingActionButton'

const { SERVER_ADDR } = process.env

const iconStyles = {
  margin: 0
}

const localStorageCollection = () => {
  const packages = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    const blob = localStorage.getItem(key)
    if (blob && /package/.test(key)) {
      packages.push({ key, blob })
    }
  }
  return packages
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
    this.handleRemoveTouchTap = this.handleRemoveTouchTap.bind(this)
  }

  componentWillMount () {
    this.checkHealth()
  }

  getLocalPackages () {
    const packages = localStorageCollection()
    this.setState({ packages })
  }

  requestPackage () {
    const key = `package-${this.state.apid}`
    if (localStorage.getItem(key)) {
      // Don't download the same package
      return alert('Ya bajó este paquete')
    }
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
        const packages = self.state.packages.concat([{ key, base64 }])
        localStorage.setItem(key, base64)
        self.setState({ packages })
      })
      reader.readAsDataURL(blob)
    }
    oReq.send()
  }

  uploadPackage (key) {
    const self = this
    const blob = localStorage.getItem(key)
    const oReq = new XMLHttpRequest()
    oReq.open('POST', `${SERVER_ADDR}/package`, true)
    oReq.setRequestHeader('Content-Type', 'application/json')
    oReq.responseType = 'json'
    oReq.onload = (oEvent) => {
      if (oReq.readyState === 4 && oReq.status !== 200) {
        const { message } = oReq.response
        return self.handleError(message)
      }
      // Uploaded.
      self.removePackage(key)
      alert('¡Gracias! Enviaremos estos mensajes ya.')
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
      self.getLocalPackages()
    }
    oReq.send()
  }

  handleDownloadTouchTap () {
    this.requestPackage()
  }

  handleUploadTouchTap (key) {
    this.uploadPackage(key)
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

  handleRemoveTouchTap (key) {
    this.removePackage(key)
  }

  removePackage (key) {
    localStorage.removeItem(key)
    const packages = localStorageCollection()
    this.setState({ packages })
  }

  render () {
    const { packages } = this.state
    return (
      <div className='thread-component'>
        <PageHeader>
          AP-{this.state.apid} <small>{this.state.env}</small>
        </PageHeader>

        <div style={{ marginBottom: '60px' }}>
          {packages.map((pack, i) => {
            return (
              <div key={i} style={{ marginBottom: '15px' }}>
                <Row>
                  <Col xs={7}>
                    <Chip>
                      <Avatar
                        color='#444'
                        icon={<FileCloudUpload style={iconStyles} />}
                      />
                      {pack.key}
                    </Chip>
                    <p style={{ marginTop: '10px' }}>
                      Esta es la collección de mensajes que debes
                      subir cuando tengas acceso a internet
                    </p>
                  </Col>
                  <Col xs={5}>
                    <div className='text-right'>
                      <RaisedButton
                        onClick={() => this.handleUploadTouchTap(pack.key)}
                        label='Subir'
                      />
                      <RaisedButton
                        onClick={() => this.handleRemoveTouchTap(pack.key)}
                        label='Borrar'
                        style={{ marginTop: '10px' }}
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
                <Row>
                  <Col xs={12}>
                    <Divider />
                  </Col>
                </Row>
              </div>
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
          onClick={this.handleDownloadTouchTap}
        >
          <FileCloudDownload />
        </FloatingActionButton>
      </div>
    )
  }
}

export default Carrier
