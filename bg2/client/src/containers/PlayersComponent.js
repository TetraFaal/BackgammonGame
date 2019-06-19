import React, { Component } from 'react'
import Button from '../components/Button'
import {connect} from 'react-redux'
import { setPlayerNo } from '../actions';

class Players extends Component {

    state = {
        player1Name: 'Joueur 1',
        player2Name: 'Joueur 2',
        player1Ready: false,
        player2Ready: false,
        canLeave: false,
        runningGame: false,
    };

    componentDidMount() {
		const {socket} = this.props;
        socket.on('updatePlayer1', data => {
            this.setState({
                player1Name: data[0],
                player1Ready: data[1]
            })
        })
        socket.on('updatePlayer2', data => {
            this.setState({
                player2Name: data[0],
                player2Ready: data[1]
            })
        })
        socket.on('runningGame', data => {
            this.setState({runningGame : data})
        })
        socket.on('canLeave', data => {
            this.setState({canLeave : data})
        })
        socket.on('message', data => {
            window.alert(data)
        })
	} 

	newGame = () => {
		const {socket} = this.props;
		socket.emit('startNewGame', this.props.playerNo)
    }

    continueGame = () => {
		const {socket} = this.props;
        socket.emit('continueGame')
    }

    leave = () => {
        const {socket} = this.props;
        socket.emit('leave', this.props.playerNo)
        this.props.setPlayerNumber(0)
    }
    
    choosePlayer = (playerNoInput) => {
        const {socket} = this.props;
        if(this.props.playerNo === 0) {
            if(playerNoInput === 1 && !this.state.player1Ready){
                this.props.setPlayerNumber(playerNoInput)
                socket.emit('choosePlayer', [this.props.username, true, playerNoInput])
            }
            else if(playerNoInput === 2 && !this.state.player2Ready ){
                this.props.setPlayerNumber(playerNoInput)
                socket.emit('choosePlayer', [this.props.username, true, playerNoInput])
            }
        }
    }
    
	render() {
		return (
			<div className="Players">
                <p>Connecté en tant que : {this.props.username}</p>
                <Button class="black" action={this.choosePlayer.bind(this, 1)} buttonTitle = {this.state.player1Name} />
                <Button class="red" action={this.choosePlayer.bind(this, 2)} buttonTitle = {this.state.player2Name} />
                {
                    this.state.canLeave ? 
                    <Button action={this.leave} buttonTitle = "Quitter" /> :
                    <div></div>
                }
                {
                    (this.state.player1Ready && this.state.player2Ready) ?
                    <Button action={this.newGame} buttonTitle = "Nouvelle partie" /> :
                    <div></div>
                }
                {
                    (this.state.runningGame) ?
                    <Button action={this.continueGame} buttonTitle = "Reprendre partie" /> :
                    <div></div>
                }
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
        username: state.reducer.username,
        playerNo: state.reducer.playerNo
	}
}
  
const mapDispatchToProps = (dispatch) => {
	return {
        setPlayerNumber: (playerNo) => {
            dispatch(setPlayerNo(playerNo))
        }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Players);