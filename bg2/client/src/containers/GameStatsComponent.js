import React, { Component } from 'react'
import Button from '../components/Button'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class Stats extends Component {

	constructor(props) {
		super(props);
		this.state = {
			//Grid definition -- this is how the module works (AgGridReact)
			columnDefs: [{
			headerName: "ID", field: "id", sortable: true, filter: true
			}, {
			headerName: "Joueur 1", field: "player1", sortable: true, filter: true
			}, {
			headerName: "Joueur 2", field: "player2", sortable: true, filter: true
			}, {
			headerName: "Score Joueur 1", field: "score1", sortable: true, filter: true
			}, {
			headerName: "Score Joueur 2", field: "score2", sortable: true, filter: true
			}, {
			headerName: "Début de partie", field: "date", sortable: true, filter: true
			}, {
			headerName: "Durée", field: "length", sortable: true, filter: true
			}],
			rowData: [{}],
			showStats: false
		}
	}

	componentDidMount() {
		const {socket} = this.props;
		socket.on('gameStats', data => {
			//The data recieved from server is put in the rows of the grid
			this.setState({rowData :  data});
		})
	}

	getStats = () => {
		if (!this.state.showStats) {
			this.setState({showStats : true})
			const {socket} = this.props;
			socket.emit('getGameStats')
		}
		else this.setState({showStats : false})
  	};

	render() {
		return (
			<div className="Stats">
				<Button action={this.getStats} buttonTitle = "Statistiques Parties" />
				{
					this.state.showStats ?
					<div style={{ height: '400px', width: '800px', alignSelf: 'center' }} className="ag-theme-balham">
					<AgGridReact
						columnDefs={this.state.columnDefs}
						rowData={this.state.rowData}>
					</AgGridReact>
					</div> :
					<div></div>
				}
			</div>
		)
	}
}

export default Stats