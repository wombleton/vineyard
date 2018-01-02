import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Adventurers from './Adventurers'
import Conflicts from './conflicts/Conflicts'
import Home from './Home'

import styles from '../css/Base.scss'

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
class Main extends React.Component {
  render() {
    return (
      <main className={styles.inset}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/adventurers" component={Adventurers} />
          <Route path="/conflicts" component={Conflicts} />
        </Switch>
      </main>
    )
  }
}
export default Main
