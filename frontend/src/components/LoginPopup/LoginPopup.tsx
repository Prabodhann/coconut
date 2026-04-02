import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '@/assets/assets';
import { useAppDispatch } from '@/store/hooks';
import { setToken } from '@/store/slices/authSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { fetchCart } from '@/store/slices/cartSlice';
import { UI_CONTENT } from '@/constants/uiContent';
import { CONSTANTS } from '@/constants';

interface LoginPopupProps {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ setShowLogin }) => {
  const dispatch = useAppDispatch();
  const [currState, setCurrState] = useState(UI_CONTENT.LOGIN.SIGN_UP_TITLE);

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    let new_url = CONSTANTS.API_URL;
    if (currState === UI_CONTENT.LOGIN.LOGIN_TITLE) {
      new_url += '/api/user/login';
    } else {
      new_url += '/api/user/register';
    }
    try {
      const response = await axios.post(new_url, data);
      if (response.data.success) {
        dispatch(setToken(response.data.token));
        dispatch(fetchCart());
        setShowLogin(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>{' '}
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === UI_CONTENT.LOGIN.SIGN_UP_TITLE ? (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder={UI_CONTENT.LOGIN.NAME_PLACEHOLDER}
              required
            />
          ) : (
            <></>
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder={UI_CONTENT.LOGIN.EMAIL_PLACEHOLDER}
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder={UI_CONTENT.LOGIN.PASSWORD_PLACEHOLDER}
            required
          />
        </div>
        <button>{currState === UI_CONTENT.LOGIN.LOGIN_TITLE ? UI_CONTENT.LOGIN.LOGIN_BTN : UI_CONTENT.LOGIN.CREATE_ACCOUNT_BTN}</button>
        <div className="login-popup-condition">
          <input type="checkbox" name="" id="" required />
          <p>{UI_CONTENT.LOGIN.TERMS_AGREEMENT}</p>
        </div>
        {currState === UI_CONTENT.LOGIN.LOGIN_TITLE ? (
          <p>
            {UI_CONTENT.LOGIN.CREATE_NEW_PROMPT}{' '}
            <span onClick={() => setCurrState(UI_CONTENT.LOGIN.SIGN_UP_TITLE)}>{UI_CONTENT.LOGIN.CLICK_HERE}</span>
          </p>
        ) : (
          <p>
            {UI_CONTENT.LOGIN.ALREADY_HAVE_PROMPT}{' '}
            <span onClick={() => setCurrState(UI_CONTENT.LOGIN.LOGIN_TITLE)}>{UI_CONTENT.LOGIN.LOGIN_HERE}</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
