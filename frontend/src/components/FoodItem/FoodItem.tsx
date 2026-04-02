import React from 'react';
import './FoodItem.css';
import { assets } from '@/assets/assets';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addCartItem, removeCartItem } from '@/store/slices/cartSlice';

interface FoodItemProps {
  image: string;
  name: string;
  price: number;
  desc: string;
  id: string;
}

const FoodItem: React.FC<FoodItemProps> = ({ image, name, price, desc, id }) => {
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector(state => state.cart);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={image}
          alt={name}
        />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => dispatch(addCartItem(id))}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img
              src={assets.remove_icon_red}
              onClick={() => dispatch(removeCartItem(id))}
              alt=""
            />
            <p>{cartItems[id]}</p>
            <img
              src={assets.add_icon_green}
              onClick={() => dispatch(addCartItem(id))}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p> <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{desc}</p>
        <p className="food-item-price"> ₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
