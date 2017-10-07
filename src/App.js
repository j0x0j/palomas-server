import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import {
  Grid,
  Row,
  Col,
  Navbar
} from 'react-bootstrap'

// import injectTapEventPlugin from 'react-tap-event-plugin'
// // Needed for onTouchTap
// // http://stackoverflow.com/a/34015469/988941
// injectTapEventPlugin()

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Thread from './components/Thread'

const App = () => (
  <Router>
    <MuiThemeProvider>
      <Grid className='App'>
        <Row className='show-grid'>
          <Col xs={12} className='collapse-xs'>
            <Navbar>
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to='/'>Palom.as</Link>
                </Navbar.Brand>
              </Navbar.Header>
              <ul className='nav navbar-nav'>
                <li role='presentation'>
                  <Link to='/thread?id=h8203rh493ubfr'>Thread</Link>
                </li>
                <li role='presentation'>
                  <Link to='/inbox'>Inbox</Link>
                </li>
                <li role='presentation'>
                  <Link to='/create'>Create</Link>
                </li>
              </ul>
            </Navbar>

            <Route path='/thread' component={Thread} />
          </Col>
        </Row>
        <link
          rel='stylesheet'
          href='https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css?family=Roboto'
        />
        <style>{
          `body { font-family: 'Roboto', sans-serif; }`
        }</style>
      </Grid>
    </MuiThemeProvider>
  </Router>
)

export default App
