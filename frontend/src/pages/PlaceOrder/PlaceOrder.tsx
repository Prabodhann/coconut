import React, { useEffect, useState } from "react";
import "./PlaceOrder.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Country, State, City } from "country-state-city";
import { useAppSelector } from "@/store/hooks";
import { UI_CONTENT } from "@/constants/uiContent";
import { CONSTANTS } from "@/constants";

const PlaceOrder: React.FC = () => {
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

  const { items: cartItems } = useAppSelector(state => state.cart);
  const { list: foodList } = useAppSelector(state => state.food);
  const { token } = useAppSelector(state => state.auth);

  const navigate = useNavigate();

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = foodList.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isoCode = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedCountryIso(isoCode);
    setData((prev) => ({ ...prev, country: name, state: "", city: "" }));
    setSelectedStateIso("");
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isoCode = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedStateIso(isoCode);
    setData((prev) => ({ ...prev, state: name, city: "" }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setData((prev) => ({ ...prev, city: e.target.value }));
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderItems: any[] = [];
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

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 5,
    };

    try {
      const response = await axios.post(CONSTANTS.API_URL + "/api/order/place", orderData, {
        headers: { token },
      });

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        toast.error(response.data.message || "Something Went Wrong");
      }
    } catch (error) {
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
  }, [token, cartItems, navigate]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">{UI_CONTENT.PLACE_ORDER.TITLE}</p>
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
            placeholder={UI_CONTENT.PLACE_ORDER.ZIP_PLACEHOLDER}
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
          placeholder={UI_CONTENT.PLACE_ORDER.PHONE_PLACEHOLDER}
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>{UI_CONTENT.PLACE_ORDER.TOTAL_HEADER}</h2>
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
          {UI_CONTENT.PLACE_ORDER.PAYMENT_BUTTON}
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
