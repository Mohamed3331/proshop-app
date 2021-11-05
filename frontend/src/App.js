import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import ShippingPage from './pages/ShippingPage'
import PaymentPage from './pages/PaymentPage'
import PlaceOrderPage from './pages/PlaceOrderPage'
import OrderPage from './pages/OrderPage'
import UsersPage from './pages/UsersPage'
import UserEditPage from './pages/UserEditPage'
import ProductListPage from './pages/ProductListPage'
import OrderListPage from './pages/OrderListPage'
import ProductEditPage from './pages/ProductEditPage'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <main className="py-3">
          <Container>
            <Route exact path="/" component={HomePage} />
            <Route path="/search/:keyword" component={HomePage} exact />
            <Route path="/page/:pageNumber" component={HomePage} exact />
            <Route path="/search/:keyword/page/:pageNumber" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/product/:id" component={ProductPage} />
            <Route path="/cart/:id?" component={CartPage} />
            <Route path="/shipping" component={ShippingPage} />
            <Route path="/payment" component={PaymentPage} />
            <Route path="/placeorder" component={PlaceOrderPage} />
            <Route path="/order/:id" component={OrderPage} />
            <Route path="/admin/userlist" component={UsersPage} />
            <Route path="/admin/user/:id/edit" component={UserEditPage} />
            <Route path="/admin/productlist" component={ProductListPage} />
            <Route path="/admin/product/:id" component={ProductEditPage} />
            <Route path="/admin/orderList" component={OrderListPage} />
          </Container>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
