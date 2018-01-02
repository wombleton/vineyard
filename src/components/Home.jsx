import React from 'react'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  Typography,
} from 'material-ui'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import { FormattedRelative } from 'react-intl'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'

class Home extends React.Component {
  add = () => {
    const { firebase } = this.props
    const createdAt = Date.now()
    firebase.push('/scenes', { createdAt })
  }
  getList = () => {
    const { scenes } = this.props

    if (!isLoaded(scenes)) {
      return <LinearProgress />
    } else if (isEmpty(scenes)) {
      return <Typography>No scenes yet. Click Add to start</Typography>
    }
    const items = _.map(scenes, (conflict, key) => {
      const { createdAt, title } = conflict
      return (
        <ListItem key={key} component={Link} to={`/scenes/${key}`} button>
          <Typography>{title || '—'}</Typography>
          <FormattedRelative value={new Date(createdAt)} />
        </ListItem>
      )
    }).reverse()
    return <List>{items}</List>
  }
  render() {
    return (
      <Card>
        <CardContent>{this.getList()}</CardContent>
        <CardActions>
          <Button onClick={this.add}>New</Button>
        </CardActions>
      </Card>
    )
  }
}

export default compose(
  firebaseConnect([
    {
      path: '/scenes',
      queryParams: ['limitToLast=5'],
    },
  ]),
  connect(state => ({
    scenes: state.firebase.data.scenes,
  }))
)(Home)
