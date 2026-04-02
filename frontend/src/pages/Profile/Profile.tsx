import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CONSTANTS } from '@/constants';
import { UI_CONTENT } from '@/constants/uiContent';

const Profile: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (!token) {
      if (!localStorage.getItem(CONSTANTS.LOCAL_STORAGE_TOKEN_KEY)) {
        navigate('/');
      }
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${CONSTANTS.API_URL}/api/user/profile`, {
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
  }, [token, navigate]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `${CONSTANTS.API_URL}/api/user/profile`,
        {
          name: data.name,
          password: data.password,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setData((prev) => ({ ...prev, password: '' }));
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
        <h2>{UI_CONTENT.PROFILE.TITLE}</h2>
        <div className="profile-inputs">
          <div>
            <label>{UI_CONTENT.PROFILE.NAME_LABEL}</label>
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder={UI_CONTENT.PROFILE.NAME_PLACEHOLDER}
              required
            />
          </div>
          <div>
            <label>{UI_CONTENT.PROFILE.EMAIL_LABEL}</label>
            <input
              name="email"
              value={data.email}
              type="email"
              placeholder={UI_CONTENT.PROFILE.EMAIL_PLACEHOLDER}
              disabled
            />
          </div>
          <div>
            <label>{UI_CONTENT.PROFILE.PASSWORD_LABEL}</label>
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder={UI_CONTENT.PROFILE.PASSWORD_PLACEHOLDER}
            />
          </div>
        </div>
        <button type="submit">{UI_CONTENT.PROFILE.UPDATE_BUTTON}</button>
      </form>
    </div>
  );
};

export default Profile;
