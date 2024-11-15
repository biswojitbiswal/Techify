import React from 'react'
import MyNavbar from './components/Navbar/MyNavbar'
import Home from './components/Home/Home'
import Product from './components/Product/Product'
import ProShow from './components/ProShow/ProShow'
import Blog from './components/Blog/Blog'
import Social from './components/Social/Social'
import Cart from './components/Cart/Cart'
import Signin from './components/Signin/Signin'
import Signup from './components/Signup/Signup'
import AdminLayout from './AdminPanel/AdminLayout'
import ProductEdit from './AdminPanel/ProductEdit'
import ProductAdd from './AdminPanel/ProductAdd'
import Publish from './AdminPanel/Publish'
import Links from './AdminPanel/Links'
import Error from './components/Error/Error'
import Signout from './components/Signout/Signout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
    <BrowserRouter>
      <MyNavbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/product' element={<Product />} />
        <Route path='/product/:productId' element={<ProShow />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signout' element={<Signout />} />
        <Route path='/admin' element={<AdminLayout />}>
          <Route path='add' element={<ProductAdd />} />
          <Route path='edit/:productId' element={<ProductEdit />} />
          <Route path='publish' element={<Publish />} />
          <Route path='links' element={<Links />} />

        </Route>
        <Route path='/*' element={<Error />} />
      </Routes>
    </BrowserRouter>
      
      
    </>
  )
}

export default App
