import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

import { AuthContext, AuthProvider } from "./context/AuthContext";
import { BookingContext } from "./context/BookingContext";

import { bookingsAPI, servicesAPI, authAPI } from "./api";

import Home from "./pages/Home";
import ServiceList from "./pages/ServiceList";
import BookingConfirmation from "./pages/BookingConfirmation";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import Reviews from "./pages/Reviews";

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      setIsAdminLoggedIn(true);
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log("Fetching services...");
        const response = await servicesAPI.getAll();
        console.log("Services response:", response);
        console.log("Services data:", response.data);
        setServices(response.data);
        console.log("Services set to state");
      } catch (error) {
        console.error("Error fetching services:", error);
        console.log("Falling back to hardcoded services");
        setServices([
          {
            _id: "1",
            name: "Regular Maintenance",
            description: "Complete vehicle check and maintenance",
            price: "$99",
            icon: "Wrench",
          },
          {
            _id: "2",
            name: "Oil Change",
            description: "Engine oil and filter replacement",
            price: "$49",
            icon: "Droplet",
          },
          {
            _id: "3",
            name: "Brake Check",
            description: "Brake pad inspection and service",
            price: "$79",
            icon: "Zap",
          },
          {
            _id: "4",
            name: "Tire Rotation",
            description: "Tire balancing and rotation",
            price: "$69",
            icon: "Disc3",
          },
          {
            _id: "5",
            name: "Battery Service",
            description: "Battery check and replacement",
            price: "$89",
            icon: "Battery",
          },
          {
            _id: "6",
            name: "AC Service",
            description: "Air conditioning refill and maintenance",
            price: "$129",
            icon: "Wind",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getAll();
      setBookings(
        response.data.map((b) => ({
          id: b.bookingId,
          name: b.customerName,
          phone: b.phone,
          vehicleNo: b.vehicleNumber,
          service: b.serviceType,
          date: b.date,
          time: b.time,
          status: b.status,
          createdAt: b.createdAt?.split("T")[0] || b.createdAt,
        })),
      );
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchBookings();
    }
  }, [isAdminLoggedIn]);

  const addBooking = async (booking) => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    try {
      const response = await bookingsAPI.create({
        customerName: booking.name,
        phone: booking.phone,
        vehicleNumber: booking.vehicleNo,
        serviceType: booking.service,
        servicePrice: booking.servicePrice,
        date: booking.date,
        time: booking.time,
        userId: user?._id || null,
      });

      const newBooking = {
        id: response.data.bookingId,
        name: response.data.customerName,
        phone: response.data.phone,
        vehicleNo: response.data.vehicleNumber,
        service: response.data.serviceType,
        servicePrice: response.data.servicePrice,
        date: response.data.date,
        time: response.data.time,
        status: response.data.status,
        createdAt:
          response.data.createdAt?.split("T")[0] || response.data.createdAt,
      };

      setBookings([newBooking, ...bookings]);
      setCurrentBooking(newBooking);
      return newBooking;
    } catch (error) {
      console.error("Error creating booking:", error);
      const newBooking = {
        ...booking,
        id: `BK${String(bookings.length + 1).padStart(3, "0")}`,
        status: "Pending",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setBookings([newBooking, ...bookings]);
      setCurrentBooking(newBooking);
      return newBooking;
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingsAPI.updateStatus(bookingId, newStatus);
      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus } : b,
        ),
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus } : b,
        ),
      );
    }
  };

  const addService = async (service) => {
    try {
      const response = await servicesAPI.create(service);
      setServices([...services, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error creating service:", error);
      const newService = {
        ...service,
        _id: String(services.length + 1),
      };
      setServices([...services, newService]);
      return newService;
    }
  };

  const deleteService = async (serviceId) => {
    try {
      await servicesAPI.delete(serviceId);
      setServices(services.filter((s) => s._id !== serviceId));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const useCheckAdminAuth = () => {
    return isAdminLoggedIn;
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setIsAdminLoggedIn(false);
    setBookings([]);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const ProtectedRoute = ({ children }) => {
    return isAdminLoggedIn ? children : <Navigate to="/signin" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        useCheckAdminAuth,
        logout,
        user,
        setUser,
        isUserLoggedIn: !!user,
        login,
        logoutUser,
      }}
    >
      <BookingContext.Provider
        value={{
          bookings,
          setBookings,
          currentBooking,
          setCurrentBooking,
          addBooking,
          updateBookingStatus,
          fetchBookings,
          services,
          setServices,
          addService,
          deleteService,
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServiceList />} />
            <Route path="/confirmation" element={<BookingConfirmation />} />

            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/reviews" element={<Reviews />} />

            <Route
              path="/admin/login"
              element={<Navigate to="/signin" replace />}
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/bookings"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="/admin/services"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="/admin/users"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="/admin/reviews"
              element={<Navigate to="/admin/dashboard" replace />}
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </BookingContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
