import React from 'react';
import './SkeletonList.css';

const SkeletonList = ({ count = 22 }) => {
  const skeletonRows = Array.from({ length: count }, (_, index) => (
    <div key={index} className="skeleton-row">
      <div className="skeleton-image"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-action"></div>
    </div>
  ));

  return (
    <div className="skeleton-list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {skeletonRows}
      </div>
    </div>
  );
};

export default SkeletonList;
