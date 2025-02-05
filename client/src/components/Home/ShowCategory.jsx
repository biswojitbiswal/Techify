import React from 'react'
import { useCategories } from '../../Store/CategoryStore'


function ShowCategory() {
    const {categories} = useCategories();
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
