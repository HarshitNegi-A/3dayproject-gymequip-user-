
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import ForgetPassword from "./components/ForgetPassword";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import MyOrders from "./components/MyOrders";
import Profile from "./components/Profile";

function App() {


  const router=createBrowserRouter([
    {
      path:'/',
      element: <HomePage/>
    },
    {
      path:'/login',
      element: <Login/>
    },
    {
      path:'/resetPassword',
      element: <ForgetPassword/>
    },
    {
      path:'/product/:id',
      element: <ProductDetails />
    },
    {
      path:'/cart',
      element: <Cart />
    },
    {
      path:'/checkout',
      element: <Checkout />
    },
    {
      path:'/myorders',
      element: <MyOrders />
    },
    {
      path:'/profile',
      element: <Profile />
    },
    
  ])

  return (
    <RouterProvider router={router} />
  );
}

export default App;
