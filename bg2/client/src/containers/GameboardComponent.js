import React, { Component } from 'react'
import Button from '../components/Button'
import {connect} from 'react-redux'
import{ setPos, setPos1, setPos2, setDice1, setDice2} from '../actions/index'

class Gameboard extends Component {

	newGame = async e => {
	    e.preventDefault();
	    const response = await fetch('/api/newGame');
		const body = await response.json();
		this.props.getPositions1(body.p1_pos);
		this.props.getPositions2(body.p2_pos);
		this.props.getPositions(this.props.p1_pos,this.props.p2_pos);
  	}
  
  	diceSubmit = async e => {
		e.preventDefault();
		const response = await fetch('/api/dice');
		const body = await response.json();
		this.props.getDice1(body[0]);
		this.props.getDice2(body[1]);
	}

	rightClick = () => {
		let rightclick; 
		let e = window.event;
		if(e !== undefined) {
		  if (e.which) rightclick = (e.which === 3);
		  else if (e.button) rightclick = (e.button === 2);
		  if (rightclick) {
			alert(true)
		  }
		  else {
			alert(false)
		  }
		}      	
	}

  	render() {
      	return (
	        <div className="Gameboard">
	        	<p>Connecté en tant que : {this.props.playerName}</p>
	        	<Button action={this.newGame} buttonTitle = "Nouvelle partie" />
				<p>{this.props.p1_pos}</p>
				<p>{this.props.p2_pos}</p>
				<div className="board">
	        	{
	        		this.props.positions.map((position, i) => (
	        			position.value !== 0 ?
	        			<div key={i} className="place" onMouseDown={this.rightClick()}>
	        				<span className={position.color}>{position.value}</span>
	        			</div>:
	        			<div className="place"></div>
	        		))
				}
	        	</div>
				<Button action={this.diceSubmit} buttonTitle = "Lancer dés" />
				<p>{this.props.dice1Value} {this.props.dice2Value}</p>
	        </div>
     	);
    }
}

const mapStateToProps = (state) => {
	return {
		playerName: state.reducer.playerName,
		response: state.reducer.response,
		positions: state.reducer.positions,
		p1_pos: state.reducer.p1_pos,
		p2_pos: state.reducer.p2_pos,
		dice1Value: state.reducer.dice1Value,
		dice2Value: state.reducer.dice2Value,
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
		}
	}
  }

export default connect(mapStateToProps, mapDispatchToProps)(Gameboard);

/*
{
	        		this.state.places.map((place, i) => (
	        			<div key={i} className="place">
	        				{place.type}
	        			</div>
	        		))
	        	}

{
					this.state.pawns.map(pawn => (
						<img
							onClick={() => this.movePawn(pawn)}
							onMouseDown={() => this.rightclick()}
							key={pawn}	        				
							alt={pawn}
							className="pawn"
							src={`./img/${pawn}.png`} />
				))
				}

	        	*/