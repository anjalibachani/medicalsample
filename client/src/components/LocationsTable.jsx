import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component';
import Axios from 'axios';


const config = process.env.REACT_APP_MED_DEPLOY_ENV === 'deployment' ? require('../config/deploy_config.json') : require('../config/local_config.json');
const columns = [
    {
        name: "Location Name",
        selector: "location_name",
    }
];

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
                <DataTable
                    columns={columns}
                    data={data}
                    keyField="location_id"
                    striped={true}
                    highlightOnHover
                />
            </div>
        )
    }
}
