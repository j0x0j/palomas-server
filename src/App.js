import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import {
  Grid,
  Row,
  Col
} from 'react-bootstrap'

// import injectTapEventPlugin from 'react-tap-event-plugin'
// // Needed for onTouchTap
// // http://stackoverflow.com/a/34015469/988941
// injectTapEventPlugin()

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Thread from './components/Thread'
import Header from './components/Header'
import Create from './components/Create'
import Home from './components/Home'
import Inbox from './components/Inbox'
import Carrier from './components/Carrier'

// Stylesheets
require('./static/css/bootstrap.min.css')
require('./static/css/roboto.css')

const App = () => (
  <Router>
    <MuiThemeProvider>
      <div>
        <Header />
        <Grid className='App'>
          <Row className='show-grid'>
            <Col xs={12}>
              <Route path='/thread' component={Thread} />
              <Route path='/create' component={Create} />
              <Route path='/home' component={Home} />
              <Route path='/inbox' component={Inbox} />
              <Route path='/cherami' component={Carrier} />
            </Col>
          </Row>
          <style>{
            `body { font-family: 'Roboto', sans-serif; }`
          }</style>
        </Grid>
      </div>
    </MuiThemeProvider>
  </Router>
)

export default App
