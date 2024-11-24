import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import classes from "./Checkout.module.css";
import { cartActions } from "../store/redux-store";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isNewAddress, setIsNewAddress] = useState(false); // State to toggle between new address or saved address

  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const safeEmail = userId.replace("@", "_at_").replace(".", "_dot_");

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const selectedAddressId = e.target.value;
    setSelectedAddress(selectedAddressId);
    const address = savedAddresses.find(
      (address) => address.id === selectedAddressId
    );
    setFormData(address || {}); // Fill form with selected address
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      address: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      items: cartItems,
      status: "Confirmed",
      totalPrice: totalPrice,
      paymentMode: "Cash on Delivery",
      timestamp: new Date().toISOString(),
    };

    try {
      // Save the order to Firebase
      await fetch(
        `https://zepto-kind-default-rtdb.firebaseio.com/orders/${safeEmail}.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      // If a new address is entered, save it to the database
      if (isNewAddress) {
        await fetch(
          `https://zepto-kind-default-rtdb.firebaseio.com/addresses/${safeEmail}.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
      }

      // Clear the cart after successful order placement
      dispatch(cartActions.setCart([]));

      setSubmitted(true);
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place the order. Please try again.");
    }
  };

  useEffect(() => {
    // Fetch saved addresses for the user
    const fetchSavedAddresses = async () => {
      try {
        const response = await fetch(
          `https://zepto-kind-default-rtdb.firebaseio.com/addresses/${safeEmail}.json`
        );
        const data = await response.json();
        if (data) {
          const addressesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setSavedAddresses(addressesArray);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchSavedAddresses();
  }, [safeEmail]);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [submitted, navigate]);

  if (submitted) {
    return (
      <div className={classes.successMessage}>
        <h2>Order Placed Successfully!</h2>
        <p>Your order details:</p>
        <p><strong>Name:</strong> {formData.name}</p>
        <p><strong>Address:</strong> {`${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`}</p>
        <h3>Payment Mode: Cash on Delivery</h3>
        <h2>Redirecting to Home Page....</h2>
      </div>
    );
  }

  return (

    <Fragment>
        <Header/>
    <div className={classes.formContainer}>
      <h2>Shipping Address</h2>

      {/* Toggle between new address and saved address */}
      <div className={classes.toggleContainer}>
        <label>
          <input
            type="radio"
            name="addressOption"
            value="saved"
            checked={!isNewAddress}
            onChange={() => setIsNewAddress(false)}
          />
          Use Saved Address
        </label>
        <label>
          <input
            type="radio"
            name="addressOption"
            value="new"
            checked={isNewAddress}
            onChange={() => setIsNewAddress(true)}
          />
          Enter New Address
        </label>
      </div>

      {/* If using saved address */}
      {!isNewAddress && (
        <div className={classes.formGroup}>
          <label htmlFor="addressSelect">Select Saved Address:</label>
          <select
            id="addressSelect"
            value={selectedAddress}
            onChange={handleAddressChange}
            className={classes.selectInput}
          >
            <option value="">Select an address</option>
            {savedAddresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.address}, {address.city}, {address.country}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* If entering a new address */}
      {isNewAddress && (
        <>
          <form onSubmit={handleSubmit} className={classes.shippingForm}>
            <div className={classes.formGroup}>
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="phone">Phone Number:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="address">Address:</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="city">City:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="postalCode">Postal Code:</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="country">Country:</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </form>
        </>
      )}

      <div className={classes.orderSummary}>
        <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
      </div>

      <button type="submit" className={classes.submitButton} onClick={handleSubmit}>
        Place Order
      </button>

      <h3 className={classes.paymentMode}>Payment Mode: Cash on Delivery</h3>
    </div>
    </Fragment>
  );
};

export default Checkout;
