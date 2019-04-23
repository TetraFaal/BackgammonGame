import React, { Component } from 'react';

class Login extends Component {

	state = {
		response: '',
		post: '',
		responseToPost: '',
		pawns: ['red', 'black']
	};

	loginSubmit = async e => {
      e.preventDefault();
      const response = await fetch('/api/login', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({ post: this.state.post }),
      });
      const body = await response.text();

      this.setState({ responseToPost: body });
	};

	render() {
		return (
			<div className='Login'>
				<h1>Backgammon</h1>
				<form onSubmit={this.loginSubmit}>
		        	<p><strong>Entrez votre pseudo</strong></p>
		        	<input
		        		type="text"
		        		value={this.state.post}
		        		onChange={e => this.setState({ post: e.target.value })}
		        	/>
		        	<button type="submit">Jouer !</button>
		      	</form>
		      	<p>{this.state.responseToPost}</p>
		      	{
	        		this.state.pawns.map(pawn => (
	        			<img
	        				className="pawn"
        					src={`./img/${pawn}.png`} />
	        		))
	        	}
	      	</div>
		);
	}
}

export default Login;