import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function ProductEdit() {
  const [product, setProduct] = useState({});
  return (
    <>
      <div className="admin-product-form">
        <h1 className='text-primary mb-4'>Edit Product Details</h1>
        <Form>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title:</Form.Label>
            <Form.Control type="text" name='title' placeholder="Enter Title" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description:</Form.Label>
            <Form.Control type="text" name='description' placeholder="Enter Description" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price:</Form.Label>
            <Form.Control type="number" name='price' placeholder="Enter Price" required />
          </Form.Group>

          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Label>Image:</Form.Label>
            <Form.Control type="file" multiple />
          </Form.Group>
          <Button variant="primary" type="submit" className='fs-5'>
            Add
          </Button>
        </Form>
      </div>
    </>
  )
}

export default ProductEdit
