import React, { Component } from 'react'
import Button from '../components/Button'
import {connect} from 'react-redux'
import{ setPos, setPos1, setPos2} from '../actions/index'

class Gameboard extends Component {

	state = {
		dice1Value: '',
		dice2Value: '',
		posIndex: '',
		playerTurn: false,
		diceThrown: false,
	};

	componentDidMount() {
		const {socket} = this.props;
		socket.on('diceValues', data => {
			this.setState({ diceThrown : true })
			this.setState({ dice1Value : data[0] });
			this.setState({ dice2Value : data[1] });
		})
		socket.on('dicePlayed', data => {
			let diceNo = data;
			if(diceNo === 1) {
				this.setState({ dice1Value : '' })
			}
			else if (diceNo === 2){
				this.setState({ dice2Value : '' })
			}
		})
		socket.on('updatePos', data => {
			this.props.getPositions1(data[0]);
			this.props.getPositions2(data[1]);
			this.props.getPositions(this.props.p1_pos,this.props.p2_pos);
		})
		socket.on('nextTurn', data => {
			if(data === this.props.playerNo) {
				this.setState({ playerTurn : false })
			}
			else {
				this.setState({ playerTurn : true })
				this.setState({ diceThrown : false })
			}
		})
		socket.on('summary', data => {
			window.alert("Résumé de partie\n\nID partie : " + data[0] + "\nJoueur 1 : " + data[1] + "\nJoueur 2 : " + data[2] + "\nTemps de jeu : " + data[3] + "\nScore Joueur 1 : " + data[4] + "\nScore Joueur 2 : " + data[5])
		})
	}

	diceSubmit = () => {
		const {socket} = this.props;
		socket.emit('throwDice')
	}

	movePawn = (diceValue, diceNo) => {
		const {socket} = this.props;
		if(diceValue !== '') {
			socket.emit('movePawn', [this.state.posIndex,diceValue, diceNo,this.props.playerNo])
		}
	}

	handleClick(i, event) {
		this.setState({ posIndex : i })
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
				<p>{this.state.posIndex}</p>
				{
					this.state.playerTurn ?
					<div>
						{
							this.state.diceThrown ?
							<div></div>:
							<Button action={this.diceSubmit} buttonTitle = "Lancer dés" />
						}						
						<Button action={this.movePawn.bind(this, ...[this.state.dice1Value, 1])} buttonTitle = {this.state.dice1Value} />
						<Button action={this.movePawn.bind(this, ...[this.state.dice2Value, 2])} buttonTitle = {this.state.dice2Value} />
					</div> :
					<div>
						<span className="dice">{this.state.dice1Value}</span>
						<span className="dice">{this.state.dice2Value}</span>
					</div>
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		playerNo: state.reducer.playerNo,
		p1_pos: state.reducer.p1_pos,
		p2_pos: state.reducer.p2_pos,
		positions: state.reducer.positions,
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
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Gameboard);