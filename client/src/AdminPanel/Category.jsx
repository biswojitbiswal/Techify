import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';
import { useAuth } from '../Store/Auth';
import { Form } from 'react-bootstrap';

function Category({handleCategory, selectedCategory}) {
    const [categories, setCategories] = useState([]);

    const { authorization } = useAuth();

    const fetchAllCategory = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/techify/admin/category?fields=minimal`, {
                method: "GET",
                headers: {
                    Authorization: authorization,
                }
            })

            const data = await response.json();
            // console.log(data);

            if (response.ok) {
                setCategories(data.categories);
            }
        } catch (error) {
            toast.error("Error fetching categories:", error);
            console.error("Error fetching categories:", error);
        }
    }

    useEffect(() => {
        fetchAllCategory()
    }, [])
    return (
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Category</Form.Label>
            <Form.Select aria-label="Default select example" value={selectedCategory} onChange={(e) => handleCategory(e.target.value)}>
                <option>Select Category</option>
                {
                    categories?.map((category) => {
                        return <option key={category._id} value={category._id}>{category.name.charAt(0).toUpperCase() + category.name.substring(1)}</option>
                    })
                }
                
            </Form.Select>
        </Form.Group>

    )
}

export default Category
