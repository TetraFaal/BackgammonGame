import React, { Component } from 'react'
import Button from '../components/Button'
import {connect} from 'react-redux'
import { setPos, setPos1, setPos2, setPlayer1, setPlayer2, setPlayerNo } from '../actions';

class Players extends Component {

    componentDidMount() {
		const {socket} = this.props;
		socket.on('newGamePos', data => {
			this.props.getPositions1(data[0]);
			this.props.getPositions2(data[1]);
			this.props.getPositions(this.props.p1_pos,this.props.p2_pos);
        })
        socket.on('updatePlayer1', data => {
            this.props.choosePlayer1(data)
        })
        socket.on('updatePlayer2', data => {
            this.props.choosePlayer2(data)
        })
	} 

	newGame = () => {
		const {socket} = this.props;
		socket.emit('startNewGame')
    }
    
    choosePlayer = (playerNoInput) => {
        const {socket} = this.props;
        let isReady = false;
        if(this.props.playerNo === 0) {
            if(playerNoInput === 1 && !this.props.player1Ready){
                isReady = true;
                this.props.setPlayerNumber(playerNoInput)
                console.log([this.props.playerName, isReady, playerNoInput])
                socket.emit('choosePlayer', [this.props.playerName, isReady, playerNoInput])
            }
            if(playerNoInput === 2 && !this.props.player2Ready){
                isReady = true;
                this.props.setPlayerNumber(playerNoInput)
                console.log([this.props.playerName, isReady, playerNoInput])
                socket.emit('choosePlayer', [this.props.playerName, isReady, playerNoInput])
            }
        }
    }

	render() {
		return (
			<div className="Players">
                <p>Connecté en tant que : {this.props.playerName}</p>
                <Button className="button-black" action={this.choosePlayer.bind(this, 1)} buttonTitle = {this.props.player1Name} />
                <Button className="button-red" action={this.choosePlayer.bind(this, 2)} buttonTitle = {this.props.player2Name} />
                {
                    (this.props.player1Ready === true && this.props.player2Ready === true) ?
                    <Button action={this.newGame} buttonTitle = "Nouvelle partie" /> :
                    <div></div>
                }
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
        playerName: state.reducer.playerName,
        player1Name: state.reducer.player1Name,
        player2Name: state.reducer.player2Name,
        player1Ready: state.reducer.player1Ready,
        player2Ready: state.reducer.player2Ready,
        playerNo: state.reducer.playerNo,
        p1_pos: state.reducer.p1_pos,
		p2_pos: state.reducer.p2_pos,
	}
}
  
const mapDispatchToProps = (dispatch) => {
	return {
        getPositions1: (pos1) => {
			dispatch(setPos1(pos1))
		},
		getPositions2: (pos2) => {
			dispatch(setPos2(pos2))
		},
		getPositions: (pos1,pos2) => {
			dispatch(setPos(pos1,pos2))
		},
        choosePlayer1: (playerName) => {
            dispatch(setPlayer1(playerName))
        },
        choosePlayer2: (playerName) => {
            dispatch(setPlayer2(playerName))
        },
        setPlayerNumber: (playerNo) => {
            dispatch(setPlayerNo(playerNo))
        }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Players);