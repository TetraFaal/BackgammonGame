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
	} 

	newGame = () => {
		const {socket} = this.props;
		socket.emit('startNewGame', this.props.playerNo)
    }
    
    choosePlayer = (playerNoInput) => {
        const {socket} = this.props;
        let isReady = false;
        if(this.props.playerNo === 0) {
            if(playerNoInput === 1 && !this.state.player1Ready){
                isReady = true;
                this.props.setPlayerNumber(playerNoInput)
                console.log([this.props.username, isReady, playerNoInput])
                socket.emit('choosePlayer', [this.props.username, isReady, playerNoInput])
            }
            if(playerNoInput === 2 && !this.state.player2Ready){
                isReady = true;
                this.props.setPlayerNumber(playerNoInput)
                console.log([this.props.username, isReady, playerNoInput])
                socket.emit('choosePlayer', [this.props.username, isReady, playerNoInput])
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
                    (this.state.player1Ready === true && this.state.player2Ready === true) ?
                    <Button action={this.newGame} buttonTitle = "Nouvelle partie" /> :
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