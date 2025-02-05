import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import Social from '../Social/Social'
// import Search from './Search'
import ShowCategory from './ShowCategory'
import Carsoule from './Carsoule'


function Home() {
  return (
    <>
      <section id="home_section">
        {/* <Search /> */}
        <ShowCategory />
        <Carsoule />
      </section>
      <Social />
    </>
  )
}

export default Home
