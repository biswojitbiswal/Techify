import React from 'react'
import '../src/index.css'
import MyNavbar from './components/Navbar/MyNavbar'
import Home from './components/Home/Home'
import Product from './components/Product/Product'
import ProShow from './components/ProShow/ProShow'
import Order from './components/Order/Order'
import Cart from './components/Cart/Cart'
import Account from './components/Account/Account'
import MyOrders from './components/MyOrder/MyOrders'
import Address from './components/Address/Address'
import Profile from './components/Profile/Profile'
import Signin from './components/Signin/Signin'
import Signup from './components/Signup/Signup'
import AdminHome from './AdminPanel/OrderMng.jsx/AdminHome'
import Users from './AdminPanel/Users'
import UserEdit from './AdminPanel/UserEdit'
import AddReview from './AdminPanel/AddReview'
import ProductEdit from './AdminPanel/ProductEdit'
import ProductAdd from './AdminPanel/ProductAdd'
import Links from './AdminPanel/Links'
import Error from './components/Error/Error'
import Signout from './components/Signout/Signout'
import Footer from './components/Footer/Footer'
import Contact from './components/Contact/Contact'
import RecentlyView from './components/RecentlyView/RecentlyView'
import AddCategory from './AdminPanel/AddCategory'
import AddBrand from './AdminPanel/AddBrand'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'


const ProtectedProductAdd = ProtectedRoute(ProductAdd, ['Admin']);
const ProtectedAdmin = ProtectedRoute(AdminHome, ['Admin', 'Moderator']);
const ProtectedAddUser = ProtectedRoute(Users, ['Admin', 'Moderator']);
const ProtectedEditUser = ProtectedRoute(UserEdit, ['Admin', 'Moderator']);
const ProtectedReview = ProtectedRoute(AddReview, ['Admin', 'Moderator']);
const ProtectedTestimonial = ProtectedRoute(Links, ['Admin', 'Moderator'])
const ProtectedCategory = ProtectedRoute(AddCategory, ['Admin', 'Moderator']);
const ProtectedBrand = ProtectedRoute(AddBrand, ['Admin', 'Moderator']);
const ProtectedAccount = ProtectedRoute(Account, ['User', 'Admin', 'Moderator'])
const ProtectedAddress = ProtectedRoute(Address, ['User', 'Admin', 'Moderator']);
const ProtectedOrder = ProtectedRoute(MyOrders, ['User', 'Admin', 'Moderator']);
const ProtectedCart = ProtectedRoute(Cart, ['User', 'Admin', 'Moderator']);
const ProtectedOrderNow = ProtectedRoute(Order, ['User', 'Admin', 'Moderator']);
const ProductedContact = ProtectedRoute(Contact, ['User', 'Admin', 'Moderator']);
const ProductRecently = ProtectedRoute(RecentlyView, ['User', 'Admin', 'Moderator']);
const ProtectedProfile = ProtectedRoute(Profile, ['User', 'Admin', 'Moderator']);


function App() {

  return (
    <>
      <BrowserRouter>
        <MyNavbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products/:categoryId' element={<Product />} />
          <Route path='/product/:productId' element={<ProShow />} />
          <Route path='/order/buy-now' element={<ProtectedOrderNow />} />
          <Route path='/cart' element={<ProtectedCart />} />

          <Route path='/account' element={<ProtectedAccount />} />
          <Route path='/account/address' element={<ProtectedAddress />} />
          <Route path='/account/myorders' element={<ProtectedOrder />} />
          <Route path='/account/recently-view' element={<ProductRecently />} />
          <Route path='/account/profile' element={<ProtectedProfile />} />

          <Route path='/contact' element={<ProductedContact />} />
          {/* </Route> */}

          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signout' element={<Signout />} />

          <Route path='/admin' element={<ProtectedAdmin />} />
          <Route path='/admin/users' element={<ProtectedAddUser />} />
          <Route path='/admin/user/edit/:userId' element={<ProtectedEditUser />} />
          <Route path='/admin/add/product' element={<ProtectedProductAdd />} />
          <Route path='/admin/edit/:productId' element={<ProductEdit />} />
          <Route path='/admin/reviews' element={<ProtectedReview />} />
          <Route path='/admin/add/testimonial' element={<ProtectedTestimonial />} />
          <Route path='/admin/add/category' element={<ProtectedCategory />} />
          <Route path='/admin/add/brand' element={<ProtectedBrand />} />


          <Route path='/*' element={<Error />} />
        </Routes>
        <Footer />
      </BrowserRouter>


    </>
  )
}

export default App
