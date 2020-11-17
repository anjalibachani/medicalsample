import React, { Component,useState } from 'react';
import differenceBy from 'lodash/differenceBy';
import DataTable, { createTheme } from 'react-data-table-component';
import { Redirect } from 'react-router-dom';
import { Button, ButtonGroup, Form, Row, Col, InputGroup, FormControl, Modal, Container } from 'react-bootstrap';

//import CustomTable from './CustomTable';
import CustomAlertBanner from './CustomAlertBanner';

import Axios from 'axios';
import Filter from './Filter';
import styled from 'styled-components';
import DatePicker from 'react-datepicker'
import Header from './Header';

import memoize from 'memoize-one';
//import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { isThisHour } from 'date-fns';
import { fil } from 'date-fns/locale';
//import { Export } from 'react-data-table-component-extensions/dist/ui';
const config = require('../config/config.json')

const columns = [
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
console.log("array", array)
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

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled(Button)`
  color: white;
  background: black;
  size="lg";
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const FilterComponent = ({ filterText, onFilter, onClear }) => (
  
  <>
    <TextField id="search" type="text" placeholder="Filter" aria-label="Search Input" value={filterText} onChange={onFilter} />
    <ClearButton type="button" onClick={onClear}>X</ClearButton>
    {console.log("filterCOmponent called")}
  </>
);

const contextActions = memoize(deleteHandler => (
  <>
    <Button variant="dark" size="lg" onClick={deleteHandler}>Delete</Button>
    </>
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
    filterText: '',
      /* An array of filters, and another array for their returned values for processing. */
    filters: [<Filter key={1} number={1} retVals={this.getFilterValues} />],
    returnedFilterValues: [],
    modal: [],
    resetPaginationToggle: false,
    };

    this.addFilter = this.addFilter.bind(this);
    this.getFilterValues = this.getFilterValues.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.processFilter = this.processFilter.bind(this);
  }

Export = ({ onExport }) => (
	<Button className= 'ml-3' variant="dark" size="lg" onClick={e => onExport(e.target.value)}>Export</Button>
);
ExportAll = ({ onExport }) => (
	<Button className= 'ml-3' variant="dark" size="lg" onClick={e => onExport(e.target.value)}>ExportAll</Button>
);
getFilterValues = (type, equality, value, key) => {
  var filterVals = this.state.returnedFilterValues;

  if (type === "Date") {
    value = this.getDateFormat(value);
  }

  filterVals[key] = [type, equality, value];

  this.setState({ returnedFilterValues: filterVals });
};
clearFilters(){
  this.setState({filters:[<Filter key={1} number={1} retVals={this.getFilterValues} />]})
  this.getsampledata();
}
addFilter() {
  console.log("add filter called")
  var newFilterArray = this.state.filters.concat(<Filter key={this.state.filters.length + 1} number={this.state.filters.length + 1} retVals={this.getFilterValues} />);
  this.setState({ filters: newFilterArray });
  console.log(`filters lenght is ${this.state.filters.length}`)
  console.log(this.state.filters)
};

processFilter(){
  for (var i = 1; i <= this.state.filters.length; i++) {

    if (i !== 1) {
      console.log("filters exists")

    //check to see if the filter's Type and Value aren't empty
    console.log(this.state.returnedFilterValues[i])
    let field = this.state.returnedFilterValues[i][0]
    
    let condition = this.state.returnedFilterValues[i][1]
    let value = this.state.returnedFilterValues[i][2]
    console.log(field,condition,value)
    console.log("sdhs")
    console.log("logging filed values ",this.state.data[0].field)
    console.log("logging filed values ",this.state.data[0].sample_id)
    //const filteredItems = data.filter(item => item.type && item.type.toLowerCase().includes(this.state.filterText.toLowerCase()));
    try{
      if(field === "ID"){
        if(condition === '<')
        var filteredFriends = this.state.data.filter( p => p.sample_id < value );
        else if(condition === '===')
        var filteredFriends = this.state.data.filter( p => p.sample_id == value );
        else if(condition === '>')
        var filteredFriends = this.state.data.filter( p => p.sample_id > value );
      }else if(field === "Eval"){
        if(condition === '<')
        var filteredFriends = this.state.data.filter( p => p.eval < value );
        else if(condition === '===')
        var filteredFriends = this.state.data.filter( p => p.eval == value );
        else if(condition === '>')
        var filteredFriends = this.state.data.filter( p => p.eval > value );
      }else if(field === "aliquots"){
        if(condition === '<')
        var filteredFriends = this.state.data.filter( p => p.eval < value );
        else if(condition === '===')
        var filteredFriends = this.state.data.filter( p => p.eval == value );
        else if(condition === '>')
        var filteredFriends = this.state.data.filter( p => p.eval > value );
      }
    }catch(err){
      console.log("filter failed")
    }
    
    this.setState({data:filteredFriends})
    console.log(filteredFriends)
    this.state.data.filter(item => item.field && (item.field < value))
    console.log(this.state.data)
  }
  }
}

componentDidMount() {
    this.getsampledata();
    console.log(this.state.data)
}
getsampledata(){
    Axios.get(
		`http://${config.server.host}:${config.server.port}/api/filter`,{headers: {
      'Authorization': `bearer ${localStorage.getItem("token")}` 
    }}
    ).then((response) => {
    console.log(response.data);
    this.setState({
        data: response.data,
	});
    });
}

