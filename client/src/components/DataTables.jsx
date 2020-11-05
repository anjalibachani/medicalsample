import React, { Component } from "react";
import DataTable, { createTheme } from 'react-data-table-component';
import ReactDOM from "react-dom";
const $ = require("jquery");

//$.DataTable = require("datatables.net");
//$.DataTable= require("datatables.net-dt")


class DataTableComp extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }
// componentWillUnmount() {
//     $(".data-table-wrapper").find("table").DataTable().destroy(true);
//     }
// reloadTableData = (data) => {
//         const table = $('.data-table-wrapper').find('table').DataTable();
//     table.clear();
//     table.rows.add(data);
//     table.draw();
//     }
// shouldComponentUpdate(nextProps, nextState){
// if (nextProps.data.length !== this.props.data.length) {
//         this.reloadTableData(nextProps.data);
//         }
//     return false;
//     }
    render() {
        return (
            <DataTable
            title="Arnold Movies"
            columns={this.props.columns}
            data={this.props.data}
            selectableRows
            />
        )
    }
}
export default DataTableComp;