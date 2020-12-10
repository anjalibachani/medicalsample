import React from 'react';
import { Button, Form, FormControl, InputGroup, Row, Col, Modal, Table } from 'react-bootstrap';

export default ({ data }) => {
    return (
        <Row>
            <Col>
                <Table striped bordered hover size="sm" variant="secondary">
                    <thead>
                        <tr>
                            <th >bht</th>
                            <th>density</th>
                            <th>hb</th>
                            <th>pb</th>
                            <th>edta</th>
                            <th>heparin</th>
                            <th>mpa</th>
                            <th>fasted</th>
                            <th>foilWrapped</th>
                            <th>storage conditions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{data.bht}</td>
                            <td>{data.density}</td>
                            <td>{data.hb}</td>
                            <td>{data.pb}</td>
                            <td>{data.edta}</td>
                            <td>{data.heparin}</td>
                            <td>{data.mpa}</td>
                            <td>{data.fasted}</td>
                            <td>{data.foil_wrapped}</td>
                            <td>{data.initial_storage_conditions}</td>
                        </tr>
                    </tbody>
                </Table>
            </Col>


        </Row>
    )
}