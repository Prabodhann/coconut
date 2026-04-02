import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Country, State, City } from "country-state-city";

const PlaceOrder = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
    phone: "",
  });

  const [selectedCountryIso, setSelectedCountryIso] = useState("IN");
  const [selectedStateIso, setSelectedStateIso] = useState("");

  const { getTotalCartAmount, token, foodList, cartItems, url, setCartItems } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleCountryChange = (e) => {
    const isoCode = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedCountryIso(isoCode);
    setData((prev) => ({ ...prev, country: name, state: "", city: "" }));
    setSelectedStateIso("");
  };

  const handleStateChange = (e) => {
    const isoCode = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedStateIso(isoCode);
    setData((prev) => ({ ...prev, state: name, city: "" }));
  };

  const handleCityChange = (e) => {
    setData((prev) => ({ ...prev, city: e.target.value }));
  };
  const placeOrder = async (e) => {
    e.preventDefault();

    let orderItems = [];
    Object.entries(cartItems).forEach(([itemId, quantity]) => {
      if (quantity > 0) {
        const item = foodList.find((food) => food._id === itemId);
        if (item) {
          orderItems.push({
            itemId,
            quantity,
            price: item.price,
            name: item.name,
          });
        }
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 5,
    };

    console.log("orderData", orderData);

    try {
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        toast.error(response.data.message || "Something Went Wrong");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("to place an order sign in first");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-field">
          <input
            type="text"
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            placeholder="First name"
            required
          />
          <input
            type="text"
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            placeholder="Last name"
            required
          />
        </div>
        <input
          type="email"
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          placeholder="Email address"
          required
        />
        <input
          type="text"
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          placeholder="Street"
          required
        />
        <div className="multi-field">
          <select
            name="city"
            onChange={handleCityChange}
            value={data.city}
            required
          >
            <option value="">Select City</option>
            {City.getCitiesOfState(selectedCountryIso, selectedStateIso).map(
              (city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ),
            )}
          </select>
          <select
            name="state"
            onChange={handleStateChange}
            value={selectedStateIso}
            required
          >
            <option value="">Select State</option>
            {State.getStatesOfCountry(selectedCountryIso).map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        <div className="multi-field">
          <input
            type="text"
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            placeholder="Zip code"
            required
          />
          <select
            name="country"
            onChange={handleCountryChange}
            value={selectedCountryIso}
            required
          >
            <option value="">Select Country</option>
            {Country.getAllCountries().map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          placeholder="Phone"
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 5}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}
              </b>
            </div>
          </div>
        </div>
        <button className="place-order-submit" type="submit">
          Proceed To Payment
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
