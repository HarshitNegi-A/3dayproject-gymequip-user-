import React, { Fragment, useEffect, useState } from "react";
import classes from "./MyOrders.module.css";
import Header from "./Header";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const safeEmail = userId.replace("@", "_at_").replace(".", "_dot_");

  // Fetch orders from Firebase
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `https://zepto-kind-default-rtdb.firebaseio.com/orders/${safeEmail}.json`
      );
      const data = await response.json();

      if (data) {
        // Convert the orders object into an array
        const ordersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setOrders(ordersArray);
      } else {
        setOrders([]); // No orders
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className={classes.loading}>Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <><Header/><div className={classes.noOrders}>You have no orders yet!</div>;</>
  }

  return (
    <Fragment>
        <Header/>
    <div className={classes.ordersContainer}>
      <h2>Your Orders</h2>
      <ul className={classes.orderList}>
        {orders.map((order) => (
          <li key={order.id} className={classes.orderItem}>
            <div className={classes.orderDetails}>
              <h3>Order ID: {order.id}</h3>
              <p>
                <strong>Placed On:</strong> {new Date(order.timestamp).toLocaleString()}
              </p>
              <p>
                <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
              </p>
              <p>
                <strong>Payment Mode:</strong> {order.paymentMode}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Shipping Address:</strong>{" "}
                {`${order.address.name}, ${order.address.address}, ${order.address.city}, ${order.address.postalCode}, ${order.address.country}`}
              </p>
            </div>
            <h4>Items:</h4>
            <ul className={classes.itemsList}>
              {order.items.map((item) => (
                <li key={item.id} className={classes.item}>
                  <div className={classes.itemDetails}>
                    <p>
                      <strong>{item.name}</strong>
                    </p>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
    </Fragment>
  );
};

export default MyOrders;
