import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CONSTANTS } from '@/constants';
import './Verify.css';

const Verify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await axios.post(`${CONSTANTS.API_URL}/api/order/verify`, {
        success,
        orderId,
      });
      if (response.data.success) {
        navigate('/myorders');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      navigate('/');
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
