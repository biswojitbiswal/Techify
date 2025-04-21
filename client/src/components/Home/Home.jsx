import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import Social from '../Social/Social'
// import Search from './Search'
import ShowCategory from './ShowCategory'
import Carsoule from './Carsoule'
import { useCategories } from '../../Store/CategoryStore'
import { Spinner } from 'react-bootstrap'


function Home() {
  const { categories } = useCategories();

  return (
    categories && categories.length > 0 ? (<>
      <section id="home_section">
        {/* <Search /> */}
        <ShowCategory />
        <Carsoule />
      </section>
      <Social />
    </>) : (<Spinner variant='primary' size='lg' />)


  )
}

export default Home
