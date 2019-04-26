import React, { Component } from 'react';
import {connect} from 'react-redux'
import './App.css';
import LoginComponent from './containers/LoginComponent';
import GameboardComponent from './containers/GameboardComponent';
//import Gameboard from './containers/Gameboard';

class App extends Component {
  
  startGame = (playerName) => {
    this.setState({
      playerName,
      gameStarted : true
    })
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/main');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
      return (
        <div className="App">
          <h1>Backgammon</h1>
          {
            !this.props.loginSuccess ?
            <LoginComponent/> :
            <GameboardComponent/>
          }
        </div>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    post: state.reducer.post,
    response: state.reducer.response,
    responseToPost: state.reducer.responseToPost,
    loginSuccess: state.reducer.loginSuccess
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
