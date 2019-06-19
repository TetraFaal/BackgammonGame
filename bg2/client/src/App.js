import React, { Component } from 'react'
import io from 'socket.io-client'
import {connect} from 'react-redux'
import './App.css'
import LoginComponent from './containers/LoginComponent'
import GameboardComponent from './containers/GameboardComponent'
import PlayersComponent from './containers/PlayersComponent'
import StatsComponent from './containers/StatsComponent'

const socket = io("http://localhost:3000");

class App extends Component {

  render() {
    return (
      <div className="App">
        <h1>Backgammon</h1>
        {
            !this.props.loginSuccess ?
            <LoginComponent {...this.props} socket = {socket}/> :
            <div>            
              <PlayersComponent {...this.props} socket = {socket}/>
              <GameboardComponent {...this.props} socket = {socket}/>
            </div>
        }
        <StatsComponent {...this.props} socket = {socket}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loginSuccess: state.reducer.loginSuccess,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
