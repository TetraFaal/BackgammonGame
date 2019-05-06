import React, { Component } from 'react'
import Button from '../components/Button'
import {connect} from 'react-redux'
import{ setPos, setPos1, setPos2, setDice1, setDice2, selectPos} from '../actions/index'

class Gameboard extends Component {

	componentDidMount() {
		const {socket} = this.props;
		socket.on('diceValues', data => {
			this.props.getDice1(data[0]);
			this.props.getDice2(data[1]);
		})
		socket.on('updatePos', data => {
			this.props.getPositions1(data[0]);
			this.props.getPositions2(data[1]);
			this.props.getPositions(this.props.p1_pos,this.props.p2_pos);
		})
		socket.on('newGamePos', data => {
			this.props.getPositions1(data[0]);
			this.props.getPositions2(data[1]);
			this.props.getPositions(this.props.p1_pos,this.props.p2_pos);
        })
	}

	newGame = () => {
		const {socket} = this.props;
		socket.emit('startNewGame')
    }

	diceSubmit = () => {
		const {socket} = this.props;
		socket.emit('throwDice')
	}

	movePawn = diceValue => {
		const {socket} = this.props;
		socket.emit('movePawn', [this.props.posIndex,diceValue,this.props.playerNo])
	}

	handleClick(i, event) {
		this.props.selectPosIndex(i)
	}

	render() {
		return (
			<div className="Gameboard">
				<div className="board">
				{
					this.props.positions.map((position, i) => (
						position.value !== 0 ?
						<div key={i} className="place" onClick={this.handleClick.bind(this, position.index)}>
							<span className={position.color}>{position.value}</span>
						</div>:
						<div className="place"></div>
					))
				}
				</div>
				<p>{this.props.posIndex}</p>
				<Button action={this.diceSubmit} buttonTitle = "Lancer dés" />
				<Button action={this.movePawn.bind(this, this.props.dice1Value)} buttonTitle = {this.props.dice1Value} />
				<Button action={this.movePawn.bind(this, this.props.dice2Value)} buttonTitle = {this.props.dice2Value} />			
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		playerName: state.reducer.playerName,
		playerNo: state.reducer.playerNo,
		positions: state.reducer.positions,
		p1_pos: state.reducer.p1_pos,
		p2_pos: state.reducer.p2_pos,
		dice1Value: state.reducer.dice1Value,
		dice2Value: state.reducer.dice2Value,
		posIndex: state.reducer.posIndex,
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
		getDice1: (dice1) => {
			dispatch(setDice1(dice1))
		},
		getDice2: (dice2) => {
			dispatch(setDice2(dice2))
		},
		getPositions: (pos1,pos2) => {
			dispatch(setPos(pos1,pos2))
		},
		selectPosIndex: (index) => {
			dispatch(selectPos(index))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Gameboard);