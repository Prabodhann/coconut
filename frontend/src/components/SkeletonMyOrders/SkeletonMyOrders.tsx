import React from 'react';
import './SkeletonMyOrders.css';
import { UI_CONTENT } from '@/constants/uiContent';

interface SkeletonMyOrdersProps {
  count?: number;
}

const SkeletonMyOrders: React.FC<SkeletonMyOrdersProps> = ({ count = 5 }) => {
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
      <h2>{UI_CONTENT.MY_ORDERS.TITLE}</h2>
      <div className="skeleton-container">{skeletonRows}</div>
    </div>
  );
};

export default SkeletonMyOrders;
