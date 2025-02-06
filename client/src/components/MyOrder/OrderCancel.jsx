import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../config';
import { useAuth } from '../../Store/Auth';

function CancelOrderModal({ orderId, productId }) {
    const [show, setShow] = useState(false);
    const [reason, setReason] = useState("");

    const {authorization} = useAuth();

    const handleCancel = async () => {
        // console.log(productId)
        try {
            const response = await fetch(`${BASE_URL}/api/techify/order/${orderId}/${productId}/cancel`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authorization
                },
                body: JSON.stringify({ reason })
            });
            const data = await response.json()
            console.log(data);

            if (response.ok) {
                toast.success("Order canceled");
                setShow(false);
                // onCancel();
            } else {
                toast.error("Failed to cancel order");
            }
        } catch (error) {
            console.error("Error canceling order:", error);
        }
    };

    return (
        <>
            <Button className='fs-5' style={{width: "50%"}} onClick={() => setShow(true)} variant="outline-secondary">Cancel</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cancel Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Reason for cancellation</Form.Label>
                        <Form.Control as="textarea" rows="3" value={reason} onChange={(e) => setReason(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                    <Button variant="primary" onClick={handleCancel}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CancelOrderModal;
