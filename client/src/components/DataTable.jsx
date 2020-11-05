import DataTable from 'react-data-table-component';
import React, { Component } from 'react';
//const data = [{"sample_id":557,"eval":1,"type":"illo","aliquots":1,"date":"2001-08-18"},{"sample_id":613,"eval":6,"type":"nesciunt","aliquots":3,"date":"2018-11-18"},{"sample_id":661,"eval":7,"type":"exercitationem","aliquots":0,"date":"2003-09-09"},{"sample_id":575,"eval":0,"type":"maxime","aliquots":6,"date":"1982-03-01"},{"sample_id":649,"eval":7,"type":"quos","aliquots":6,"date":"2011-06-05"},{"sample_id":578,"eval":2,"type":"est","aliquots":4,"date":"1976-08-25"},{"sample_id":543,"eval":6,"type":"expedita","aliquots":0,"date":"2020-01-30"},{"sample_id":615,"eval":8,"type":"et","aliquots":6,"date":"1990-06-19"},{"sample_id":767,"eval":5,"type":"est","aliquots":8,"date":"1990-02-21"},{"sample_id":773,"eval":9,"type":"ea","aliquots":1,"date":"2010-07-30"}]

const columns = [
  {
    name: 'ID',
    selector: 'sample_id',
    sortable: true,
  },
  {
    name: 'Eval',
    selector: 'eval',
    sortable: true,
    right: true,
  },
  {
    name: 'Date',
    selector: 'date',
    sortable: true,
    right: true,
  },
  {
    name: 'Type',
    selector: 'type',
    sortable: true,
    right: true,
  },
  {
    name: 'Aliquots',
    selector: 'aliquots',
    sortable: true,
    right: true,
  },
];
 

const handleChange = (state) => {
  // You can use setState or dispatch with something like Redux so we can use the retrieved data
  console.log('Selected Rows: ', state.selectedRows);
};

class MyComponent extends Component {
  render() {
    return (
      <DataTable
        title=""
        columns={columns}
        data={this.props.data}
        selectableRows // add for checkbox selection
        Clicked
        Selected={handleChange}

      />
    )
  }
};
export default MyComponent;

// class DataTable extends Component {
//     render({
//         return(
//             <DataTable
//         )
//     })
// }