handleChange = state => {
    this.setState({ selectedRows: state.selectedRows });
    console.log("selected rows",this.state.selectedRows)
};

handleRowClicked = row => {
    console.log(`${row.sample_id} was clicked!`);
}

deleteAll = () => {
    const { selectedRows } = this.state;
    const rows = selectedRows.map(r => r.samples_key);
    console.log("rows to be deleted",rows)

    if (window.confirm(`Are you sure you want to delete:\r ${rows}?`)) {
        this.setState(state => ({ toggleCleared: !state.toggleCleared, data: differenceBy(state.data, state.selectedRows, 'samples_key') }));
        console.log("selected rows in deleteall",rows)
        Axios.delete(`http://${config.server.host}:${config.server.port}/api/deletesamples`,{rows, headers: {'Authorization': `bearer ${localStorage.getItem("token")}`}}).then((response)=>{
        // Axios.delete(`http://${config.server.host}:${config.server.port}/api/deletesamples`,{payload: payload, data:{user_id:localStorage.getItem("user_id"), rows:rows}}).then((response)=>{
          if(response.status === 200){
            console.log("delete successful")
          }else{
            console.log("couldnt delete the rows")
          }
        })
    }

}

handleClear = () => {
  const { resetPaginationToggle, filterText } = this.state;

  if (this.state.filterText) {
    this.setState({
      resetPaginationToggle: !resetPaginationToggle,
      filterText: ""
    });
  }
};

getSubHeaderComponent = () => {
  return (
    <FilterComponent
      onFilter={(e) => {
        let newFilterText = e.target.value;
        this.filteredItems = this.state.data.filter(
          (item) =>
            item.type &&
            item.type.toLowerCase().includes(newFilterText.toLowerCase())
        );
        this.setState({ filterText: newFilterText });
      }}
      onClear={this.handleClear}
      filterText={this.state.filterText}
    />
  );
};
render() {
    const { data, toggleCleared } = this.state;
    //const filteredItems = data.filter(item => item.type && item.type.toLowerCase().includes(this.state.filterText.toLowerCase()));
    const filteredItems =  data.filter(item => item.type && JSON.stringify(item).toLowerCase().includes(this.state.filterText.toLowerCase()));
    const tableData = {
      columns,
      data,
    };
    return (
      <div>
      {(() => {
        if (localStorage.getItem("user_id") != null) {
          return(<div>
            <Header />
		    {/* const actionsMemo = React.useMemo(() => <this.Export onExport={() => downloadCSV(this.state.data)} />, []); */}
        {/* <Table columns={this.columns} data={this.state.data}/> */}
        {this.state.filters}
        <Row>
						<Col align="left">
							<ButtonGroup>
								<Button className= 'ml-3' variant="dark" size="lg" onClick={this.addFilter}>Add another filter</Button>
								<Button className= 'ml-3' variant="dark" size="lg" onClick={this.processFilter}>Filter</Button>
								<Button className= 'ml-3' variant="dark" size="lg" onClick={this.clearFilters}>ClearFilters</Button>
                <this.Export onExport={() => downloadCSV(this.state.selectedRows)} />
                <this.ExportAll onExport={() => downloadCSV(this.state.data)} />
							</ButtonGroup>
						</Col>
						<hr />
					</Row>
        
        {console.log(typeof this.state.data)}
        <Container>
        {/* <DataTableExtensions
      {...tableData}
      filterHidden={false}
    > */}
        <DataTable 
            columns={columns}
            data={filteredItems}
            keyField="sample_key"
            selectableRows
            striped={true}
            highlightOnHover
            pagination
            paginationResetDefaultPage={this.state.resetPaginationToggle} 
            contextActions={contextActions(this.deleteAll)}
            onSelectedRowsChange={this.handleChange}
            clearSelectedRows={toggleCleared}
            onRowClicked={this.handleRowClicked}
            defaultSortAsc={true}
            defaultSortField = "Date"
            subHeader
            persistTableHead
            subHeaderComponent={this.getSubHeaderComponent()}
        />
        {/* </DataTableExtensions> */}
        </Container>
          </div>);
          }
          else {
            return <Redirect to="/Home" />;
          }
        })()}

    
        
    </div>
    );
}


}
export default filterandExports;