import React, { useState } from 'react';
import './Navbar.css';
import { assets } from '@/assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { UI_CONTENT } from '@/constants/uiContent';

interface NavbarProps {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setShowLogin }) => {
  const [menu, setMenu] = useState('home');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector(state => state.auth);
  const { items: cartItems } = useAppSelector(state => state.cart);
  const { list: foodList } = useAppSelector(state => state.food);

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = foodList.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img className="logo" src={assets.logo} alt="" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu('home')}
          className={`${menu === 'home' ? 'active' : ''}`}
        >
          {UI_CONTENT.NAVBAR.HOME}
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu('menu')}
          className={`${menu === 'menu' ? 'active' : ''}`}
        >
          {UI_CONTENT.NAVBAR.MENU}
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu('mob-app')}
          className={`${menu === 'mob-app' ? 'active' : ''}`}
        >
          {UI_CONTENT.NAVBAR.MOBILE_APP}
        </a>
        <a
          href="#footer"
          onClick={() => setMenu('contact')}
          className={`${menu === 'contact' ? 'active' : ''}`}
        >
          {UI_CONTENT.NAVBAR.CONTACT_US}
        </a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <Link to="/cart" className="navbar-search-icon">
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? 'dot' : ''}></div>
        </Link>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>{UI_CONTENT.NAVBAR.SIGN_IN}</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="navbar-profile-dropdown">
              <li onClick={() => navigate('/profile')}>
                <img src={assets.profile_icon} alt="" /> <p>{UI_CONTENT.NAVBAR.PROFILE}</p>
              </li>
              <hr />
              <li onClick={() => navigate('/myorders')}>
                <img src={assets.bag_icon} alt="" /> <p>{UI_CONTENT.NAVBAR.ORDERS}</p>
              </li>
              <hr />
              <li onClick={handleLogout}>
                <img src={assets.logout_icon} alt="" /> <p>{UI_CONTENT.NAVBAR.LOGOUT}</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
