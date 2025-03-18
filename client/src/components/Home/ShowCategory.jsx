import React from 'react'
import { useCategories } from '../../Store/CategoryStore'
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';


function ShowCategory() {
    const {categories} = useCategories();
    // console.log(categories)
  return (
    <div className='home-category'>
      {
        categories && categories.length > 0 ? 
        categories.map((category, index) => {
            return <Link to={`/products/${category._id}`} key={index} className='text-center m-2 rounded-2 category-card text-decoration-none'>
            <img src={category.image} alt={category.name} className='category-img m-2'/>
            <p className='fs-5 fw-bold text-primary'>{category.name.charAt(0).toUpperCase() + category.name.substring(1)}</p>
          </Link>
        }) : <Spinner variant='primary' size='lg' />
      }
    </div>
  )
}

export default ShowCategory
