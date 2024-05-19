import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ count = 24 }) => {
  const skeletonItems = Array.from({ length: count }, (_, index) => (
    <div key={index} className="skeleton-food-item">
      <div className="skeleton-food-item-img"></div>
      <div className="skeleton-food-item-info">
        <div className="skeleton-food-item-name-rating">
          <span className="skeleton-line"></span>
          <span className="skeleton-line skeleton-rating"></span>
        </div>
        <div className="skeleton-food-item-desc">
          <span className="skeleton-line"></span>
          <span className="skeleton-line"></span>
        </div>
        <div className="skeleton-food-item-price">
          <span className="skeleton-line"></span>
        </div>
      </div>
    </div>
  ));

  return <div className="skeleton-loader">{skeletonItems}</div>;
};

export default SkeletonLoader;
