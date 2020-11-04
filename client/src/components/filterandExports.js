import React, { Component } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { Button, Form, FormControl, InputGroup, Row, Col, Modal} from 'react-bootstrap';
import CustomTable from './CustomTable';
import CustomAlertBanner from './CustomAlertBanner';
import Axios from 'axios';
import Filter from './Filter';
import DatePicker from 'react-datepicker'
import Header from './Header';
import Table from './Table';
const config = require('../config/config.json')


/* This is the 'Filter and Export' page--here the user can view available samples, add and 
 * define any number of filters for that view, and export information to a CSV file for 
 * further analysis. */
class filterandExports extends Component {
	constructor(props) {
		super(props);
		this.state = {
			/* Array of sample data from the database. */
			data: [],

			/* An array of filters, and another array for their returned values for processing. */
			filters: [<Filter key={1} number={1} retVals={this.getFilterValues}/>],
			returnedFilterValues: [],
			modal: [],
        }
	}

	componentDidMount(){
		Axios.get(`http://${config.server.host}:${config.server.port}/api/filter`).then((response)=>{
			console.log(response.data)
			this.setState({
				data : response.data
			});
		})
	}
	columns = [
		{ title: <input type="checkbox" name="id[]"/>, data: "sample_id"},
		{ title: "ID", data:'sample_id' },
		{ title: "Eval", data:'eval'  },
		{ title: "SubStudy", data:'sub_study_name' },
		{ title: "Date", data: 'date' },
		{ title: "Type", data:"type" },
		{ title: "Aliquots", data: 'aliquots' },
		];
	
	render() {
		return (
            <div>
				<Header/>
				<Table columns={this.columns} data={this.state.data}/>
			</div>
		)
	};

	addFilter() {
		var newFilterArray = this.state.filters.concat(<Filter key={this.state.filters.length + 1} number={this.state.filters.length + 1} retVals={this.getFilterValues}/>);
		this.setState({ filters: newFilterArray });
	};
	

    


}
export default filterandExports;
