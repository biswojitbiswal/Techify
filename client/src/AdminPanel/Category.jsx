import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';
import { Form, Dropdown } from 'react-bootstrap';

function Category({handleCategory, selectedCategory}) {
    const [categories, setCategories] = useState([]);


    const fetchAllCategory = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/techify/category/get-all?fields=minimal`, {
                method: "GET",
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
        <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>

        {/* Bootstrap Dropdown */}
        <Dropdown className="w-100">
            <Dropdown.Toggle variant="light" className="w-100 text-start">
                Select Categories
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto', padding: '0rem 1rem', width: '100%' }}>
                {categories.map((category) => (
                    <Form.Check
                        key={category._id}
                        type="checkbox"
                        label={category.name.charAt(0).toUpperCase() + category.name.substring(1)}
                        value={category._id}
                        checked={selectedCategory.includes(category._id)}
                        onChange={() => handleCategory(category._id)}
                        className="dropdown-item text-primary"
                    />
                ))}
            </Dropdown.Menu>
        </Dropdown>
    </Form.Group>

    )
}

export default Category
