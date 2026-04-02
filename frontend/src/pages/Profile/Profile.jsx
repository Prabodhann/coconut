import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (!token) {
      if (!localStorage.getItem('token')) {
        navigate('/');
      }
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(url + '/api/user/profile', {
          headers: { token },
        });
        if (response.data.success) {
          setData((prev) => ({
            ...prev,
            name: response.data.data.name,
            email: response.data.data.email,
          }));
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load profile');
      }
    };
    fetchProfile();
  }, [token, url, navigate]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        url + '/api/user/profile',
        {
          name: data.name,
          password: data.password,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setData((prev) => ({ ...prev, password: '' })); // clear password input after success
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while updating profile');
    }
  };

  return (
    <div className="profile">
      <form onSubmit={onSubmitHandler} className="profile-container">
        <h2>Edit Profile</h2>
        <div className="profile-inputs">
          <div>
            <label>Name</label>
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label>Email (Cannot be changed)</label>
            <input
              name="email"
              value={data.email}
              type="email"
              placeholder="Your Email"
              disabled
            />
          </div>
          <div>
            <label>New Password (Optional)</label>
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder="Leave blank to keep current"
            />
          </div>
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
