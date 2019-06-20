import React, { Component } from 'react'
import io from 'socket.io-client'
import {connect} from 'react-redux'
import './App.css'
import LoginComponent from './containers/LoginComponent'
import GameboardComponent from './containers/GameboardComponent'
import PlayersComponent from './containers/PlayersComponent'
import StatsComponent from './containers/StatsComponent'
import RoomComponent from './containers/RoomComponent';

const socket = io("http://172.22.22.54:3000");
//CHANGE BY "http://YOUR-LOCAL-ADRESS:3000" (if you want testing with multiple device on LAN) OR BY  "http://localhost:3000"
// NOTE : if you use the localhost adress, sock-js could send you errors but they don't have any influence
class App extends Component {

  render() {
    return (
      <div className="App">
        <h1>Backgammon</h1>
        {
          !this.props.loginSuccess ?
          <LoginComponent {...this.props} socket = {socket}/> :
          <div>
          {
            this.props.roomNumber === null ?
            <RoomComponent {...this.props} socket = {socket}/> :
            <div>
              <RoomComponent {...this.props} socket = {socket}/>           
              <PlayersComponent {...this.props} socket = {socket}/>
              <GameboardComponent {...this.props} socket = {socket}/>
            </div>
          }                           
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
    roomNumber : state.reducer.roomNumber
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
