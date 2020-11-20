import React from 'react';
import { Button, Form, FormControl, InputGroup, Row, Col, Modal,Table } from 'react-bootstrap';
// eslint-disable-next-line react/prop-types
export default ({ data }) => 
{
    return (
        <Row>
            <Col>
                {/* ID: {data.shipment_id}
                Received Status: {data.reached}
                Shipping Company: {data.shipping_company}
                From: {data.location_name}
                To: {data.location_name}
                Shipping Date: {data.shipping_date}
                Shipping Condition: {data.shipment_condition}
                Number of Samples: {data.no_of_samples}
                Notes: {data.notes}
                User ID: {data.user_id} */
                }
                <Table striped bordered hover size="sm" variant="dark">
                    <thead>
                        <tr>
                            <th>Shipment ID</th>
                            <th>Received Status</th>
                            <th>Shipping Company</th>
                            <th>From Location</th>
                            <th>To Location</th>
                            <th>Shipping Date</th>
                            <th>Shipping Conditions</th>
                            <th>Number of Samples</th>
                            <th>Notes</th>
                            <th>Created By</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{data.shipment_id}</td>
                            <td>{data.status_name}</td>
                            <td>{data.shipping_company}</td>
                            <td>{data.location_name}</td>

                            <td>{data.location_name}</td>
                            <td>{data.shipping_date}</td>
                            <td>{data.shipment_condition}</td>
                            <td>{data.no_of_samples}</td>
                            <td>{data.notes}</td>
                            <td>{data.email_id}</td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
        
       
        </Row>
    )
}