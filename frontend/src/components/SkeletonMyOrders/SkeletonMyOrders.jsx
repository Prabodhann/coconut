import React from 'react';
import './SkeletonMyOrders.css';

const SkeletonMyOrders = ({ count = 5 }) => {
  const skeletonRows = Array.from({ length: count }, (_, index) => (
    <div key={index} className="skeleton-order">
      <div className="skeleton-order-image"></div>
      <div className="skeleton-order-text skeleton-animation"></div>
      <div className="skeleton-order-amount skeleton-animation"></div>
      <div className="skeleton-order-count skeleton-animation"></div>
      <div className="skeleton-order-status skeleton-animation"></div>
      <div className="skeleton-order-button skeleton-animation"></div>
    </div>
  ));

  return (
    <div className="skeleton-my-orders">
      <h2>My Orders</h2>
      <div className="skeleton-container">{skeletonRows}</div>
    </div>
  );
};

export default SkeletonMyOrders;
