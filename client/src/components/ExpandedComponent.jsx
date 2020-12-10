import React, { Component } from 'react';
import { Button, Form, FormControl, InputGroup, Row, Col, Modal, Table } from 'react-bootstrap';
import Axios from 'axios';
import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component';

const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');

const movedshipementscolumns = [
    {
        name: 'ID',
        selector: 'sample_id',
        sortable: true,
    },
    {
        name: 'Eval',
        selector: 'eval',
        sortable: true,
        right: true,
    },
    {
        name: 'Type',
        selector: 'type',
        sortable: true,
        right: true,
    },
    {
        name: 'Aliquots',
        selector: 'aliquot_count',
        sortable: true,
        right: true,
    },
];

const customStyles = {
    headCells: {
        style: {
            fontSize: '100%',
            fontWeight: "bold",
            paddingLeft: '8px',
            paddingRight: '8px',
        },
    },
    rows: {
        style: {
            fontSize: '100%',
            fontWeight: "bold",
        },
    },
};
export default class ExpandedComponent extends Component {

    constructor(props) {

        super(props);
        this.state = {
            ShipmentsData: [],
        }
    }
    static propTypes = {
        prop: PropTypes
    }
    componentDidMount() {
        let data = this.props.data;
        let shipment_id = data.shipment_id
        this.getShipmentsData(shipment_id);
    }

    getShipmentsData = (shipment_id) => {
        console.log(shipment_id);
        Axios.get(`http://${config.server.host}:${config.server.port}/shipment/shipmentdetails`, { params: { shipment_id: shipment_id } }).then((response) => {
            console.log("shipement details", response.data);
            this.setState({
                ShipmentsData: response.data
            });
        })
    }
    render() {
        const { ShipmentsData } = this.state
        console.log("ShipmentsData", this.state.ShipmentsData);
        return (
            <div className="ml-5 mr-5">
                <DataTable className="block-example border border-dark rounded mb-0"
                    columns={movedshipementscolumns}
                    data={ShipmentsData}
                    keyField="shipment_id"
                    striped={true}
                    highlightOnHover
                />
                <br />
                <br />
            </div>
        )
    }
}
