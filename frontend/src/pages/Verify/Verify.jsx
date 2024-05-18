// import axios from 'axios';
// import React, { useContext, useEffect } from 'react'
// import { useNavigate, useSearchParams } from 'react-router-dom'
// import { StoreContext } from '../../Context/StoreContext';
// import './Verify.css'

// const Verify = () => {
//   const { url } = useContext(StoreContext)
//   const [searchParams, setSearchParams] = useSearchParams();
//   const success = searchParams.get("success")
//   const orderId = searchParams.get("orderId")

//   const navigate = useNavigate();

//   const verifyPayment = async () => {
//     const response = await axios.post(url + "/api/order/verify", { success, orderId });
//     if (response.data.success) {
//       navigate("/myorders");
//     }
//     else {
//       navigate("/")
//     }
//   }

//   useEffect(() => {
//     verifyPayment();
//   }, [])

//   return (
//     <div className='verify'>
//       <div className="spinner"></div>
//     </div>
//   )
// }

// export default Verify
import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import './Verify.css';

const Verify = () => {
  const { url } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  const navigate = useNavigate();

  const verifyPayment = async () => {
    console.log('Verifying payment...'); // Log start of function
    console.log('Request data:', { success, orderId }); // Log request data
    try {
      const response = await axios.post(url + '/api/order/verify', {
        success,
        orderId,
      });
      console.log('Response from server:', response.data); // Log response from server
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
