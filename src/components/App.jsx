import React from 'react'
import { AppBar, Toolbar, Typography } from 'material-ui'
import { Switch, Route } from 'react-router-dom'

import Home from './Home'

class App extends React.Component {
  render() {
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography type="title" color="inherit">
              Vineyard
            </Typography>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    )
  }
}

export default App
