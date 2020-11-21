import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component';
import Axios from 'axios';
import Manage from './Manage';
import { Row, Col, ButtonGroup, Button, Container } from 'react-bootstrap';
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
            alertVariant: 'success'
        }

    }
    componentDidMount() {
        this.getUsersData();
    }
    deleteUser = async () => {
        const { selectedRows } = this.state;
        const rows = selectedRows.map(r => [r.user_id]);
        console.log("user rows: ", rows);
        let res = await Axios.delete(`http://${config.server.host}:${config.server.port}/manage/deleteuser`, { data: rows })
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

    render() {
        const { data } = this.state; 
        // this.getUsersData();
        return (
            <div>
                <Manage />
                <Container >
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
                    selectableRows
                    selectableRowsHighlight
                    contextActions={contextActions(this.deleteUser)}
                    onSelectedRowsChange={this.handleChange}
                    />
                </Container>
            </div>
        )
    }
}
