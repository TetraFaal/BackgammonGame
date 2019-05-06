const initialState = {
    loginSuccess: false,
    playerName: '',
    player1Name: 'Joueur 1',
    player2Name: 'Joueur 2',
    player1Ready: false,
    player2Ready: false,
    playerNo: 0,
    response: '',
    dice1Value: 0,
    dice2Value: 0,
    p1_pos: [],
    p2_pos: [],
    positions: [],
    posIndex: ''
}

function Reducer (state = initialState, action){
    switch(action.type){
        case "UPDATE_NAME": {
            return {...state, ...action}
        }
        case "LOGIN": {
            return {...state, ...action}
        }
        case "SET_RESPONSE": {
            return {...state, ...action}
        }
        case "CHECK_SUCCESS": {
            return {...state, ...action}
        }
        case "SET_POS": {
            return {...state, ...action}
        }
        case "SET_POS1": {
            return {...state, ...action}
        }
        case "SET_POS2": {
            return {...state, ...action}
        }
        case "SET_DICE1": {
            return {...state, ...action}
        }
        case "SET_DICE2": {
            return {...state, ...action}
        }
        case "SELECT_POS": {
            return {...state, ...action}
        }
        case "SET_PLAYER1": {
            return {...state, ...action}
        }
        case "SET_PLAYER2": {
            return {...state, ...action}
        }
        case "SET_PLAYER_NO": {
            return {...state, ...action}
        }
        default:
            return state
    }
}
export default Reducer