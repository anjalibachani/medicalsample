import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component';
import Axios from 'axios';
import Manage from './Manage';
import memoize from 'memoize-one';
import CustomAlertBanner from "./CustomAlertBanner";
import { Row, Col, ButtonGroup, Button, Container, Form } from 'react-bootstrap';

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
            alertText: 'Location saved successfully',
            alertVariant: 'success',
            location_name: '',
            formErrors: {}
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
            // console.log(response.data.results)
            this.setState({
                data: response.data.results
            });
        })
    }
    static propTypes = {
        prop: PropTypes
    }
    checkLocationExist = async (location_name) => {
        const res = await Axios.get(`http://${config.server.host}:${config.server.port}/manage/checklocation`, { params: { location_name: location_name } })
        // console.log(res.data.rows);
        if (res.data.rows === 0) {
            return false;
        }
        return true;
    }
    validateForms = async () => {
        let errorsObj = {};
        if (this.state.location_name === '') {
            errorsObj.location_name = "Please Enter Location Name"
        }
        if (await this.checkLocationExist(this.state.location_name)) {
            errorsObj.location_name = `Location Already Exists, Please enter different Location`
        }
        return errorsObj;
    }
    createJson = () => {
        let { location_name} = this.state;
        let location = {}
        location.location_name = location_name
        location['user_id'] = localStorage.getItem("user_id")
        console.log("createJson", location);
        return location
    }
    send = async () => {
        const result = this.createJson();
        console.log("result", result);
        const res = await Axios.post(`http://${config.server.host}:${config.server.port}/manage/addlocation`, result);
        if (res.status === 200) {
            console.log("Added");
            this.setState({
                alertVisibility: true,
            });
            this.setState({
                location_name: '',
            });
        }
    }
    save = async () => {
        this.setState({ formErrors: await this.validateForms() })
        console.log(this.state.formErrors);
        // console.log(Object.keys(this.state.formErrors).length);
        if (Object.keys(this.state.formErrors).length === 0) {
            console.log("No Error");
            this.send();
        }
    }

    render() {
        const { data, location_name } = this.state;
        this.getLocationData();
        return (
            <div>
                <Manage />
                <Container >
                    {this.state.alertVisibility && (
                        <CustomAlertBanner
                            variant={this.state.alertVariant}
                            text={this.state.alertText}
                        />
                    )}
                    <Form>
                        <Row>
                            <Col md="4">
                                {/* <Form.Text as={Col} className="text-danger">{this.state.formErrors.email_id}</Form.Text> */}
                                <Form.Control type="text" id="location_name" placeholder="Enter Location Name"
                                    value={location_name}
                                    onChange={e => this.setState({ location_name: e.target.value })}
                                />
                                <Form.Text as={Col} className="text-danger">{this.state.formErrors.location_name}</Form.Text>
                                {/* <Form.Text className="text-muted">Enter Email address of User to Add.</Form.Text> */}
                            </Col>
                            <Col md="3">
                                <Button variant="dark" className="ml-4" size="lg" onClick={this.save}>Add Location</Button>
                            </Col>
                        </Row>
                    </Form>
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
