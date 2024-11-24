import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Assuming Redux is used for global state
import classes from "./Cart.module.css";
import Header from "./Header";
import { cartActions } from "../store/redux-store";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  // Fetch cart items from Redux or local state
  const cartItems = useSelector((state) => state.cart.items || []);
  const dispatch=useDispatch()
  const userId=localStorage.getItem('userId')
  const safeEmail = userId.replace('@', '_at_').replace('.', '_dot_');
  const navi=useNavigate()
  

  const updateCartInDB = async (updatedCart) => {
    try {
      await fetch(
        `https://zepto-kind-default-rtdb.firebaseio.com/carts/${safeEmail}.json`,
        {
          method: "PUT",
          body: JSON.stringify(updatedCart),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating cart in DB:", error);
    }
  };


  const handleIncrease = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    
    // Update Redux state
    dispatch(cartActions.setCart(updatedCart));
    // Update backend (firebase)
    updateCartInDB(updatedCart);
  };

  // Handle decreasing quantity
  const handleDecrease = (id) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === id) {
        // Decrease the quantity
        if (item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        } else {
          // Remove the item if quantity is 1
          return null;
        }
      }
      return item;
    }).filter(item => item !== null); // Filter out null items (i.e., items with quantity 0)

    // Update Redux state and Firebase
    dispatch(cartActions.setCart(updatedCartItems));
    updateCartInDB(updatedCartItems);
  };
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const handleCheckout = () => {
    navi('/checkout')
    // Add your checkout logic here
  };

  return (
    <Fragment>
        <Header/>
    <div className={classes.cartContainer}>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in the cart.</p>
      ) :
      (
        <>
        <ul className={classes.cartList}>
          {cartItems.map((item) => (
            <li key={item.id} className={classes.cartItem}>
              <img
                src={item.img || "https://via.placeholder.com/100"}
                alt={item.name}
                className={classes.cartItemImage}
              />
              <div>
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <div className={classes.itemActions}>
                  <button onClick={() => handleIncrease(item.id)}>+</button>
                  <button onClick={() => handleDecrease(item.id)}>-</button>
                </div>
            </li>
          ))}
        </ul>
        <div className={classes.cartSummary}>
              <h3>Total: ${totalAmount.toFixed(2)}</h3>
              <button
                onClick={handleCheckout}
                className={classes.checkoutButton}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
      )}
    </div>
    </Fragment>
  );
};

export default Cart;
