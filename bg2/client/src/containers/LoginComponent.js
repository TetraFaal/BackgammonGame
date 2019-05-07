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
		socket.emit('username', [this.props.username])
  };

	render() {
		return (
			<div className="Login">
				<p><strong>Entrez votre pseudo</strong></p>
				<form>
					<input type="text" placeholder="Login" onChange={e => this.handleOnChangeName(e.target.value)}/>
				</form>
				{
					this.props.username !== '' ?
						/\s/.test(this.props.username) ?
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
		username: state.reducer.username,
		loginSuccess: state.reducer.loginSuccess
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onChangeName: (username) => {
			dispatch(updateName(username))
		},
		checkSuccess: (loginState) => {
			dispatch(isLoginSucces(loginState))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);