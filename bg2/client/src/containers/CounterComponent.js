import React, {Component} from 'react'
import Button from '../components/Button'
import {connect} from 'react-redux'
import {incrementCount, decrementCount, multiplyCount, fillArray} from '../actions/index'

class CounterComponent extends Component{

  handleBtnActionIncrement = () => {
    this.props.onIncrementClick(this.props.count)
  }

  handleBtnActionDecrement = () => {
    this.props.onDecrementClick(this.props.count)
  }
  handleBtnActionMultiply = () => {
    this.props.onMultiplyClick(this.props.count)
  }
  handleBtnActionFill = () => {
    this.props.onFillArray(this.props.array,this.props.count)
  }

  render() {
    return(
      <div>
        <Button action={this.handleBtnActionIncrement} buttonTitle = "+" />
        <Button action={this.handleBtnActionDecrement} buttonTitle = "-" />
        <Button action={this.handleBtnActionMultiply} buttonTitle = "*" />
        <Button action={this.handleBtnActionFill} buttonTitle = "Fill" />
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
    onIncrementClick: (count) => {  
      dispatch(incrementCount(count))
    },
    onDecrementClick: (count) => {
      if(count !== 0) 
      dispatch(decrementCount(count))
    },
    onMultiplyClick: (count) => {
      dispatch(multiplyCount(count))
    },
    onFillArray: (array, value) => {
      dispatch(fillArray(array,value))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CounterComponent)