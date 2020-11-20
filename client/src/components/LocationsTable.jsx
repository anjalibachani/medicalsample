import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component';
import Axios from 'axios';
import Manage from './Manage';
import { Row, Col, ButtonGroup, Button, Container } from 'react-bootstrap';

const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');
const columns = [
    {
        name: "Location Name",
        selector: "location_name",
        sortable: true
    }
];
const customStyles = {
    headCells: {
        style: {
            fontSize: '100%',
            fontWeight: "bold",
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
        },
    },
    rows: {
        style: {
            fontSize: '100%',
            fontWeight: "bold",
            textAlign:'justify'
        },
    },
};
export default class LocationsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }

    }
    componentDidMount() {
        this.getUsersData();
    }
    getUsersData = () => {
        Axios.get(`http://${config.server.host}:${config.server.port}/manage/viewlocation`).then((response) => {
            // console.log(response.data.results)
            this.setState({
                data: response.data.results
            });
        })
    }
    static propTypes = {
        prop: PropTypes
    }

    render() {
        const { data } = this.state;
        // this.getUsersData();
        return (
            <div>
                <Manage />
                <Container>
                    <DataTable className="block-example border border-dark rounded mb-0"
                    columns={columns}
                    data={data}
                    keyField="location_id"
                    striped={true}
                    highlightOnHover
                    pointerOnHover
                        pagination
                        customStyles={customStyles}
                    /></Container>
            </div>
        )
    }
}
