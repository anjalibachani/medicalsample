import React, { Component } from 'react';
import differenceBy from 'lodash/differenceBy';
import DataTable, { createTheme } from 'react-data-table-component';
import { Button, Form, FormControl, InputGroup, Row, Col, Modal, Container} from 'react-bootstrap';
//import CustomTable from './CustomTable';
import CustomAlertBanner from './CustomAlertBanner';
import Axios from 'axios';
import Filter from './Filter';
import DatePicker from 'react-datepicker'
import Header from './Header';
//import Table from './Table';
import memoize from 'memoize-one';
const config = require('../config/config.json')

const columns = [
    // {
    //     name: "key",
    //     selector: "samples_key",
    //     hide: false,
    // },
	{
    name: "ID",
    selector: "sample_id",
    sortable: true,
	},
	{
    name: "Eval",
    selector: "eval",
    sortable: true
	},
	{
    name: "Sub Study Name",
    selector: "sub_study_name",
    sortable: true,
	},
	{
    name: "Date",
    selector: "date",
    sortable: true,
	},
	{
    name: "Type",
    selector: "type",
    sortable: true,
	},
	{
    name: "Aliquots",
    selector: "aliquots",
    sortable: true,
	}
];

function convertArrayOfObjectsToCSV(array){
	let result;

	const columnDelimiter = ',';
	const lineDelimiter = '\n';
	const keys = Object.keys(array[0]);

	result = '';
	result += keys.join(columnDelimiter);
	result += lineDelimiter;

	array.forEach(item => {
		let ctr = 0;
		keys.forEach(key => {
		if (ctr > 0) result += columnDelimiter;

		result += item[key];
		
		ctr++;
		});
	result += lineDelimiter;
	});

	return result;
}

function downloadCSV(array) {
	const link = document.createElement('a');
	let csv = convertArrayOfObjectsToCSV(array);
	if (csv == null) return;

	const filename = 'export.csv';
	if (!csv.match(/^data:text\/csv/i)) {
		csv = `data:text/csv;charset=utf-8,${csv}`;
	}

	link.setAttribute('href', encodeURI(csv));
	link.setAttribute('download', filename);
	link.click();
}

const contextActions = memoize(deleteHandler => (
    <Button onClick={deleteHandler}>Delete</Button>
    ));
/* This is the 'Filter and Export' page--here the user can view available samples, add and 
 * define any number of filters for that view, and export information to a CSV file for 
 * further analysis. */
class filterandExports extends Component {
	constructor(props) {
    super(props);
    this.state = {
      /* Array of sample data from the database. */
    data: [],
    selectedRows:[],
    toggleCleared:false,

      /* An array of filters, and another array for their returned values for processing. */
    filters: [<Filter key={1} number={1} retVals={this.getFilterValues} />],
    returnedFilterValues: [],
    modal: [],
    };
	}
Export = ({ onExport }) => (
	<Button onClick={e => onExport(e.target.value)}>Export</Button>
);
componentDidMount() {
    Axios.get(
		`http://${config.server.host}:${config.server.port}/api/filter`
    ).then((response) => {
    console.log(response.data);
    this.setState({
        data: response.data,
	});
    });
}


handleChange = state => {
  this.setState({ selectedRows: state.selectedRows });
};

handleRowClicked = row => {
  
  console.log(`${row.sample_id} was clicked!`);
}

deleteAll = () => {
  const { selectedRows } = this.state;
  const rows = selectedRows.map(r => r.samples_key);
  
  if (window.confirm(`Are you sure you want to delete:\r ${rows}?`)) {
    this.setState(state => ({ toggleCleared: !state.toggleCleared, data: differenceBy(state.data, state.selectedRows, 'samples_key') }));
  }
}

  // columns = [
  //    { title: <input type="checkbox" name="id[]"/>, data: "sample_id"},
  //    { title: "ID", data:'sample_id' },
  //    { title: "Eval", data:'eval'  },
  //    { title: "SubStudy", data:'sub_study_name' },
  //    { title: "Date", data: 'date' },
  //    { title: "Type", data:"type" },
  //    { title: "Aliquots", data: 'aliquots' },
  //    ];

render() {
    const { data, toggleCleared } = this.state;
    return (
    <div>

        <Header />
		{/* const actionsMemo = React.useMemo(() => <this.Export onExport={() => downloadCSV(this.state.data)} />, []); */}
        {/* <Table columns={this.columns} data={this.state.data}/> */}
		<this.Export onExport={() => downloadCSV(this.state.data)} />
        {console.log(typeof this.state.data)}
        <Container>
        <DataTable
            columns={columns}
            data={this.state.data}
            keyField="sample_key"
            selectableRows
			striped={true}
            highlightOnHover
            pagination
            contextActions={contextActions(this.deleteAll)}
            onSelectedRowsChange={this.handleChange}
            clearSelectedRows={toggleCleared}
            onRowClicked={this.handleRowClicked}
        />
        </Container>
    </div>
    );
}

addFilter() {
    var newFilterArray = this.state.filters.concat(
    <Filter
        key={this.state.filters.length + 1}
        number={this.state.filters.length + 1}
        retVals={this.getFilterValues}
    />
    );
    this.setState({ filters: newFilterArray });
}
}
export default filterandExports;