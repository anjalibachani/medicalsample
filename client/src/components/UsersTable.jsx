import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component';
import Axios from 'axios';
import Manage from './Manage';
import styled from 'styled-components';
import { Row, Col, ButtonGroup, Button, Container, Form } from 'react-bootstrap';
import CustomAlertBanner from "./CustomAlertBanner";
import memoize from 'memoize-one';
const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');
const contextActions = memoize(deleteHandler => (
    <>
        <Button variant="dark" size="lg" onClick={deleteHandler}>Delete</Button>
    </>
));

const columns = [
    {
        name: "User ID",
        selector: "user_id",
        sortable: true
    },
    {
        name: "User Email",
        selector: "email_id",
        sortable: true
    },
    {
        name: "Admin",
        selector: "admin",
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
export default class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedRows: [],
            toggleCleared: false,
            alertVisibility: false,
            alertText: 'User saved successfully with default password: ChangeMe! ',
            alertVariant: 'success',
            email_id: '',
            admin:false,
            formErrors: {},
            filterText: ''
        }

    }
    componentDidMount() {
        this.getUsersData();
    }
    deleteUser =  async() => {
        const { selectedRows } = this.state;
        const rows = selectedRows.map(r => r.user_id);
        console.log("user rows: ", rows);
       
         let res = await Axios.delete(`http://${config.server.host}:${config.server.port}/manage/deleteuser`, { data: rows });
        console.log("res:", res.data);
        this.setState(state => ({ toggleCleared: !state.toggleCleared }));
    }
    handleChange = state => {

        this.setState({ selectedRows: state.selectedRows });
    };
    getUsersData = () => {
        Axios.get(`http://${config.server.host}:${config.server.port}/manage/viewuser`).then((response) => {
            this.setState({
                data: response.data.results
            });
        })
    }
    static propTypes = {
        prop: PropTypes
    }
    createJson = () => {
        let { email_id, admin, formErrors } = this.state; 
        admin = admin === true ? 1 : 0;
        let user = {}
        user.password ="8879fa4ebd6b4725f5d99440d5957935f614262c"
        user.email_id = email_id
        user.admin=admin
        console.log("createJson",user);
        return user
    }
    checkEmailExist = async (email_id) => {
        const res = await Axios.get(`http://${config.server.host}:${config.server.port}/manage/checkemail`, { params: { email_id: email_id} })
        if (res.data.rows === 0) {
            return false;
        }
        return true;
    }
    validateForms = async () => { 
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let errorsObj = {};
        if (this.state.email_id === '') {
            errorsObj.email_id = "Please Enter Email"
        }
        if ((this.state.email_id !== '' && !this.state.email_id.match(re))) {
            errorsObj.email_id = "Please Enter Valid Email Address";
        }
        if (await this.checkEmailExist(this.state.email_id)) {
            errorsObj.email_id = `Email Already Exists, Please enter different Email Address`
        }
        return errorsObj;
    }
    send =  async() => {
        const result = this.createJson();
        console.log("result",result);
        const res = await Axios.post(`http://${config.server.host}:${config.server.port}/manage/adduser`, result);
        if (res.status === 200) {
            console.log("Added");
            this.setState({
                alertVisibility: true,
            });
            this.setState({
                email_id: '',
            });
        }
    }
    save = async() => { 
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
                            item.email_id &&
                                item.email_id.toLowerCase().includes(newFilterText.toLowerCase())
                        }                    );
                    this.setState({ filterText: newFilterText });
                }}
                onClear={this.handleClear}
                filterText={this.state.filterText}
            />
        );
    };
    render() {
        const { data,email_id,admin } = this.state; 
        this.getUsersData();
        const filteredItems = data.filter(item => item.email_id && JSON.stringify(item).toLowerCase().includes(this.state.filterText.toLowerCase()));
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
                                <Form.Control type="email" id="email_id" placeholder="Enter email"
                                    value={email_id}
                                    onChange={e => this.setState({ email_id: e.target.value })}
                                />
                                <Form.Text as={Col} className="text-danger">{this.state.formErrors.email_id}</Form.Text>
                            </Col>
                            <Col md="1" className="mt-2">
                                <Form.Check type="checkbox" id="admin" label="Admin?"
                                checked={admin}
                                    onChange={e => this.setState({ admin: e.target.checked })}
                                />
                            </Col>
                            <Col md="2">
                                <Button variant="dark" className="ml-4" size="lg" onClick={this.save}>Add User</Button>
                            </Col>
                        </Row>
                    </Form>
                    <DataTable className="block-example border border-dark rounded mb-0"
                    columns={columns}
                        data={filteredItems}
                    keyField="user_id"
                    striped={true}
                    highlightOnHover
                    pointerOnHover
                    pagination
                    defaultSortField="admin"
                    defaultSortAsc={false}
                    customStyles={customStyles}
                        onSelectedRowsChange={this.handleChange}
                        subHeader
                        persistTableHead
                        subHeaderComponent={this.getSubHeaderComponent()}
                    />
                </Container>
            </div>
        )
    }
}
