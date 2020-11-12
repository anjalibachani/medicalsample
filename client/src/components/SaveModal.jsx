import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { formatISO } from "date-fns";

function SaveModal(props) {
    const { data, handleClose,show } = props;
    // console.log("data: ", data);
    return (
        <>
            <Modal size="lg" show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit or Save</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        Object.keys(data).filter((i, k) => k > 0).map((key) => {
                            let res = data[key].toString();
                            if (res === 'true') {
                                res = "Yes"
                            }
                            if (res === 'false') {
                                res = "No"
                            }
                            if (key === "Date")
                                // res = res.toISOString().split('T')[0];
                                res = formatISO(data[key], { representation: 'date' })
                            return (
                                <>
                                    <Row>
                                        <Col md="4">{key}</Col>:
                                        <Col>{res}</Col>
                                    </Row>
                                </>
                            )
                        })

                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-dark" size="lg" onClick={handleClose}>Edit</Button>
                    <Button variant="outline-dark" size="lg">Save and add another</Button>
                    <Button variant="primary" size="lg" > Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

SaveModal.propTypes = {

}

export default SaveModal;

