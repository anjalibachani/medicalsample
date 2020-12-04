import DataTable from 'react-data-table-component';
import React, { Component } from 'react';
import Axios from 'axios';
import Filter from './Filter';
import ExpandedComponent from './ExpandedComponent'
import memoize from 'memoize-one';
import CustomAlertBanner from "./CustomAlertBanner";
import { Button, Form, FormControl, InputGroup, Row, Col, Modal } from 'react-bootstrap';
const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');

const contextActions = memoize(deleteHandler => (
  <>
    <Button variant="dark" size="lg" onClick={deleteHandler}>Mark Received</Button>
  </>
));

const columns = [
  {
    name: "Date",
    selector: "shipment_date",
    sortable: true,
  },
  {
    name: "From",
    selector: "from_location_name",
    sortable: true
  },
  {
    name: "To",
    selector: "to_location_name",
    sortable: true,
  },
  {
    name: "Samples",
    selector: "no_of_samples",
    sortable: true,
  },
  {
    name: "Received Status",
    selector: "status_name",
    sortable: true,
  },
];
const rowSelectCritera = row => {
  return row.reached === 1;
}
class Basic2Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedRows: [],
      toggleCleared: false,
      alertVisibility: false,
      alertText: 'Shipment Marked as Received',
      alertVariant: 'success'
    }
  }
  componentDidMount() {
    this.getShipmentsData();
  }

  handleChange = state => {

    this.setState({ selectedRows: state.selectedRows });
  };
  handleRowClicked = row => {
    console.log(`${row.shipment_id} was clicked!`);
  }
  markshipments = () => {
    const { selectedRows } = this.state;
    const rows = selectedRows.map(r => [r.shipment_id, r.to_location_id, r.user_id, r.to_location_name]);
    Axios.post(`http://${config.server.host}:${config.server.port}/shipment/markshipments`, { rows: rows }, { headers: { 'Authorization': `bearer ${localStorage.getItem("token")}` } })
    this.setState(state => ({ toggleCleared: !state.toggleCleared }));
  }
  getShipmentsData = () => {
    Axios.get(`http://${config.server.host}:${config.server.port}/shipment/viewshipments`, { headers: { 'Authorization': `bearer ${localStorage.getItem("token")}` } }).then((response) => {
      console.log("response.data", response.data);
      this.setState({
        data: response.data
      });
    })
  }
  render() {
    const { data, toggleCleared } = this.state;
    this.getShipmentsData();
    return (
      <div>
        {this.state.alertVisibility && (
          <CustomAlertBanner
            variant={this.state.alertVariant}
            text={this.state.alertText}
          />
        )}
        <DataTable
          columns={columns}
          data={data}
          keyField="shipment_id"
          defaultSortField="shipment_date"
          defaultSortAsc={false}
          selectableRows
          striped={true}
          highlightOnHover
          pagination
          expandableRows
          expandOnRowClicked
          selectableRowsHighlight
          expandableRowsComponent={<ExpandedComponent />}
          contextActions={contextActions(this.markshipments)}
          onSelectedRowsChange={this.handleChange}
          selectableRowDisabled={rowSelectCritera}
          clearSelectedRows={toggleCleared}
          onRowClicked={this.handleRowClicked}
          pointerOnHover
        />
      </div>
    )
  }
};
export default Basic2Table;