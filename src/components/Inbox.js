import React from 'react'

import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import Badge from 'material-ui/Badge'
import {
  Link
} from 'react-router-dom'

class Inbox extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  componentWillMount () {
  }

  render () {
    return (
      <div className='inbox-component'>
        <List>
          <Subheader>Tiene mensajes nuevos</Subheader>
          <ListItem
            primaryText='Walter Mercado'
            containerElement={<Link to='/thread?id=h8203rh493ubfr' />}
            secondaryText={
              <p>Llevamos semanas buscándote, por fin sabemos de ti. ¿Estás bien, que necesitas?</p>
            }
            secondaryTextLines={2}
            rightIcon={
              <Badge
                badgeContent={6}
                primary
              />}
          />
          <ListItem
            primaryText='Eric Hoffman'
            containerElement={<Link to='/thread?id=h8203rh493ubfr' />}
            secondaryText={
              <p>Hola Eric, por fin te conseguimos, estamos bien pero se nos inundó la casa. ¿Dónde estás? Te queremos ver.</p>
            }
            secondaryTextLines={2}
            rightIcon={
              <Badge
                badgeContent={6}
                primary
              />}
          />
          <ListItem
            primaryText='Grace Ng'
            rightIcon={
              <Badge
                badgeContent={4}
                primary
              />}
          />
          <ListItem
            primaryText='Kerem Suer'
            rightIcon={
              <Badge
                badgeContent={1}
                primary
              />}
          >
            <Link to='/thread?id=h8203rh493ubfr' />
          </ListItem>
          <ListItem
            primaryText='Raquel Parrado'
            rightIcon={
              <Badge
                badgeContent={1}
                primary
              />}
          >
            <Link to='/thread?id=h8203rh493ubfr' />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            primaryText='Chelsea Otakan'
          />
          <ListItem
            primaryText='James Anderson'
          />
        </List>
      </div>
    )
  }
}
export default Inbox
