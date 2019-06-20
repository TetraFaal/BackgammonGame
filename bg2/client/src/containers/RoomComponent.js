import React, { Component } from 'react'
import Button from '../components/Button'
import {connect} from 'react-redux'
import{updateRoom} from '../actions/index'

class RoomComponent extends Component {

    roomSubmit = (roomNumber) => {
        const {socket} = this.props;
        socket.emit('selectRoom', [roomNumber]);
        this.props.selectRoom(roomNumber);
    };

	render() {
		return (
			<div className="Rooms">
                <p>Salon : {this.props.roomNumber}</p>
				<Button action={this.roomSubmit.bind(this,1)} buttonTitle = "1" />
                <Button action={this.roomSubmit.bind(this,2)} buttonTitle = "2" />
                <Button action={this.roomSubmit.bind(this,3)} buttonTitle = "3" />
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		roomNumber: state.reducer.roomNumber
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		selectRoom: (roomNumber) => {
			dispatch(updateRoom(roomNumber))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps) (RoomComponent)