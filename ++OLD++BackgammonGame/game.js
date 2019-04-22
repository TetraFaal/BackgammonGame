//Regler les returns des fonction newGame et move (2)
//Voir si on get bien la position par p1_pos(i) ou [i]


var p1_pos = new List(26);
var p2_pos = new List(26);

var dice1 = 0;
var dice2 = 0;


function newGame(){
	var p1_pos = new List[0,0,0,0,0,5,0,3,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,2,0]; //Start position of p1

	var p2_pos = new List[0,2,0,0,0,0,0,0,0,0,0,5,0,0,0,0,3,0,5,0,0,0,0,0,0]; //start position of p2

	return p1_pos, p2_pos;
}

function throwDice(){
	return (Math.floor(Math.random() * 6)) + 1; //return number between 0 and 5 we add 1 to make it from 1 to 6
}

function move(player, p1_pos, p2_pos, position, numberDice){ 
	//if p1 player = true, if p2 player = false
	//p1_pos position of player1
	//p2_pos potion of player2
	//position is the actual position of the pawn (integer)
	//numberDice is the number of the dice

	var canPlay = false;

	//verification that a move is possible
	if(player){
		for(i = 1, i++, i > 26){
			if(p1_pos(i) >= 1){							//if there is a pawn
				if(i - numberDice > 0){					//The movement is not out of the board
					if(p2_pos(i - numberDice) <= 1){	//The movement leads to an equal or less than 1 opponent pawn
						canPlay = true;					//Then p1 can play
					}
				}
			}
		}
	}

	if(!player){
		for(i = 1, i++, i > 26){
			if(p2_pos(i) >= 1){							//if there is a pawn
				if(i + numberDice < 25){				//The movement is not out of the board
					if(p1_pos(i + numberDice) <= 1){	//The movement leads to an equal or less than 1 opponent pawn
						canPlay = true;					//THen p2 can play
					}
				}
			}
		}
	}

	if(!canPlay){
		print("Player cannot move !");
		return p1_pos, p2_pos; //A FINIR !
	}

	if(player){ //for p1
		 if(p1_pos(position) > 0){ //verification that there is a piece a the location

		 	if(position-numberDice <= 0){ //case where the pawn goes out of the board (it may have component pawn too)
		 		p1(position) -= 1;
		 		p1(0) += 1;
		 	}

		 	else{
			 	if(p2_pos(position-numberDice) <= 1){

			 		if(p2_pos(position-numberDice) == 1){	//If there is one pawn at the next pos
			 			p2_pos(position-numberDice) -= 1; 	//Delete this one
			 			p2_pos(0) += 1;	//add him to the pos 0
			 		}
			 		p1_pos(position) -= 1;					//-1 at the actual position
			 		p1_pos(position-numberDice) += 1;		//+1 at the next position
			 	}

			 	else{Print("You cannot move there because there is 2 or more pawn");}
		 	}
		 } 
		 else{print("There is no piece to move here");}
	}

	else if(!player){ //Same for p2
		if(p2_pos(position) > 0){

			if(position+numberDice >= 25){ //case where the pawn goes out of the board (it may have component pawn too)
		 		p2(position) -= 1;
		 		p2(25) += 1;
		 	}

		 	else{
				if(p1_pos(position+numberDice) <=1){

					if(p1_pos(position+numberDice) == 1){
						p1_pos(position+numberDice) -= 1;
						p1_pos(25) += 1;
					}
					p2_pos(position) -=1;
					p2_pos(position+numberDice) += 1;
				}
				else{Print("You cannot move there because there is 2 or more pawn");}
		 	}
		}
		else{print("There is no piece to move here");}
	}
	else{print("There is a problem with the player");}



	return p1_pos, p2_pos; //A FINIR !
}


function victoryCheck(){
	if(p1_pos(0) >= 15){
		print("Player1 win !");
	}
	if(p2_pos(25) >= 15){
		print("Player2 win!");
	}
}