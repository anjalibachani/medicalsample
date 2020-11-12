import DataTable from 'react-data-table-component';
import React, { Component } from 'react';
import Axios from 'axios';
import Filter from './Filter';
import { Button, Form, FormControl, InputGroup, Row, Col, Modal} from 'react-bootstrap';
const config = require('../config/config.json')

 
//const data = [{ id: 1, Date: 'Conan the Barbarian', From: '1982' }, { id: 1, Date: 'Conan the Barbarian', From: '1982' }];


const handleChange = (state) => {
  // You can use setState or dispatch with something like Redux so we can use the retrieved data
  console.log('Selected Rows: ', state.selectedRows);
};


const columns = [
  {
    name: "Date",
    selector: "shipment_date",
    //sortable: true,
  },
  {
    name: "From",
    selector: "location_name",
    //sortable: true
  },
  {
    name: "To",
    selector: "location_name",
    //sortable: true,
  },
  {
    name: "Samples",
    selector: "no_of_samples",
    //sortable: true,
  },
  {
    name: "Received Status",
    selector: "reached",
    //sortable: true,
  },
];
class Basic2Table extends Component {
  constructor(props) {
		super(props);
		this.state = {
			/* Array of sample data from the database. */
      data: [],
      //filters: [<Filter key={1} number={1} retVals={this.getFilterValues}/>],
			//returnedFilterValues: [],
			//modal: [],
    }
  }
  componentDidMount(){
		Axios.get(`http://${config.server.host}:${config.server.port}/shipment/viewshipments`).then((response)=>{
			console.log(response.data)
			this.setState({
				data : response.data
			});
		})
  }
  
  render() {
    return (
      <div>
        {/* <input value={filterInput} onChange={handleFilterChange} placeholder={"Search name"}/> */}
        <DataTable title="Shipments" columns={columns} data={this.state.data} selectableRows Clicked Selected={handleChange}/>
      </div>
    )
  }
};
export default Basic2Table;