import React, { Component } from 'react';
import './App.css';
import Login from './containers/Login';
import Gameboard from './containers/Gameboard';

class App extends Component {
  state = {
      response: '',
      post: '',
      responseToPost: '',
      playerName: '',
      gameStarted: false
  };

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
            !this.state.gameStarted ?
            <Login startGame={this.startGame}/> :
            <Gameboard playerName={this.state.playerName}/>
          }
        </div>
      );
    }
}

export default App;
