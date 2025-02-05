import React from 'react'
import { useCategories } from '../../Store/CategoryStore'
import { Link } from 'react-router-dom';


function ShowCategory() {
    const {categories} = useCategories();
    // console.log(categories)
  return (
    <div className='my-3 home-category'>
      {
        categories && categories.length > 0 ? 
        categories.map((category, index) => {
            return <Link to={`/products/${category._id}`} key={index} className='text-center m-4 rounded-2 category-card text-decoration-none'>
            <img src={category.image} alt={category.name} className='category-img m-2' width='110px' height='110px' />
            <p className='fs-5 fw-bold text-primary'>{category.name.charAt(0).toUpperCase() + category.name.substring(1)}</p>
          </Link>
        }) : ""
      }
    </div>
  )
}

export default ShowCategory
