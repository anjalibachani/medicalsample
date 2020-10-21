import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { Modal,Button } from 'react-bootstrap';

function SaveModal(props) {
    const { data, handleClose } = props;
    console.log("data: ", data);
    return (
        <>
          <Modal show={data.show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Edit or Save</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    {
                        Object.keys(data).filter((i,k) => k >0).map((key) => {
                            console.log(key + ":" + data[key]);
                            let res = data[key];
                            if (key == "Date")
                                res = data[key].toISOString().split('T')[0];
                            return (
                                <p>
                                    <p>{key}:{res}</p>
                                </p>
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

