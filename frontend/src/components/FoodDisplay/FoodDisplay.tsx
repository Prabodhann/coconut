import React from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { useAppSelector } from "@/store/hooks";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import { UI_CONTENT } from "@/constants/uiContent";

interface FoodDisplayProps {
  category: string;
}

const FoodDisplay: React.FC<FoodDisplayProps> = ({ category }) => {
  const { list: foodList, loading } = useAppSelector(state => state.food);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (foodList.length === 0) {
    return <SkeletonLoader />;
  }

  return (
    <div className="food-display" id="food-display">
      <h2>{UI_CONTENT.FOOD_DISPLAY.TITLE}</h2>
      <div className="food-display-list">
        {foodList.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={item._id}
                image={item.image}
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
