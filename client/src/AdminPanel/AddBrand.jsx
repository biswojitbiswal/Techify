import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import Category from './Category';
import { BASE_URL } from '../../config';
import { useAuth } from '../Store/Auth';
import { toast } from 'react-toastify';

function AdminBrand() {
  const [brandData, setBrandData] = useState({
    name: '',
    description: '',
    category: '',
    logo: null,
  });

  const { authorization } = useAuth();

  const handleInput = (e) => {
    setBrandData({
      ...brandData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogo = (e) => {
    setBrandData({
      ...brandData,
      logo: e.target.files[0]
    })
  }

  const handleCategory = (categoryId) => {
    setBrandData({
      ...brandData,
      category: categoryId
    });
  }

  const handleBrandData = async () => {
    if (!brandData.category || brandData.category.length !== 24) {
      toast.error("Invalid Category IDs");
      return;
    }

    const formData = new FormData();
    formData.append("name", brandData.name);
    formData.append("description", brandData.description);
    formData.append("category", brandData.category);
    formData.append("logo", brandData.logo);

    try {
      const response = await fetch(`${BASE_URL}/api/techify/admin/add/brand`, {
        method: "POST",
        headers: {
          Authorization: authorization,
        },
        body: formData,
      })

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        toast.success("Brand Added Successfully");
        setBrandData({
          name: '',
          description: '',
          category: '',
          logo: null,
        })
      }
    } catch (error) {
      toast.error("Error occured while add brand", error);
      console.log(error)
    }
  }


  return (
    <section id="admin-category" style={{ minHeight: "85vh" }}>
      <div className='admin-category-form'>
        <h2 className='my-2 text-primary'>Add Brand</h2>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name='name' value={brandData.name} onChange={handleInput} placeholder="Category Name" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name='description' value={brandData.description} onChange={handleInput} required />
          </Form.Group>

          <Category handleCategory={handleCategory} selectedCategory={brandData.category} />

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Logo</Form.Label>
            <Form.Control type="file" name='logo' onChange={handleLogo} placeholder="Upload a File" />
          </Form.Group>

          <Button className='fs-4' onClick={handleBrandData}>Submit</Button>
        </Form>
      </div>
    </section>
  )
}

export default AdminBrand
