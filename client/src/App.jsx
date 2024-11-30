import React from 'react'
import '../src/index.css'
import MyNavbar from './components/Navbar/MyNavbar'
import Home from './components/Home/Home'
import Product from './components/Product/Product'
import ProShow from './components/ProShow/ProShow'
import Blog from './components/Blog/Blog'
import Cart from './components/Cart/Cart'
import Account from './components/Account/Account'
import Signin from './components/Signin/Signin'
import Signup from './components/Signup/Signup'
import AdminLayout from './AdminPanel/AdminLayout'
import AdminHome from './AdminPanel/AdminHome'
import AdminUsers from './AdminPanel/AdminUsers'
import UserEdit from './AdminPanel/UserEdit'
import ProductEdit from './AdminPanel/ProductEdit'
import ProductAdd from './AdminPanel/ProductAdd'
import Publish from './AdminPanel/Publish'
import Links from './AdminPanel/Links'
import Error from './components/Error/Error'
import Signout from './components/Signout/Signout'
import Footer from './components/Footer/Footer'
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
        <Route path='/account' element={<Account />}></Route>
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signout' element={<Signout />} />
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path='users' element={<AdminUsers />} />
          <Route path='user/edit/:userId' element={<UserEdit />} />
          <Route path='add/product' element={<ProductAdd />} />
          <Route path='edit/:productId' element={<ProductEdit />} />
          <Route path='add/publish' element={<Publish />} />
          <Route path='add/links' element={<Links />} />

        </Route>
        <Route path='/*' element={<Error />} />
      </Routes>
      <Footer />
    </BrowserRouter>
      
      
    </>
  )
}

export default App
