import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Country, State, City } from "country-state-city";
import { useAppSelector } from "@/store/hooks";
import { UI_CONTENT } from "@/constants/uiContent";
import { CONSTANTS } from "@/constants";
import { motion } from "framer-motion";
import { MapPin, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

    const generatedOrderId = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 5,
      orderId: generatedOrderId,
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
    } catch {
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please sign in first to place an order");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, cartItems, navigate]);

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 5;
  const total = subtotal + deliveryFee;

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 min-h-[70vh]">
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={placeOrder} 
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
      >
        {/* Delivery Information */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="bg-orange-50 dark:bg-orange-500/10 p-3 rounded-full">
               <MapPin className="w-6 h-6 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{UI_CONTENT.PLACE_ORDER.TITLE}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              onChange={onChangeHandler}
              value={data.firstName}
              placeholder="First name"
              required
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow dark:text-white"
            />
            <input
              type="text"
              name="lastName"
              onChange={onChangeHandler}
              value={data.lastName}
              placeholder="Last name"
              required
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow dark:text-white"
            />
          </div>

          <input
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="Email address"
            required
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow dark:text-white"
          />

          <input
            type="text"
            name="street"
            onChange={onChangeHandler}
            value={data.street}
            placeholder="Street address"
            required
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow dark:text-white"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="country"
              onChange={handleCountryChange}
              value={selectedCountryIso}
              required
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow text-zinc-700 dark:text-zinc-300 appearance-none"
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>

            <select
              name="state"
              onChange={handleStateChange}
              value={selectedStateIso}
              required
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow text-zinc-700 dark:text-zinc-300 appearance-none"
            >
              <option value="">Select State</option>
              {State.getStatesOfCountry(selectedCountryIso).map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="city"
              onChange={handleCityChange}
              value={data.city}
              required
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow text-zinc-700 dark:text-zinc-300 appearance-none"
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
            
            <input
              type="text"
              name="zipcode"
              onChange={onChangeHandler}
              value={data.zipcode}
              placeholder={UI_CONTENT.PLACE_ORDER.ZIP_PLACEHOLDER}
              required
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow dark:text-white"
            />
          </div>

          <input
            type="text"
            name="phone"
            onChange={onChangeHandler}
            value={data.phone}
            placeholder={UI_CONTENT.PLACE_ORDER.PHONE_PLACEHOLDER}
            required
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow dark:text-white"
          />
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none sticky top-28">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-orange-50 dark:bg-orange-500/10 p-3 rounded-full">
                 <CreditCard className="w-6 h-6 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{UI_CONTENT.PLACE_ORDER.TOTAL_HEADER}</h2>
            </div>
            
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between items-center">
                <p>Subtotal</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">₹{subtotal}</p>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-800" />
              <div className="flex justify-between items-center">
                <p>Delivery Fee</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">₹{deliveryFee}</p>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-800" />
              <div className="flex justify-between items-center text-lg pt-2">
                <b className="text-zinc-900 dark:text-zinc-100">Total</b>
                <b className="text-orange-600 dark:text-orange-500 text-3xl font-bold">₹{total}</b>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full mt-10 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-full py-6 text-lg group shadow-lg hover:shadow-orange-500/25 transition-all"
            >
              {UI_CONTENT.PLACE_ORDER.PAYMENT_BUTTON}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-sm text-center text-zinc-400 mt-4">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default PlaceOrder;
