import React, { Component } from "react";
import DataTablesComp from "./DataTables";
class Table extends Component {
constructor(props) {
        super(props);
}
deleteRow = (id) => {
    const filteredData = this.state.data.filter((i) =>  i.id !== id);
    this.setState({data: filteredData});
};
render() {
    return (
        <div>
            <DataTablesComp columns={this.props.columns} data= {this.props.data} deleteRow={this.deleteRow} gotoEdit=  {this.gotoEdit} />
        </div>
        );
    }
}
export default Table;