import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./ProjectDetails.module.css";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { cartActions } from "../store/redux-store";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from route params
  const [product, setProduct] = useState(null);
  const cartItems = useSelector((state) => state.cart.items);
  const userId = localStorage.getItem("userId");
  const safeEmail = userId.replace("@", "_at_").replace(".", "_dot_");

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navi = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://zepto-kind-default-rtdb.firebaseio.com/products/${id}.json`
        );
        const data = await response.json();
        
        setProduct({...data,id:id});
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);
  if (!product) {
    return <p>Loading product details...</p>;
  }

  const handleAddToCart = async (item) => {
    console.log(item)
    if (!isLoggedIn) {
      navi("/login");
      return;
    }
    console.log(cartItems)
    const existingItem = cartItems.find((i) => i.id === item.id);
    console.log(existingItem);

    let updatedCartItems;

    if (existingItem) {
      // If the item is already in the cart, increase its quantity
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      console.log(updatedItem);
      updatedCartItems = cartItems.map((i) =>
        i.id === item.id ? updatedItem : i
      );
      console.log(updatedCartItems);
    } else {
      // If the item is not in the cart, add it with quantity 1
      const newItem = { ...item, quantity: 1 };
      updatedCartItems = [...cartItems, newItem];
    }
    dispatch(cartActions.setCart(updatedCartItems));
    try {
      await fetch(`https://zepto-kind-default-rtdb.firebaseio.com/carts/${safeEmail}.json`, {
        method: 'PUT', // Use PUT to overwrite the cart data in Firebase
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCartItems), // Send the updated cart items
      });
    } catch (error) {
      console.error('Error updating cart in Firebase:', error);
    }
  };

  return (
    <Fragment>
      <Header />
      <div className={classes.productDetails}>
        <img
          src={product.img}
          alt={product.name}
          className={classes.productImage}
        />
        <div className={classes.info}>
          <h1>{product.name}</h1>
          <p className={classes.category}>{product.category}</p>
          <p className={classes.description}>{product.description}</p>
          <p className={classes.price}>Price: ${product.price}</p>
          <button
            onClick={() => handleAddToCart(product)}
            className={classes.addToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductDetails;
