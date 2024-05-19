import React from 'react';
import './SkeletonOrders.css';

const SkeletonOrders = ({ count = 15 }) => {
  const skeletonRows = Array.from({ length: count }, (_, index) => (
    <div key={index} className="skeleton-order-item">
      <div className="skeleton-order-image"></div>
      <div className="skeleton-order-details">
        <div className="skeleton-order-text skeleton-animation"></div>
        <div className="skeleton-order-text skeleton-animation"></div>
        <div className="skeleton-order-text skeleton-animation"></div>
        <div className="skeleton-order-text skeleton-animation"></div>
        <div className="skeleton-order-text skeleton-animation"></div>
      </div>
      <div className="skeleton-order-count skeleton-animation"></div>
      <div className="skeleton-order-amount skeleton-animation"></div>
      <div className="skeleton-order-status skeleton-animation"></div>
    </div>
  ));

  return <div className="skeleton-orders add">{skeletonRows}</div>;
};

export default SkeletonOrders;
