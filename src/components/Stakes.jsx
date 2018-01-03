import React from 'react'
import { withFirebase } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { compose } from 'redux'
import _ from 'lodash'
import { TextField } from 'material-ui'

class Stakes extends React.Component {
  setStakes = e => {
    const { sceneId, firebase } = this.props
    const { uid: author } = firebase.auth().currentUser
    firebase.set(`/scenes/${sceneId}/stakes`, {
      author,
      val: e.target.value,
    })
  }
  render = () => {
    const val = _.get(this, 'props.scene.stakes.val')
    return (
      <TextField
        onChange={this.setStakes}
        value={val}
        label="Stakes"
        placeholder="Set stakes for this scene"
        multiline
      />
    )
  }
}

const enhance = compose(
  withFirebase,
  connect((state, props) => ({
    scene: _.get(state, `firebase.data.scenes.${props.sceneId}`),
  }))
)
export default enhance(Stakes)
