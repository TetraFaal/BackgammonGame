import React, { Component } from 'react'
import Button from '../components/Button'
import {connect} from 'react-redux'
import{updateRoom, setPlayerNo} from '../actions/index'

class RoomComponent extends Component {

	state = {
		canLeaveRoom: false
	}

	componentDidMount () {
		const {socket} = this.props;
        socket.on('canLeaveRoom', data => {
            this.setState({canLeaveRoom : data})
        })
	}

	leaveRoom = () => {
        const {socket} = this.props;
		socket.emit('leaveRoom', this.props.playerNo)
		this.props.selectRoom(null);
        this.props.setPlayerNumber(0)
    }

    roomSubmit = (roomNumber) => {
        const {socket} = this.props;
        socket.emit('selectRoom', [roomNumber]);
        this.props.selectRoom(roomNumber);
    };

	render() {
		return (
			<div className="Rooms">
                <p>Salon : {this.props.roomNumber}</p>
				{
					this.state.canLeaveRoom ?
					<div>
						<Button action={this.leaveRoom} buttonTitle = "Quitter Salon" />
					</div>:
					<div className="roomButtons">
						<Button action={this.roomSubmit.bind(this,1)} buttonTitle = "1" />
						<Button action={this.roomSubmit.bind(this,2)} buttonTitle = "2" />
						<Button action={this.roomSubmit.bind(this,3)} buttonTitle = "3" />
					</div>
				}
				
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		playerNo: state.reducer.playerNo,
		roomNumber: state.reducer.roomNumber
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		selectRoom: (roomNumber) => {
			dispatch(updateRoom(roomNumber))
		},
		setPlayerNumber: (playerNo) => {
            dispatch(setPlayerNo(playerNo))
        }
	}
}

export default connect(mapStateToProps, mapDispatchToProps) (RoomComponent)