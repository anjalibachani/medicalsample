import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component';
import Axios from 'axios';
import Manage from './Manage';
import { Row, Col, ButtonGroup, Button, Container, Form } from 'react-bootstrap';
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
            paddingLeft: '8px', // override the cell padding for head cells
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
export default class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedRows: [],
            toggleCleared: false,
            alertVisibility: false,
            alertText: 'User Deleted',
            alertVariant: 'success',
            email_id: '',
            admin:false,
            formErrors: {}
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
            // console.log(response.data)
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
        user.user_id = 1
        user.password ="8879fa4ebd6b4725f5d99440d5957935f614262c"
        user.email_id = email_id
        user.admin=admin
        console.log("createJson",user);
        return user
    }
    validateForms = () => { 
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let errorsObj = {};
        if (this.state.email_id === '') {
            errorsObj.email_id = "Please Enter Email"
        }
        if ((this.state.email_id !== '' && !this.state.email_id.match(re))) {
            errorsObj.email_id = "Please Enter Valid Email Address";
        }
        console.log("errorsObj",errorsObj);
        return errorsObj;
    }
    send =  async() => {
        const result = this.createJson();
        console.log("result",result);
        const res = await Axios.post(`http://${config.server.host}:${config.server.port}/manage/adduser`, result);
    }
    save = () => {
        const { email_id, admin, formErrors} = this.state; 
        this.setState({ formErrors: this.validateForms() })
        if (Object.keys(formErrors).length === 0) {
            this.send();
        }
        console.log("Saved");
    }

    render() {
        const { data,email_id,admin } = this.state; 
        // this.getUsersData();
        // console.log(email_id, admin);
        return (
            <div>
                <Manage />
                <Container >
                    <Form>
                        <Row>
                            <Col md="4">
                                <Form.Text as={Col} className="text-danger">{this.state.formErrors.email_id}</Form.Text>
                                <Form.Control type="email" id="email_id" placeholder="Enter email"
                                    value={email_id}
                                    onChange={e => this.setState({ email_id: e.target.value })}
                                />
                            <Form.Text className="text-muted">Enter Email address of User to Add.</Form.Text>
                            </Col>
                            <Col md="1">
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
                    data={data}
                    keyField="user_id"
                    striped={true}
                    highlightOnHover
                    pointerOnHover
                    pagination
                    defaultSortField="admin"
                    defaultSortAsc={false}
                    customStyles={customStyles}
                    // selectableRows
                    // selectableRowsHighlight
                    // contextActions={contextActions(this.deleteUser)}
                    onSelectedRowsChange={this.handleChange}
                    />
                </Container>
            </div>
        )
    }
}
