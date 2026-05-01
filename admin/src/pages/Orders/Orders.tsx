import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { url } from "../../assets/assets";
import { OrderItem } from "../../types";
import { ORDER_STATUSES, STATUS_COLOR_MAP } from "../../constants";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, RefreshCcw, Package, Hash, Calendar, X } from "lucide-react";
import SkeletonOrders from "../../components/SkeletonOrders/SkeletonOrders";

const Order: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("All");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const fetchAllOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while fetching orders");
    }
    setIsLoading(false);
  };

  const statusHandler = async (event: React.ChangeEvent<HTMLSelectElement>, orderId: string) => {
    const newStatus = event.target.value;

    // Optimistic UI Update
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order,
      ),
    );

    try {
      const response = await api.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus,
      });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Error updating order status. Reverting.");
        fetchAllOrders(); // Fetch valid data if operation failed natively
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while updating order status");
      fetchAllOrders(); // Safely revert
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (isLoading) {
    return <SkeletonOrders />;
  }

  const getStatusColor = (status: string) => {
    return STATUS_COLOR_MAP[status] || STATUS_COLOR_MAP["default"];
  };

  const validFilters = ["All", ...ORDER_STATUSES];
  const filteredOrders = orders.filter((order) => {
    const statusMatch = filter === "All" || order.status === filter;
    
    let dateMatch = true;
    if (showDatePicker) {
      const orderDate = new Date(order.date);
      if (dateRange.start) {
        const start = new Date(dateRange.start);
        start.setHours(0, 0, 0, 0);
        dateMatch = dateMatch && orderDate >= start;
      }
      if (dateRange.end) {
        const end = new Date(dateRange.end);
        end.setHours(23, 59, 59, 999);
        dateMatch = dateMatch && orderDate <= end;
      }
    }
    
    return statusMatch && dateMatch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-6xl mx-auto w-full"
    >
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">
            Order Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
            Track and update customer deliveries
          </p>
        </div>

        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <button
            onClick={fetchAllOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm rounded-lg text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            <RefreshCcw size={16} />
            <span className="text-sm font-medium">Refresh Database</span>
          </button>

          <div className="flex flex-wrap gap-2 w-full justify-end items-center">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors shadow-sm border border-gray-200 dark:border-slate-700 ${showDatePicker ? "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30" : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"}`}
            >
              <Calendar size={16} />
              {showDatePicker ? "Hide Dates" : "Date Filter"}
            </button>

            {validFilters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors shadow-sm border ${
                  filter === f
                    ? "bg-slate-800 text-white border-transparent dark:bg-orange-500 dark:text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <AnimatePresence>
            {showDatePicker && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex w-full justify-end overflow-hidden"
              >
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-1.5 mt-2 shadow-sm transition-colors">
                  <span className="text-xs text-gray-500 dark:text-gray-400 px-2 font-semibold tracking-wider uppercase">From</span>
                  <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="bg-gray-50 dark:bg-slate-800 text-sm border border-gray-200 dark:border-slate-700 outline-none text-gray-700 dark:text-gray-300 rounded px-2 py-1 appearance-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" 
                  />
                  <div className="w-[1px] h-6 bg-gray-200 dark:bg-slate-700 mx-1"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 px-2 font-semibold tracking-wider uppercase">To</span>
                  <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="bg-gray-50 dark:bg-slate-800 text-sm border border-gray-200 dark:border-slate-700 outline-none text-gray-700 dark:text-gray-300 rounded px-2 py-1 appearance-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" 
                  />
                  {(dateRange.start || dateRange.end) && (
                    <button 
                      onClick={() => setDateRange({ start: "", end: "" })}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors ml-1"
                      title="Clear Dates"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence>
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="min-w-[60px] max-w-[60px] h-[60px] bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-500/20">
                <Package className="text-orange-500" size={28} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="mb-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-gray-900 dark:text-gray-100 font-semibold truncate transition-colors">
                      {order.address.firstName + " " + order.address.lastName}
                    </h4>
                    <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-500 dark:text-slate-400 font-mono transition-colors">
                      <Hash size={12} />
                      {order.orderId || order._id.slice(-6).toUpperCase()}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed transition-colors mb-3">
                    <span className="font-medium text-gray-800 dark:text-gray-300 overflow-wrap-break-word">
                      Items:{" "}
                    </span>
                    {order.items.map((item, index) => (
                      <span key={index}>
                        {item.name} x {item.quantity}
                        {index < order.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  
                  <div className="inline-flex items-center justify-between gap-1.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md mb-2 shadow-sm transition-colors cursor-default">
                     <div className="flex items-center gap-1.5">
                       <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
                       {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                     </div>
                  </div>
                </div>

                <div className="space-y-2 mt-4 bg-gray-50/50 dark:bg-slate-950/50 p-3 rounded-lg border border-gray-100 dark:border-slate-800 transition-colors">
                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin
                      size={16}
                      className="shrink-0 mt-0.5 text-gray-400 dark:text-gray-500"
                    />
                    <p className="leading-tight">
                      {order.address.street}, {order.address.city},{" "}
                      {order.address.state}, {order.address.country},{" "}
                      {order.address.zipcode}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone
                      size={16}
                      className="shrink-0 text-gray-400 dark:text-gray-500"
                    />
                    <p>{order.address.phone}</p>
                  </div>
                </div>
              </div>

              <div className="md:w-48 shrink-0 flex flex-col justify-between pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 dark:border-slate-800 md:pl-6 gap-4 transition-colors">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Order Total
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-0.5 transition-colors">
                    ₹{order.amount}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {order.items.length} item(s)
                  </p>
                </div>

                <div className="mt-auto">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider transition-colors">
                    Status
                  </p>
                  <select
                    onChange={(e) => statusHandler(e, order._id)}
                    value={order.status}
                    className={`w-full text-sm font-medium px-3 py-2 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${getStatusColor(order.status)}`}
                  >
                    {ORDER_STATUSES.map(status => (
                      <option
                        key={status}
                        value={status}
                        className="text-gray-900 bg-white"
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredOrders.length === 0 && !isLoading && (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 transition-colors">
            <Package
              size={48}
              className="mx-auto text-gray-300 dark:text-gray-700 mb-4"
            />
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
              No Orders Match!
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Try changing your filter settings.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Order;
