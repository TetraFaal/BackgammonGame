const initialState = {
    response: '',
    loginSuccess: false,
    username: '',
    playerNo: 0,
    p1_pos: [],
    p2_pos: [],
    positions: [],
    roomNumber: null
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
        case "SET_PLAYER_NO": {
            return {...state, ...action}
        }
        case "UPDATE_ROOM": {
            return {...state, ...action}
        }
        default:
            return state
    }
}
export default Reducer