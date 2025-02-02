import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { toast } from 'react-toastify'
import { BASE_URL } from '../../config'
import { useAuth } from '../Store/Auth'


function AdminCategory() {
    const [category, setCategory] = useState({
        name: '',
        description: '',
        image: null,
    })

    const {authorization} = useAuth();

    const handleCategory = (e) => {
        setCategory({
            ...category,
            [e.target.name]: e.target.value
        })
    }

    const handleImage = (e) => {
        setCategory({...category, image: e.target.files[0]})
    }

    const handleFormData = async() => {
        const formData = new FormData()
        formData.append("name", category.name);
        formData.append("description", category.description)
        formData.append("image", category.image)
        try {
            const response = await fetch(`${BASE_URL}/api/techify/admin/add/category`, {
                method: "POST",
                headers: {
                    Authorization: authorization
                },
                body: formData,
            })
            const data = await response.json();
            console.log(data);

            if(response.ok){
                toast.success("Category Added Successfully");
                setCategory({
                    name: '',
                    description: '',
                    image: '',
                })
            } else {
                toast.error(data.message || "An error occurred");
            }
        } catch (error) {
            toast.error("An Error Occured While Add Category")
        }
    }

    return (
        <section id="admin-category" style={{minHeight: "85vh"}}>
            <div className='admin-category-form'>
            <h2 className='my-2 text-primary'>Add Category</h2>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name='name' value={category.name} onChange={handleCategory} placeholder="Category Name" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} name='description' value={category.description} onChange={handleCategory} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" name='image' onChange={handleImage} placeholder="Upload a File" />
                </Form.Group>
                <Button className='fs-4' onClick={handleFormData}>Submit</Button>
            </Form>
        </div>
        </section>
        
    )
}

export default AdminCategory
