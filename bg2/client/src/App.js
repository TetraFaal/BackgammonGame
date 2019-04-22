import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import black from './black.png';
import red from './red.png';
import './App.css';

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
  /*
  handleSubmit = async e => {
      e.preventDefault();
      const response = await fetch('/api/world', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({ post: this.state.post }),
      });
      const body = await response.text();

      this.setState({ responseToPost: body });
  };
  */
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
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </header>
          <p>{this.state.response}</p>

          <form onSubmit={this.play}>
            <button type="submit">Jouer</button>
          </form>

          <form onSubmit={this.handleSubmit}>
            <p>
             <strong>Post to Server:</strong>
            </p>
            <input
              type="text"
              value={this.state.post}
              onChange={e => this.setState({ post: e.target.value })}
            />
            <button type="submit">Submit</button>
          </form>
          <p>{this.state.responseToPost}</p>

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
