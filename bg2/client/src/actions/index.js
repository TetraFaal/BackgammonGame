/*
export const incrementCount = count => {
  const num = count+1
  return {
  type: 'INCREMENT_COUNT',
  count: num
  }
}

export const decrementCount = count => {
  const num = count-1
  return {
    type: 'DECREMENT_COUNT',
    count: num
  }
}

export const multiplyCount = count => {
  const num = count*2
  return {
    type: 'MULITPLY_COUNT',
    count: num
  }
}

export const fillArray = (array,value) => {
  const arrayTemp = array+value
  return {
    type: 'FILL_ARRAY',
    array: arrayTemp
  }
}
*/
export const updateName = (playerName) => {
  const tempName = playerName
  return {
    type: 'UPDATE_NAME',
    playerName: tempName
  }
}
export const isLoginSucces = (loginState) => {
  let tempState = false;
  if (loginState===true) {
    tempState = true;
  }
  return {
    type: 'CHECK_SUCCESS',
    loginSuccess: tempState
  }
}
export const setResponse = (response) => {
  const tempResponse = response
  return {
    type: 'SET_RESPONSE',
    response: tempResponse
  }
}
export const setPos = (pos1,pos2) => {
  let temp = [];
  let l = 25;
	let index = 0;

  for(let i = 0; i < 26; i++) {
    const position = {};    
    position.index = index;
    if(i<13) {
      if(pos1[i] !== 0) {
        position.value = pos1[i]
        position.color = "black";
      }
      else if (pos1[i] === pos2[i]) {
        position.value = 0;
        position.color = "white";
      }
      else {
        position.value = pos2[i];
        position.color = "red";
      }
    }
    else {
      let p = l - i;
      if(pos1[i+p] !== 0) {
        position.value = pos1[i+p];
        position.color = "black";
      }
      else if (pos1[i+p] === pos2[i+p]) {
        position.value = 0;
        position.color = "white";
      }
      else {
        position.value = pos2[i+p]
        position.color = "red";
      }
      l = l - 1;
    }
    index ++;
    temp.push(position);
  }
  return {
    type: 'SET_POS',
    positions: temp
  }
}
export const setPos1 = (pos1) => {
  const temp = pos1
  return {
    type: 'SET_POS1',
    p1_pos: temp
  }
}
export const setPos2 = (pos2) => {
  const temp = pos2
  return {
    type: 'SET_POS2',
    p2_pos: temp
  }
}
export const setDice1 = (dice1) => {
  const temp = dice1
  return {
    type: 'SET_DICE1',
    dice1Value: temp
  }
}
export const setDice2 = (dice2) => {
  const temp = dice2
  return {
    type: 'SET_DICE2',
    dice2Value: temp
  }
}