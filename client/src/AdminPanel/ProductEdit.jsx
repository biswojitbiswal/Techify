import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useStore } from '../Store/ProductStore';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Store/Auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ProductEdit() {
  const {productId} = useParams();
  const {products, updateProduct} = useStore();
  const {authorization} = useAuth();
  const navigate = useNavigate();
  

  const product = products.find((prod) => prod._id === productId)

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleFormSubmit = async(e) => {
    e.preventDefault()

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    if (image) formData.append('image', image);

    

    try {
      const response = await fetch(`http://localhost:5000/api/yoga/admin/edit/${productId}`, {
        method: "PATCH",
        headers: {
          Authorization: authorization
        },
        body: formData
      });

      const data = await response.json();
      // console.log(data.editData)

      if(response.ok){
        updateProduct(data.editData)
        toast.success("Product Updated");
        navigate("/product");
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message)
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    if(product){
      setTitle(product.title);
      setDescription(product.description);
      setPrice(product.price);
      setImage(product.image);
    }
  }, [product]);
  return (
    <>
      <div className="admin-edit-form">
        <h1 className='text-primary mb-4'>Edit Product Details</h1>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title:</Form.Label>
            <Form.Control type="text" name='title' value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Title" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description:</Form.Label>
            <Form.Control type="text" name='description' value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price:</Form.Label>
            <Form.Control type="number" name='price' value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter Price" required />
          </Form.Group>

          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Label>Image:</Form.Label>
            <Form.Control type="file" multiple onChange={(e) => setImage(e.target.files[0])} />
            <img src={image} alt={title} style={{ width: "250px", height: "150px", margin: ".5rem 0rem" }} />
          </Form.Group>
          <Button variant="primary" type="submit" className='fs-5'>
            Update
          </Button>
        </Form>
      </div>
    </>
  )
}

export default ProductEdit
