import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../../config'
import { Form } from 'react-bootstrap';

function FilterBrand({handleFilterBrand}) {
    const [brands, setBrands] = useState([]);

    const getAllBrands = async() => {
        try {
            const response = await fetch(`${BASE_URL}/api/techify/brands/get-all`, {
                method: "GET",
            })

            const data = await response.json();
            // console.log(data);

            if(response.ok){
                setBrands(data);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllBrands();
    }, []);
  return (
    <div style={{maxHeight: "300px"}}>
      <Form.Select className='text-primary custom-dropdown overflow-auto' onChange={handleFilterBrand} style={{minWidth: "120px", maxHeight: "300px"}} aria-label="Default select example">
        <option value="">Brand</option>
        {
            brands?.map((brand) => {
                return <option key={brand._id} value={brand._id}>{brand.name}</option>
            })
        }
    
      </Form.Select>
    </div>
  )
}

export default FilterBrand
