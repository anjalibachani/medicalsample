import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component';
import Axios from 'axios';
import Manage from './Manage';
import { Row, Col, ButtonGroup, Button, Container } from 'react-bootstrap';
import memoize from 'memoize-one';

const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');

const columns = [
    {
        name: "User",
        selector: "email_id",
        sortable: true
    },
    {
        name: "Timestamp",
        selector: "timestamp",
        sortable: true
    },
    {
        name: "Description",
        selector: "desciption",
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
function convertArrayOfObjectsToCSV(array) {
    let result;
    // console.log("array", array)
    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(array[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach(item => {
        let ctr = 0;
        keys.forEach(key => {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];

            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function downloadCSV(array) {
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = 'logs_export.csv';
    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
}
export default class LogsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }

    }
    componentDidMount() {
        const access_token = localStorage.getItem("token")
        Axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        this.getLogsData();
    }
    ExportAll = ({ onExport }) => (
        <Button className='ml-3' variant="dark" size="lg" onClick={e => onExport(e.target.value)}>Export to CSV</Button>
    );
    getLogsData = () => {
        Axios.get(`http://${config.server.host}:${config.server.port}/manage/viewlogs`).then((response) => {
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
        return (
            <div>
                <Manage />
                <Container >
                    <this.ExportAll onExport={() => downloadCSV(this.state.data)} />
                    <DataTable className="block-example border border-dark rounded mb-0"
                        columns={columns}
                        data={data}
                        keyField="transaction_id"
                        striped={true}
                        pagination
                        pointerOnHover
                        highlightOnHover
                        defaultSortField="timestamp"
                        defaultSortAsc={false}
                        customStyles={customStyles}
                        paginationPerPage="25"
                    /></Container>
            </div>
        )
    }
}
