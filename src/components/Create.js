import React from 'react'

import qs from 'query-string'
import { PageHeader } from 'react-bootstrap'
import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

class Create extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      threadId: ''
    }
  }

  componentWillMount () {
    const query = qs.parse(location.search)
    this.setState({ threadId: (query.id || 0) })
  }

  render () {
    const { threadId } = this.state
    const styles = {
      textField: {
        marginLeft: 20
      },
      button: {
        margin: 12
      }
    }
    return (
      <div className='create-component'>
        <PageHeader>
          <h3>mensaje para: {threadId}</h3>
        </PageHeader>
        <Paper zDepth={1}>
          <TextField
            style={styles.textField}
            hintText='quien lo envía'
            underlineShow={false}
          />
          <Divider />
          <TextField
            hintText='para quien'
            style={styles.textField}
            underlineShow={false} />
          <Divider />
          <TextField
            hintText='mensaje'
            style={styles.textField}
            multiLine
            rows={3}
            rowsMax={4}
          />
          <RaisedButton
            label='Primary'
            primary
            style={styles.button}
          />
        </Paper>
      </div>
    )
  }
}
export default Create
