import React, { Component } from 'react';

class Gameboard extends Component {

	state = {
		response: '',
		post: '',
		responseToPost: '',		
		pawns: ['red', 'black'],
		dice1Value: 0,
     	dice2Value: 0,
    	p1_pos: [],
     	p2_pos: [],
     	positions: [],
     	places: []
	}

	componentDidMount() {
		const places = this.createPlaces();
		this.setState({places : places});
	}

	createPlaces() {
		const places = [];	

		for(let i = 0; i < 26; i++) {
			const place = {};

			if(i === 0 || i === 25) {
				place.type = "out";
			}

			else {
				if(i % 2 !== 0) place.type = "dark";
				else place.type = "light";
			}

			places.push(place);
		}

		return places;
	}

	setPos() {
		const positions = [];
		let l = 25;
		let index = 0;	

		for(let i = 0; i < 26; i++) {
			const position = {};
/*
			if(this.state.p1_pos[i] === this.state.p2_pos[i]) position.color = "white-text";
			else if (this.state.p1_pos[i]>this.state.p2_pos[i]) position.color = "black-text";
			else if (this.state.p1_pos[i]<this.state.p2_pos[i]) position.color = "red-text";
*/
			if(i<13) {
				if(this.state.p1_pos[i] !== 0) {
					position.value = this.state.p1_pos[i]
					position.color = "black";
				}
				else if (this.state.p1_pos[i] === this.state.p2_pos[i]) {
					position.value = 0;
					position.color = "white";
				}
				else {
					position.value = this.state.p2_pos[i];
					position.color = "red";
				}
			}
			else {
				let p = l - i;
				if(this.state.p1_pos[i+p] !== 0) {
					position.value = this.state.p1_pos[i+p];
					position.color = "black";
				}
				else if (this.state.p1_pos[i+p] === this.state.p2_pos[i+p]) {
					position.value = 0;
					position.color = "white";
				}
				else {
					position.value = this.state.p2_pos[i+p]
					position.color = "red";
				}
				l = l - 1;
			}
			position.index = index;
			index ++;
			positions.push(position);

		}

		return positions;
	}

	function updatePos (position) {
		alert(position.value);
		return 

	}

	newGame = async e => {
	    e.preventDefault();
	    const response = await fetch('/api/newGame');
	    const body = await response.json();
	    this.setState({ p1_pos: body.p1_pos });
	    this.setState({ p2_pos: body.p2_pos });
	    const positions = this.setPos();
		this.setState({positions : positions});
  	}
  
  	diceSubmit = async e => {
		e.preventDefault();
		const response = await fetch('/api/dice');
		const body = await response.json();
		this.setState({ dice1Value: body[0] });
		this.setState({ dice2Value: body[1] });
  	}

  	movePawn() {
  		let value
    	let rightclick; 
   		let e = window.event;
    	if (e.which) rightclick = (e.which === 3);
    	else if (e.button) rightclick = (e.button === 2);
   		//alert(rightclick); //true or false, you can trap right click here by if comparison
		if (rightclick) {
			value = Math.min(this.state.dice1Value, this.state.dice2Value)
			alert(value, position.value);
		}
		else {
			value = Math.max(this.state.dice1Value, this.state.dice2Value)
			alert(value,this.positionIndex);
		}
	} 

  	render() {
      	return (
	        <div className="Gameboard">
	        	<p>Connecté en tant que : {this.props.playerName}</p>
	        	<form onSubmit={this.newGame}>
					<button type="submit">Nouvelle partie</button>
				</form>
	        	<div className="board">
	        	{
	        		this.state.positions.map((position, i) => (
	        			position.value !== 0 ? 
	        			<div key={i} className="place" onMouseDown={() => this.updatePos(position)}>
	        				<span className={position.color}>{position.value}</span>
	        			</div>:
	        			<div className="place"></div>
	        		))
	        	}
	        	</div>
				<form onSubmit={this.diceSubmit}>
					<button type="submit">Lancer dés</button>
				</form>
				<p>{this.state.dice1Value} {this.state.dice2Value}</p>
	        </div>
     	 );
    }
}

export default Gameboard;

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