export const updateName = (username) => {
  const tempName = username
  return {
    type: 'UPDATE_NAME',
    username: tempName
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
  for(let i = 0; i < 26; i++) {
    const position = {};
    if(i < 13) {
      if(i === 0) {
        position.value = `Out1:${pos1[i]}\nIn2:${pos2[i]}`
        position.color = "blue"
      }
      else if(pos1[i] !== 0) {
        position.value = pos1[i]
        position.color = "black";
      }
      else if (pos1[i] === pos2[i]) {
        position.value = 0;
        position.color = "blue";
      }
      else {
        position.value = pos2[i];
        position.color = "red";
      }
      position.index = i;
    }
    else{
      let p = l - i;
      if(i === 13) {
        position.value = `Out2:${pos2[i+p]}\n\nIn1:${pos1[i+p]}`
        position.color = "blue"
      }
      else if(pos1[i+p] !== 0) {
        position.value = pos1[i+p];
        position.color = "black";
      }
      else if (pos1[i+p] === pos2[i+p]) {
        position.value = 0;
        position.color = "blue";
      }
      else {
        position.value = pos2[i+p]
        position.color = "red";
      }
      l = l - 1;
      position.index = i+p;
    }
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
export const setPlayerNo = (playerNo) => {
  const temp = playerNo
  return {
    type: 'SET_PLAYER_NO',
    playerNo: temp
  }
}