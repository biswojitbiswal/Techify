import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Admin.css'
import { useAuth } from '../Store/Auth';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

function ProductAdd() {
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });

  const {authorization} = useAuth();

  const handleProductInput = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value
    })
  }


  const handleFile = async(e) =>{
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        setProductData({ ...productData, image: compressedFile });
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  }



  const handleProductForm = async(e) => {
    e.preventDefault();

    if(!productData.title || !productData.description || !productData.price || !productData.image){
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', productData.title);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('image', productData.image);

      const response = await fetch(`http://localhost:5000/api/yoga/admin/add`, {
        method: "POST",
        headers: {
          Authorization : authorization
        },
        body: formData
      });

      const data = await response.json();
      console.log(data);

      if(response.ok){
        toast.success("Products Added Successfully")
        setProductData({title: "", description: "", price: "", image: null});
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  

  return (
    <>
      <div className="admin-product-form">
        <h1 className='text-primary mb-4'>Add Product</h1>
        <Form onSubmit={handleProductForm}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title:</Form.Label>
            <Form.Control type="text" name='title' value={productData.title} onChange={handleProductInput} placeholder="Enter Title" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description:</Form.Label>
            <Form.Control type="text" name='description' value={productData.description} onChange={handleProductInput} placeholder="Enter Description" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price:</Form.Label>
            <Form.Control type="number" name='price' value={productData.price} onChange={handleProductInput} placeholder="Enter Price" required />
          </Form.Group>

          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Label>Image:</Form.Label>
            <Form.Control type="file" onChange={handleFile} multiple />
          </Form.Group>
          <Button variant="primary" type="submit" className='fs-5'>
            Add
          </Button>
        </Form>
      </div>
    </>
  )
}

export default ProductAdd
