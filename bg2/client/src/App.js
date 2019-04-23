import React, { Component } from 'react';
import './App.css';
import Login from './containers/Login';

class App extends Component {
  state = {
      response: '',
      post: '',
      responseToPost: '',
      dice1Value: 0,
      dice2Value: 0,
      p1_pos: [],
      p2_pos: [],
      test: ''
  };

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

  play = async e => {
    e.preventDefault();
    const response = await fetch('/api/newGame');
    const body = await response.json();
    this.setState({ p1_pos: body.p1_pos });
    this.setState({ p2_pos: body.p2_pos });
  };
  
  diceSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/dice');
    const body = await response.json();
    this.setState({ dice1Value: body[0] });
    this.setState({ dice2Value: body[1] });
  };

  changePos() {
    this.setState({ test: "succes"});
  }

  render() {
      return (
        <div className="App">
          <Login/>
          <form onSubmit={this.play}>
            <button type="submit">Jouer</button>
          </form>
          <form onSubmit={this.diceSubmit}>
            <button type="submit">Lancer dés</button>
          </form>
          <p>{this.state.dice1Value}</p>
          <p>{this.state.dice2Value}</p>
        </div>
      );
    }
}

export default App;
