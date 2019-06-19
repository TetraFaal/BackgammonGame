import React, { Component } from 'react'
import Button from '../components/Button'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class Stats extends Component {

	constructor(props) {
		super(props);
		this.state = {
			//Grid definition -- this is how the api works (AgGridReact)
			columnDefs: [{
			headerName: "ID", field: "id", sortable: true, filter: true
			}, {
			headerName: "Nom", field: "name", sortable: true, filter: true
			}, {
			headerName: "Parties jouées", field: "games", sortable: true, filter: true
			}, {
			headerName: "Parties gagnées", field: "win", sortable: true, filter: true
			}, {
			headerName: "Taux de victoire", field: "rate", sortable: true, filter: true
			}, {
			headerName: "Date d'inscription", field: "register_date", sortable: true, filter: true
			}],
			rowData: [{}],
			showStats: false
		}
	}

	componentDidMount() {
		const {socket} = this.props;
		socket.on('stats', data => {
			//The data recieved from server is put in the rows of the grid
			this.setState({rowData :  data});
		})
	}

	getStats = async e => {
		if (!this.state.showStats) {
			this.setState({showStats : true})
			const {socket} = this.props;
			socket.emit('getStats')
		}
		else this.setState({showStats : false})
  	};

	render() {
		return (
			<div className="Stats">
				<Button action={this.getStats} buttonTitle = "Statistiques" />
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