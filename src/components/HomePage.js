import React, { Fragment, useEffect, useState } from "react";
import Header from "./Header";
import classes from "./HomePage.module.css";
import { Link } from "react-router-dom";
import { cartActions } from "../store/redux-store";
import { useDispatch } from "react-redux";

const HomePage = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // State for search term
  const [filteredProducts, setFilteredProducts] = useState({}); // Filtered products based on search
  const userId=localStorage.getItem('userId')
  const safeEmail = userId.replace('@', '_at_').replace('.', '_dot_');
  const dispatch=useDispatch()

  const fetchCartFromDB = async () => {
    try {
      const response = await fetch(
        `https://zepto-kind-default-rtdb.firebaseio.com/carts/${safeEmail}.json`
      );
      if (response.ok) {
        const data = await response.json();
        const cartData = data ? data : []; // If no cart data, set to empty array
        dispatch(cartActions.setCart(cartData)); // Update Redux with the fetched data
      } else {
        console.error("Failed to fetch cart data.");
      }
    } catch (error) {
      console.error("Error fetching cart from Firebase:", error);
    }
  };

  // Fetch cart data when the component mounts
  useEffect(() => {
    fetchCartFromDB();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://zepto-kind-default-rtdb.firebaseio.com/products.json"
        );
        const data = await response.json();
        if (data) {
          const productsArray = Object.keys(data).map((key) => ({
            
            id: key,
            ...data[key],
          }));

          const grouped = productsArray.reduce((acc, product) => {
            if (!acc[product.category]) {
              acc[product.category] = [];
            }
            acc[product.category].push(product);
            return acc;
          }, {});

          setGroupedProducts(grouped);
          setFilteredProducts(grouped); // Initially display all products
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);

    // If search query is empty, show all products
    if (e.target.value === "") {
      setFilteredProducts(groupedProducts);
    } else {
      // Filter products by name, category, or description based on search query
      const newFilteredProducts = Object.keys(groupedProducts).reduce(
        (acc, category) => {
          acc[category] = groupedProducts[category].filter((product) =>
            product.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            product.category.toLowerCase().includes(e.target.value.toLowerCase()) 
          );
          return acc;
        },
        {}
      );
      setFilteredProducts(newFilteredProducts);
    }
  };

  return (
    <Fragment>
      <Header />
      <div className={classes.searchContainer}>
        <input
          className={classes.searchInput}
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch} // Update filtered products on input change
        />
      </div>

      <div className={classes.productList}>
        {Object.keys(filteredProducts).map((category) => (
          <div key={category} className={classes.categorySection}>
            <h2>{category}</h2>
            <div className={classes.productGrid}>
              {filteredProducts[category].map((product) => (
                <div key={product.id} className={classes.productItem}>
                  <h3>{product.name}</h3>
                  <img
                    src={product.img || "https://via.placeholder.com/150"}
                    alt={product.name}
                    className={classes.productImage}
                  />
                  <p>Price: ${product.price}</p>
                  {/* <p>{product.description}</p> */}
                  <Link
                    to={`/product/${product.id}`}
                    className={classes.productLink}
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default HomePage;
