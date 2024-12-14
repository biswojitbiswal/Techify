import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Admin.css';
import { useAuth } from '../Store/Auth';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import {Navigate} from 'react-router-dom';
import { BASE_URL } from '../../config.js';

function ProductAdd() {
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    images: [],
  });

  const { user, authorization, darkMode, isLoading } = useAuth();

  if(isLoading){
    return <Spinner animation="border" />;
  }

  if(!user || user.role !== 'Admin'){
    return <Navigate to='/' replace />
  }

  const handleProductInput = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = async (e) => {
    const files = Array.from(e.target.files);
    const validExtensions = ["image/jpeg", "image/png", "image/jpg"];

    const validFiles = files.filter((file) => validExtensions.includes(file.type));
    if (validFiles.length !== files.length) {
      toast.error("Only JPEG, PNG, and JPG files are allowed.");
      return;
    }

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFiles = await Promise.all(
        validFiles.map(async (file) => {
          const compressedBlob = await imageCompression(file, options);
          return new File([compressedBlob], file.name, { type: file.type });
        })
      );

      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, ...compressedFiles],
      }));
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };

  const handleProductForm = async (e) => {
    e.preventDefault();

    if (!productData.title || !productData.description || !productData.price || productData.images.length === 0) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!authorization) {
      toast.error("You are not authorized. Please log in again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', productData.title);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      productData.images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await fetch(`${BASE_URL}/api/yoga/admin/add`, {
        method: "POST",
        headers: {
          Authorization: authorization,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success("Products Added Successfully");
        setProductData({ title: "", description: "", price: "", images: [] });
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while adding the product.");
    }
  };

  return (
    <div className="admin-product-form" style={{backgroundColor: darkMode ? '#343434' : ''}}>
      <h1 className='text-primary mb-4'>Add Product</h1>
      <Form onSubmit={handleProductForm}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label  className={`${darkMode ? 'text-white' : 'text-black'}`}>Title:</Form.Label>
          <Form.Control type="text" name='title' value={productData.title} onChange={handleProductInput} placeholder="Enter Title" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Description:</Form.Label>
          <Form.Control type="text" name='description' value={productData.description} onChange={handleProductInput} placeholder="Enter Description" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="price">
          <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Price:</Form.Label>
          <Form.Control type="number" name='price' value={productData.price} onChange={handleProductInput} placeholder="Enter Price" required />
        </Form.Group>
        <Form.Group controlId="formFileMultiple" className="mb-3">
          <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Images:</Form.Label>
          <Form.Control type="file" onChange={handleFile} multiple />
        </Form.Group>
        <div className="image-preview">
          {productData.images.map((image, index) => (
            <img key={index} src={URL.createObjectURL(image)} alt="Preview" style={{ width: 100, height: 100, marginRight: 10 }} />
          ))}
        </div>
        <Button variant="primary" type="submit" className='fs-5'>
          Add
        </Button>
      </Form>
    </div>
  );
}

export default ProductAdd;
