import React from 'react';
import "./Header.module.css"
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, cartActions } from '../store/redux-store';
import classes from "./Header.module.css"

const Header = () => {

    const isLoggedIn=useSelector(state=>state.auth.isLoggedIn)
    const cartItems=useSelector(state=>state.cart.items)

    const navi=useNavigate()

    const dispatch=useDispatch()

    const handleLogout=()=>{
        dispatch(authActions.logout())
        localStorage.setItem('token',null)
        localStorage.setItem('userId',null)
        dispatch(cartActions.setCart([]))
        navi('/')
    }

    const handleCartButton=()=>{
      if(!isLoggedIn){
        navi('/login')
      }
      else{
        navi('/cart')
      }
    }
    const handleOrderButton=()=>{
      navi('/myorders')
    }

    const handleProfileButton=()=>{
      navi('/profile')
    }

    const totalCartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className={classes.header}>
      <h2 className={classes.h2}><Link to='/'>GymEquip</Link></h2>

      <div>
        {!isLoggedIn && <Link to='/login'><button className={classes.button}>Login</button></Link>}
        {isLoggedIn && <button className={classes.button} onClick={handleProfileButton}>My Profile</button>}
        {isLoggedIn && <button className={classes.button} onClick={handleOrderButton}>My Orders</button>}

        
        <button onClick={handleCartButton} className={classes.button}>Cart {totalCartQuantity}</button>
        {isLoggedIn && <button className={classes.button} onClick={handleLogout}>Logout</button>}
      </div>
    </header>
  );
};

export default Header;
