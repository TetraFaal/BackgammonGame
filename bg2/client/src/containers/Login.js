import React, { Component } from 'react';

class Login extends Component {

	state = {
		response: '',
		playerName: '',
		responseToPost: ''
	};

	loginSubmit = async e => {
      e.preventDefault();
      const response = await fetch('/api/login', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({ post: this.state.playerName }),
      });
      const body = await response.text();
      this.setState({ responseToPost: body });
	};

	startGame = () => {
		this.props.startGame(this.state.playerName);
	}

	render() {
		return (
			<div className='Login'>
				<p><strong>Entrez votre pseudo</strong></p>
		        	<input
		        		type="text"
		        		value={this.state.playerName}
		        		onChange={e => this.setState({ playerName: e.target.value })}
		        	/>
				{
					this.state.playerName !== '' ?
						/\s/.test(this.state.playerName) ?
							<p>Le pseudo ne peut contenir d'espaces</p> :
					        <React.Fragment>
					        	<form onSubmit={this.loginSubmit}>
					        		<button onClick={this.startGame} type="submit">Jouer !</button>
					      		</form>
					      		<p>{this.state.responseToPost}</p>
				      		</React.Fragment>
				      	:
			      		<React.Fragment>
			      		</React.Fragment>
				}

	      	</div>
		);
	}
}

export default Login;