import React, {Component} from 'react'
import {connect} from 'react-redux'

class DisplayComponent extends Component{

  render() {
    const {count,array}=this.props
    return(
      <div>
        <h1>Count: {count*this.props.factor}</h1>
        <h1>Array: {array}</h1>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    count: state.reducer.count,
    array: state.reducer.array
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayComponent)