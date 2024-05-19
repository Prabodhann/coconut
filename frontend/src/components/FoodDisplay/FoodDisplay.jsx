import React, { useContext } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import { StoreContext } from '../../Context/StoreContext';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';

const FoodDisplay = ({ category }) => {
  const { foodList } = useContext(StoreContext);
  if (!foodList) {
    return <div>Loading...</div>;
  }

  if (foodList.length === 0) {
    return <SkeletonLoader />;
  }

  return (
    <div className="food-display" id="food-display">
      <h2>Exclusive Delights</h2>
      <div className="food-display-list">
        {foodList.map((item) => {
          if (category === 'All' || category === item.category) {
            return (
              <FoodItem
                key={item._id}
                image={item.imageData}
                name={item.name}
                desc={item.description}
                price={item.price}
                id={item._id}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
