import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Store/Auth'
import { BASE_URL } from '../../../config';

function ShowCategory() {
    const [categories, setCategories] = useState([]);

    const fetchAllCategory = async() => {
        try {
           const response = await fetch(`${BASE_URL}/api/techify/category/get-all`, {
            method: "GET",
           }) 

           const data = await response.json();
        //    console.log(data);

           if(response.ok){
            setCategories(data.categories);
           }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllCategory();
    }, [categories])
  return (
    <div className='my-3 home-category'>
      {
        categories && categories.length > 0 ? 
        categories.map((category, index) => {
            return <div key={index} className='text-center m-4 rounded-2 category-card'>
            <img src={category.image} alt={category.name} className='category-img m-2' width='110px' height='110px' />
            <p className='fs-5 fw-bold text-primary'>{category.name.charAt(0).toUpperCase() + category.name.substring(1)}</p>
          </div>
        }) : ""
      }
    </div>
  )
}

export default ShowCategory
