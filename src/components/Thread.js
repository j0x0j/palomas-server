import React from 'react'

import qs from 'query-string'
import { PageHeader } from 'react-bootstrap'
import RaisedButton from 'material-ui/RaisedButton'
import Chip from 'material-ui/Chip'
import Avatar from 'material-ui/Avatar'
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more'
import MenuItem from 'material-ui/MenuItem'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import {
  Card,
  CardHeader,
  CardText
} from 'material-ui/Card'
import {
  Toolbar,
  ToolbarGroup
} from 'material-ui/Toolbar'

class Thread extends React.Component {
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
    return (
      <div className='thread-component'>
        <PageHeader>
          Conversación <small>con Juan Pérez {threadId}</small>
        </PageHeader>

        <Toolbar style={{marginBottom: '15px'}}>
          <ToolbarGroup firstChild>
            <RaisedButton
              label='Contestar'
              primary
            />
          </ToolbarGroup>
          <ToolbarGroup>
            <IconMenu
              iconButtonElement={
                <IconButton touch>
                  <NavigationExpandMoreIcon />
                </IconButton>
              }
            >
              <MenuItem primaryText='Compartir' />
              <MenuItem primaryText='More Info' />
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>

        <Card>
          <CardHeader
            title={
              <Chip>
                <Avatar size={32}>J</Avatar>Juan <small><i>hace dos días</i></small>
              </Chip>
            }
          />
          <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
        </Card>
        <Card>
          <CardHeader
            title={
              <Chip>
                <Avatar size={32}>J</Avatar>Juan <small><i>hace dos días</i></small>
              </Chip>
            }
          />
          <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
        </Card>
        <div
          className='text-center'
          style={{margin: '25px 0'}}
        >
          <RaisedButton label='Ver más' />
        </div>
      </div>
    )
  }
}

export default Thread
