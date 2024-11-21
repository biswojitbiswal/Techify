import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useStore } from '../Store/ProductStore';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Store/Auth';
import { toast } from 'react-toastify';

function ProductEdit() {
  const { productId } = useParams();
  const { products, updateProduct } = useStore();
  const { authorization } = useAuth();
  const navigate = useNavigate();

  const product = products.find((prod) => prod._id === productId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 4);
  
    setImage(newImages);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    
    const existingImages = image.filter((img) => typeof img === 'string');
    formData.append('existingImages', JSON.stringify(existingImages));

    const newImages = image.filter((img) => typeof img !== 'string');
    newImages.forEach((img) => formData.append('images', img));

    console.log('FormData entries:');
    formData.forEach((value, key) => console.log(key, value));

    try {
      const response = await fetch(`${import.meta.env.VITE_YOGA_API_URL}/api/yoga/admin/edit/${productId}`, {
        method: 'PATCH',
        headers: {
          Authorization: authorization,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        updateProduct(data.editData);
        toast.success('Product Updated');
        navigate('/product');
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('An error occurred while updating the product.');
    }
  };

  

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setDescription(product.description);
      setPrice(product.price);
      setImage(product.images || []);
    }
  }, [product]);

  return (
    <div className="admin-edit-form">
      <h1 className="text-primary mb-4">Edit Product Details</h1>
      <Form onSubmit={handleFormSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title:</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description:</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Description"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price:</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter Price"
            required
          />
        </Form.Group>

        <Form.Group controlId="formFileMultiple" className="mb-3">
          <Form.Label>Image:</Form.Label>
          <Form.Control
            type="file"
            onChange={handleImageChange}
            multiple
          />
        </Form.Group>

        {image.length > 0 && (
          <div className="image-preview m-1">
            {image.slice(0, 4).map((img, index) => (
              <img
                key={index}
                src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                alt="Preview"
                style={{ width: '100px', height: '100px', marginRight: '10px' }}
                onLoad={() => {
                  if (typeof img !== 'string') URL.revokeObjectURL(URL.createObjectURL(img));
                }}
              />
            ))}
          </div>
        )}

        <Button variant="primary" type="submit" className="fs-5 m-1">
          Update
        </Button>
      </Form>
    </div>
  );
}

export default ProductEdit;
