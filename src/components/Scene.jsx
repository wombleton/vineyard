import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded } from 'react-redux-firebase'
import { Card, CardContent, LinearProgress, Typography } from 'material-ui'

import Stakes from './Stakes'

class Scene extends React.Component {
  render() {
    const { id, scene } = this.props
    let content
    if (!isLoaded(scene)) {
      content = <LinearProgress />
    } else if (!scene) {
      content = <Typography>Uh oh!</Typography>
    } else {
      content = (
        <div>
          <Stakes sceneId={id} />
        </div>
      )
    }
    return (
      <Card>
        <CardContent>{content}</CardContent>
      </Card>
    )
  }
}
const enhance = compose(
  firebaseConnect(props => [{ path: `scenes/${props.match.params.id}` }]),
  connect((state, props) => {
    const { id } = props.match.params
    return {
      scene: _.get(state, `firebase.data.scenes.${props.match.params.id}`),
      id,
    }
  })
)

export default enhance(Scene)
