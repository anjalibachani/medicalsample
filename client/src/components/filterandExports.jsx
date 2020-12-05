import React, { Component } from 'react';
import differenceBy from 'lodash/differenceBy';
import DataTable from 'react-data-table-component';
import { Redirect } from 'react-router-dom';
import { Button, ButtonGroup, Row, Col, Container, Form } from 'react-bootstrap';
import ExpandFilterRow from './ExpandFilterRow'

import Axios from 'axios';
import styled from 'styled-components';
import Header from './Header';

import memoize from 'memoize-one';
import 'react-data-table-component-extensions/dist/index.css';
import SamplesFilter from './SamplesFilter';
//import { isThisHour } from 'date-fns';
//import { fil } from 'date-fns/locale';

// const config = require('../config/config.json')
const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');


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
    name: "location",
    selector: "location_name",
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
    selector: "aliquot_count",
    sortable: true,
  }
];

function convertArrayOfObjectsToCSV(array) {
  let result;
  if (array.length < 1) {
    return
  }
  const columnDelimiter = ',';
  const lineDelimiter = '\n';
  const keys = Object.keys(array[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;
  if (array.length > 0) {
    array.forEach(item => {
      let ctr = 0;
      keys.forEach(key => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });
  }


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
      selectedRows: [],
      toggleCleared: false,
      filterText: '',
      /* An array of filters, and another array for their returned values for processing. */
      //filters: [<Filter key={1} number={1} retVals={this.getFilterValues} />],
      //filters: [<SamplesFilter key={1} number={1} returnVals={this.getfilterValues}/>],
      filters: [<SamplesFilter key={1} number={1} returnVals={this.getFilterValues} />],
      returnedFilterValues: [],
      modal: [],
      resetPaginationToggle: false,
      showWarning: false,
      warningText: "",
    };

    this.addFilter = this.addFilter.bind(this);
    this.getFilterValues = this.getFilterValues.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.processFilter = this.processFilter.bind(this);
  }

  Export = ({ onExport }) => (
    <Button className='ml-3' variant="dark" size="lg" onClick={e => onExport(e.target.value)}>Export</Button>
  );
  ExportAll = ({ onExport }) => (
    <Button className='ml-3' variant="dark" size="lg" onClick={e => onExport(e.target.value)}>ExportAll</Button>
  );
  getFilterValues = (type, equality, value, key) => {
    this.getsampledata();
    console.log("enter get filter valiues", type, equality, value, key)
    this.setState({
      showWarning: false,
      warningText: "can't add filter, One or more filters are empty"
    })

    var filterVals = this.state.returnedFilterValues;
    console.log("filterVals", filterVals)
    if (this.state.filters.length > 1) {
      for (let i = 1; i < this.state.filters.length; i++) {
        console.log("filter values in loop :", i, " ", filterVals[i]);
        var addedfilters = this.state.filters
        if (type === filterVals[i][0]) {
          console.log("type matched")
          if (filterVals[i][1] === 'equals') {
            delete addedfilters[(this.state.filters.length) - 1]
            console.log("equality matched with equals")
            this.setState({
              showWarning: true,
              warningText: "ambigious filter, cannot add filters of same type",
              filters: addedfilters
            })
            return;
          } else if (equality === filterVals[i][1]) {
            console.log("equality matched with other")
            delete addedfilters[(this.state.filters.lenght)]
            console.log("values", equality, filterVals[i][1])
            this.setState({
              showWarning: true,
              warningText: "cannot add duplicate filters, please add unique filters",
              filters: addedfilters
            })
            return;
          }
        }
      }
    }

    filterVals[key] = [type, equality, value];

    this.setState({ returnedFilterValues: filterVals });
  };
  async clearFilters() {
    //window.location.reload(false)
    this.setState({ returnedFilterValues: [], warningText: false })
    await this.setState({ filters: [] })
    this.setState({ filters: [<SamplesFilter key={1} number={1} returnVals={this.getFilterValues} />] })
    this.getsampledata();
  }
  addFilter() {
    if (this.state.returnedFilterValues.length === this.state.filters.length + 1) {
      var newFilterArray = this.state.filters.concat(<SamplesFilter key={this.state.filters.length + 1} number={this.state.filters.length + 1} returnVals={this.getFilterValues} />);
      this.setState({ filters: newFilterArray });
    } else {
      this.setState({
        showWarning: true,
        warningText: "can't add filter, One or more filters are empty"
      })
    }

  };

  async processFilter() {
    if (!this.state.returnedFilterValues.length) {
      return
    }console.log(this.state.data)
    for (var i = 1; i <= this.state.filters.length; i++) {
      //check to see if the filter's Type and Value aren't empty
        const [field, condition, value] = this.state.returnedFilterValues[i]
        console.log("in process filter filtercals", field, condition, value);
        const valuearray = value.map(item => item.value)
        console.log("valuearray", valuearray)
        //const filteredItems = data.filter(item => item.type && item.type.toLowerCase().includes(this.state.filterText.toLowerCase()));

        //var filtereddata='';
        if (field === "ID") {
          if (condition === 'equals') {
            var filtereddata = this.state.data.filter(p => valuearray.includes(p.sample_id));
          }
          else if (condition === 'less than') {
            var filtereddata = this.state.data.filter(p => p.sample_id < valuearray[0]);
          }
          else if (condition === 'greater than') {
            var filtereddata = this.state.data.filter(p => p.sample_id > valuearray[0]);
          }
        } else if (field === "Eval") {
          if (condition === 'less than') {
            var filtereddata = this.state.data.filter(p => p.eval < valuearray[0]);
          }
          else if (condition === 'equals') {
            var filtereddata = this.state.data.filter(p => valuearray.includes(p.eval));
          }
          else if (condition === 'greater than') {
            var filtereddata = this.state.data.filter(p => p.eval > valuearray[0]);
          }
        } else if (field === "aliquots") {
          if (condition === 'less than') {
            var filtereddata = this.state.data.filter(p => p.eval < valuearray[0]);
          }
          else if (condition === 'equals') {
            var filtereddata = this.state.data.filter(p => valuearray.includes(p.aliquot_count));
          }
          else if (condition === 'greater than') {
            var filtereddata = this.state.data.filter(p => p.eval > valuearray[0]);
          }
        }
        await this.setState({data:filtereddata})
      //} 
      // catch (err) {
      //   console.log("filter failed")
      // }

      //this.setState({ data: filtereddata })
      //this.state.data.filter(item => item.field && (item.field < value))
      //console.log(this.state.data)
    }
  }

  componentDidMount() {
    this.getsampledata();
    console.log(this.state.data)
  }
  async getsampledata() {
    Axios.get(
      `http://${config.server.host}:${config.server.port}/api/filter`, {
      headers: {
        'Authorization': `bearer ${localStorage.getItem("token")}`
      }
    }
    ).then((response) => {
      //console.log(response.data);
      this.setState({
        data: response.data,
      });
    });
  }

  handleChange = state => {
    this.setState({ selectedRows: state.selectedRows });
    //console.log("selected rows",this.state.selectedRows)
  };

  handleRowClicked = row => {
    console.log(`${row.sample_id} was clicked!`);
  }

  deleteAll = () => {
    const { selectedRows } = this.state;
    const rows = selectedRows.map(r => [r.samples_key, r.location_id]);
    //console.log("rows to be deleted",rows)

    if (window.confirm(`Are you sure you want to delete samples for id: ${rows}?`)) {
      this.setState(state => ({ toggleCleared: !state.toggleCleared, data: differenceBy(state.data, state.selectedRows, 'sample_id') }));
      //console.log("selected rows in deleteall",rows)
      // Axios.delete(`http://${config.server.host}:${config.server.port}/api/deletesamples`,{rows, headers: {'Authorization': `bearer ${localStorage.getItem("token")}`}}).then((response)=>{
      Axios.post(`http://${config.server.host}:${config.server.port}/api/deletesamples`, { user_id: localStorage.getItem("user_id"), rows: rows }, { headers: { 'Authorization': `bearer ${localStorage.getItem("token")}` } }).then((response) => {
        if (response.status === 200) {
          console.log("delete successful")
        } else {
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

  resestToken = () => {
    Axios.post(`http://${config.server.host}:${config.server.port}/api/resettoken`, { user_id: localStorage.getItem("user_id") }, { headers: { 'Authorization': `bearer ${localStorage.getItem("token")}` } }).then((response) => {
      //console.log("status is :",response.status)
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem("expiresin", Date.now() + 6000000);
      } else {
        localStorage.clear();
      }

    });
  }

  render() {
    const { data, toggleCleared } = this.state;
    //const filteredItems = data.filter(item => item.type && item.type.toLowerCase().includes(this.state.filterText.toLowerCase()));
    const filteredItems = data.filter(item => item.type && JSON.stringify(item).toLowerCase().includes(this.state.filterText.toLowerCase()));
    const tableData = {
      columns,
      data,
    };
    {
      if (localStorage.getItem("user_id") != null && (localStorage.getItem("expiresin") > Date.now() + 600000))
        this.resestToken()
    }
    return (
      <div>
        {(() => {
          if (localStorage.getItem("user_id") != null && (localStorage.getItem("expiresin") > Date.now())) {
            return (<div>
              <Header />
              {/* const actionsMemo = React.useMemo(() => <this.Export onExport={() => downloadCSV(this.state.data)} />, []); */}
              {/* <Table columns={this.columns} data={this.state.data}/> */}
              {this.state.showWarning &&
                <Form.Text as={Col} className="text-danger">{this.state.warningText}</Form.Text>
              }
              {this.state.filters}
              <br />

              <Row>

                <Col align="left">
                  <ButtonGroup>
                    <Button className='ml-3' variant="dark" size="lg" onClick={this.addFilter}>Add another filter</Button>
                    <Button className='ml-3' variant="dark" size="lg" onClick={this.processFilter}>Filter</Button>
                    <Button className='ml-3' variant="dark" size="lg" onClick={this.clearFilters}>ClearFilters</Button>
                    <this.Export onExport={() => downloadCSV(this.state.selectedRows)} />
                    {/* <this.ExportAll onExport={() => downloadCSV(this.state.data)} /> */}
                    <Button className='ml-3' variant="dark" size="lg" onClick={this.deleteAll}>Delete</Button>
                  </ButtonGroup>
                </Col>
                <hr />
              </Row>
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
                  //contextActions={contextActions(this.deleteAll)}
                  onSelectedRowsChange={this.handleChange}
                  clearSelectedRows={toggleCleared}
                  onRowClicked={this.handleRowClicked}
                  defaultSortAsc={true}
                  defaultSortField="Date"
                  subHeader
                  expandableRows
                  expandableRowsComponent={<ExpandFilterRow />}
                  persistTableHead
                  subHeaderComponent={this.getSubHeaderComponent()}
                />
                {/* </DataTableExtensions> */}
              </Container>
            </div>);
          }
          else {
            localStorage.clear();
            return <Redirect to="/login" />;
          }
        })()}
      </div>
    );
  }

}
export default filterandExports;