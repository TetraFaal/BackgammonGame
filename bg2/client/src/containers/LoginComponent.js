import React, { Component } from 'react'
import Button from '../components/Button'
import {connect} from 'react-redux'
import{updateName, isLoginSucces} from '../actions/index'

class LoginComponent extends Component {

	componentDidMount() {
		const {socket} = this.props;
		socket.on('loginStatus', data => {
			this.props.checkSuccess(data);
		})
	}

	handleOnChangeName = (value) => {
		this.props.onChangeName(value)
	}

	handleSubmit = async e => {
		const {socket} = this.props;
		socket.emit('username', [this.props.playerName])
  };

	render() {
		return (
			<div className="Login">
				<p><strong>Entrez votre pseudo</strong></p>
				<form>
					<input type="text" placeholder="Login" onChange={e => this.handleOnChangeName(e.target.value)}/>
				</form>
				{
					this.props.playerName !== '' ?
						/\s/.test(this.props.playerName) ?
						<p>Le pseudo ne peut contenir d'espaces</p> 
						:
					  <Button action={this.handleSubmit} buttonTitle = "Login" />
					:
					<div></div>
				}
				{this.props.loginSuccess}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		playerName: state.reducer.playerName,
		responseToPost: state.reducer.responseToPost,
		loginSuccess: state.reducer.loginSuccess
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onChangeName: (playerName) => {
			dispatch(updateName(playerName))
		},
		checkSuccess: (loginState) => {
			dispatch(isLoginSucces(loginState))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);