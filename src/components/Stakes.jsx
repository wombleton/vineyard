import React from 'react'
import { withFirebase } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { compose } from 'redux'
import _ from 'lodash'
import { TextField, Typography } from 'material-ui'

class Stakes extends React.Component {
  setStakes = e => {
    const cosigned = _.get(this, 'props.stakes.cosigned')
    if (cosigned) {
      return
    }
    const { sceneId, firebase } = this.props
    const { uid: author } = firebase.auth().currentUser
    firebase.set(`/scenes/${sceneId}/stakes`, {
      author,
      val: e.target.value,
    })
  }
  render = () => {
    const stakes = _.get(this, 'props.stakes', {})
    const { cosigned, val } = stakes

    if (cosigned) {
      return <Typography>{val}</Typography>
    }
    return (
      <TextField
        fullWidth
        helperText="What becomes either true or false afterwards"
        label="Stakes"
        multiline
        onChange={this.setStakes}
        placeholder="Set stakes for this scene"
        required
        value={val}
      />
    )
  }
}

const enhance = compose(
  withFirebase,
  connect((state, props) => ({
    stakes: _.get(state, `firebase.data.scenes.${props.sceneId}.stakes`),
  }))
)
export default enhance(Stakes)
