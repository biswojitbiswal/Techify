import React from 'react'
import { useCategories } from '../../Store/CategoryStore'
import { Form } from 'react-bootstrap';


function FilterCategory({handleFilterCategory}) {
    const { categories } = useCategories();
    return (
        <div>
            <Form.Select className='text-primary' onChange={handleFilterCategory} aria-label="Default select example">
                <option>Category</option>
                {
                    categories?.map((category) => {
                        return <option key={category._id} value={category._id}>{category.name}</option>
                    })
                }
            </Form.Select>
        </div>
    )
}

export default FilterCategory
