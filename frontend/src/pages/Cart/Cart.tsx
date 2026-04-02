import React from 'react';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeCartItem } from '@/store/slices/cartSlice';
import { UI_CONTENT } from '@/constants/uiContent';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { list: foodList } = useAppSelector((state) => state.food);

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

  const handleRemove = (id: string) => {
    dispatch(removeCartItem(id));
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p>{' '}
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {foodList.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <div>{cartItems[item._id]}</div>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p
                    className="cart-items-remove-icon"
                    onClick={() => handleRemove(item._id)}
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>{UI_CONTENT.PLACE_ORDER.TOTAL_HEADER}</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 5}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}
              </b>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>
            {UI_CONTENT.CART.CHECKOUT_BUTTON}
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>{UI_CONTENT.CART.PROMO_CODE_PROMPT}</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
