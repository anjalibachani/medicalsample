import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component';
import Axios from 'axios';
import Manage from './Manage';
import memoize from 'memoize-one';
import { Row, Col, ButtonGroup, Button, Container } from 'react-bootstrap';

const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');
const contextActions = memoize(deleteHandler => (
    <>
        <Button variant="dark" size="lg" onClick={deleteHandler}>Delete</Button>
    </>
));

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
            alignContent: "center"
        },
    },
};
export default class LocationsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedRows: [],
            toggleCleared: false,
            alertVisibility: false,
            alertText: 'Location Deleted',
            alertVariant: 'success'
        }

    }
    componentDidMount() {
        this.getLocationData();
    }
    handleChange = state => {

        this.setState({ selectedRows: state.selectedRows });
    };
    deleteLocation = async() => {
        const { selectedRows } = this.state;
        const rows = selectedRows.map(r => [r.location_id]);
        console.log("location rows: ",rows);
        let res = await Axios.delete(`http://${config.server.host}:${config.server.port}/manage/deletelocation`, { rows: rows })
        console.log("res:", res.data);
        this.setState(state => ({ toggleCleared: !state.toggleCleared }));
    }
    getLocationData = () => {
        Axios.get(`http://${config.server.host}:${config.server.port}/manage/viewlocation`).then((response) => {
            console.log(response.data.results)
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
                <Container >
                    <DataTable className="block-example border border-dark rounded mb-0 w-50"
                    columns={columns}
                    data={data}
                    keyField="location_id"
                    striped={true}
                    highlightOnHover
                    pointerOnHover
                    pagination
                    // selectableRows
                    // selectableRowsHighlight
                    // contextActions={contextActions(this.deleteLocation)}
                    // onSelectedRowsChange={this.handleChange}
                    customStyles={customStyles}
                    /></Container>
            </div>
        )
    }
}
