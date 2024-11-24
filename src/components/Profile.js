import React, { Fragment, useEffect, useState } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import classes from './Profile.module.css';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [addressData, setAddressData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const safeEmail = userId.replace("@", "_at_").replace(".", "_dot_"); // Safe email for Firebase

  const navigate = useNavigate();

  // Fetch user data and saved addresses on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile data
        const response = await fetch(
          `https://zepto-kind-default-rtdb.firebaseio.com/profile/${safeEmail}.json`
        );
        const data = await response.json();
        if (data) {
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
          });
        }

        // Fetch saved addresses
        const addressResponse = await fetch(
          `https://zepto-kind-default-rtdb.firebaseio.com/addresses/${safeEmail}.json`
        );
        const addressData = await addressResponse.json();
        if (addressData) {
          setSavedAddresses(Object.values(addressData)); // Converts address object to array
        }
      } catch (error) {
        console.error('Error fetching user or address data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [safeEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'address' || name === 'city' || name === 'postalCode' || name === 'country') {
      setAddressData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const addressId = new Date().toISOString(); // Unique ID for each address

    try {
      // Save new address to Firebase
      await fetch(
        `https://zepto-kind-default-rtdb.firebaseio.com/addresses/${safeEmail}.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: addressId,
            ...addressData,
          }),
        }
      );
      // Add the new address to the local state
      setSavedAddresses((prevAddresses) => [...prevAddresses, { ...addressData, id: addressId }]);
      alert('Address saved successfully!');
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address. Please try again.');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update user profile in Firebase
      await fetch(
        `https://zepto-kind-default-rtdb.firebaseio.com/profile/${safeEmail}.json`,
        {
          method: 'PUT', // Using PUT to update the existing user data
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      setIsUpdated(true);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  return (
    <Fragment>
      <Header />
      <div className={classes.profileContainer}>
        <h2>Update Your Profile</h2>
        {isUpdated && <p className={classes.successMessage}>Profile updated successfully!</p>}

        {/* Profile Form */}
        <form onSubmit={handleProfileSubmit} className={classes.profileForm}>
          <div className={classes.formGroup}>
            <label htmlFor="name">Name:</label>
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
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
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
          <button type="submit" className={classes.submitButton}>
            Update Profile
          </button>
        </form>

        {/* Address Form */}
        <h3>Manage Your Addresses</h3>
        <form onSubmit={handleAddressSubmit} className={classes.addressForm}>
          <div className={classes.formGroup}>
            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              name="address"
              value={addressData.address}
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
              value={addressData.city}
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
              value={addressData.postalCode}
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
              value={addressData.country}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={classes.submitButton}>
            Save Address
          </button>
        </form>

        {/* Display saved addresses */}
        <h4>Your Saved Addresses:</h4>
        <ul className={classes.savedAddressesList}>
          {savedAddresses.length === 0 ? (
            <p>No addresses saved yet.</p>
          ) : (
            savedAddresses.map((address) => (
              <li key={address.id}>
                <p>{address.address}, {address.city}, {address.postalCode}, {address.country}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </Fragment>
  );
};

export default Profile;
