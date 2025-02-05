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
    categories: [],
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
    setBrandData((prevData) => {
      const isSelected = prevData.categories.includes(categoryId);

      return {
        ...prevData,
        categories: isSelected ? prevData.categories.filter(id => id !== categoryId) : [...prevData.categories, categoryId]
      }
    });
  }

  const handleBrandData = async () => {
    if (brandData.categories.length === 0) {
      toast.error("Please select at least one category.");
      return;
    }
    // console.log(brandData)

    const formData = new FormData();
    formData.append("name", brandData.name);
    formData.append("description", brandData.description);
    brandData.categories.forEach((category) => {
      formData.append("categories[]", category);
    })
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
          categories: [],
          logo: null,
        });
        document.getElementById('logoInput').value = '';
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
            <Form.Control type="text" name='name' value={brandData.name} onChange={handleInput} placeholder="Brand Name" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name='description' value={brandData.description} onChange={handleInput} required />
          </Form.Group>

          <Category handleCategory={handleCategory} selectedCategory={brandData.categories} />

          <Form.Group className="mb-3">
            <Form.Label htmlFor='logoInput'>Logo</Form.Label>
            <Form.Control type="file" id="logoInput" name='logo' onChange={handleLogo} placeholder="Upload a File" />
          </Form.Group>

          <Button className='fs-4' onClick={handleBrandData}>Submit</Button>
        </Form>
      </div>
    </section>
  )
}

export default AdminBrand
