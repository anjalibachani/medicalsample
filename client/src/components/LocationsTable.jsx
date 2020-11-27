import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component';
import Axios from 'axios';
import Manage from './Manage';
import memoize from 'memoize-one';
import CustomAlertBanner from "./CustomAlertBanner";
import { Row, Col, ButtonGroup, Button, Container, Form } from 'react-bootstrap';
import styled from 'styled-components';
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
            paddingLeft: '8px', 
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
        <TextField id="search" type="text" placeholder="Search" aria-label="Search Input" value={filterText} onChange={onFilter} />
        <ClearButton type="button" onClick={onClear}>X</ClearButton>
    </>
);
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
            formErrors: {},
            filterText: ''
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
        if (Object.keys(this.state.formErrors).length === 0) {
            console.log("No Error");
            this.send();
        }
    }
    getSubHeaderComponent = () => {
        return (
            <FilterComponent
                onFilter={(e) => {
                    let newFilterText = e.target.value;
                    this.filteredItems = this.state.data.filter(
                        (item) => {
                            item.location_name &&
                                item.location_name.toLowerCase().includes(newFilterText.toLowerCase())                            
                        }
                    );
                    this.setState({ filterText: newFilterText });
                }}
                onClear={this.handleClear}
                filterText={this.state.filterText}
            />
        );
    };
    render() {
        const { data, location_name } = this.state;
        this.getLocationData();
        const filteredItems = data.filter(item => item.location_name && JSON.stringify(item).toLowerCase().includes(this.state.filterText.toLowerCase()));
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
                                <Form.Control type="text" id="location_name" placeholder="Enter Location Name"
                                    value={location_name}
                                    onChange={e => this.setState({ location_name: e.target.value })}
                                />
                                <Form.Text as={Col} className="text-danger">{this.state.formErrors.location_name}</Form.Text>
                            </Col>
                            <Col md="3">
                                <Button variant="dark" className="ml-4" size="lg" onClick={this.save}>Add Location</Button>
                            </Col>
                        </Row>
                    </Form>
                    <DataTable className="block-example border border-dark rounded mb-0 w-50"
                    columns={columns}
                        data={filteredItems}
                    keyField="location_id"
                    striped={true}
                    highlightOnHover
                    pointerOnHover
                    pagination
                        customStyles={customStyles}
                        subHeader
                        persistTableHead
                        subHeaderComponent={this.getSubHeaderComponent()}
                    /></Container>
            </div>
        )
    }
}
