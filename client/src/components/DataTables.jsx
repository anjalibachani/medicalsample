import React, { Component } from "react";
import ReactDOM from "react-dom";
const $ = require("jquery");
//$.DataTable = require("datatables.net");
$.DataTable= require("datatables.net-dt")


class DataTableComp extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    this.$el = $(this.el);
    this.$el.DataTable({
            dom: '<"data-table-wrapper"t>',
            data: this.props.data,
            columns: this.props.columns,
            ordering: false,
            searchable: true,
            columnDefs: [
                    {
                    targets: 0,
                    width: 180,
                    className: 'select-checkbox',
                    checkboxes: {
                        selectRow: true
                    },
                    checkboxes:true,
                    visible:true,
                    data: 0,
                    stateSave: true,
                    select: 'multi',
                'render': function (data, type, full, meta){
                    return '<input type="checkbox" name="id[]" value="' 
                        + $(`<div/>`).text(data).html() + '">';
                },}],
            order: [[ 1, 'asc' ]]
    });
    }
componentWillUnmount() {
    $(".data-table-wrapper").find("table").DataTable().destroy(true);
    }
reloadTableData = (data) => {
        const table = $('.data-table-wrapper').find('table').DataTable();
    table.clear();
    table.rows.add(data);
    table.draw();
    }
shouldComponentUpdate(nextProps, nextState){
if (nextProps.data.length !== this.props.data.length) {
        this.reloadTableData(nextProps.data);
        }
    return false;
    }
render() {
    return (
        <div>
            <table className="table table-borderless display"
                id="dataTable"
                    width="100%"
                    cellSpacing="0"
                    ref={(el) => (this.el = el)}
            />
        </div>
            );
        }
}
export default DataTableComp;