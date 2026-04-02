import React, { useState, useEffect } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { assets } from '@/assets/assets';
import SkeletonMyOrders from '@/components/SkeletonMyOrders/SkeletonMyOrders';
import { useAppSelector } from '@/store/hooks';
import { CONSTANTS } from '@/constants';
import { UI_CONTENT } from '@/constants/uiContent';

const MyOrders: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const { token } = useAppSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${CONSTANTS.API_URL}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (isLoading) {
    return <SkeletonMyOrders />;
  }

  return (
    <div className="my-orders">
      <h2>{UI_CONTENT.MY_ORDERS.TITLE}</h2>
      <div className="container">
        {data.length === 0 ? (
          <p>{UI_CONTENT.MY_ORDERS.NO_ORDERS}</p>
        ) : (
          data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>
                {order.items.map((item: any, itemIndex: number) => {
                  if (itemIndex === order.items.length - 1) {
                    return item.name + ' x ' + item.quantity;
                  } else {
                    return item.name + ' x ' + item.quantity + ', ';
                  }
                })}
              </p>
              <p>₹{order.amount}.00</p>
              <p>{UI_CONTENT.MY_ORDERS.ITEMS_PREFIX}{order.items.length}</p>
              <p>
                <span>&#x25cf;</span> <b>{order.status}</b>
              </p>
              <button>{UI_CONTENT.MY_ORDERS.TRACK_ORDER_BTN}</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
