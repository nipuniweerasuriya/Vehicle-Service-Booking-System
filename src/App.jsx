import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

// Context
import { AuthContext } from "./context/AuthContext";
import { BookingContext } from "./context/BookingContext";

// Pages
import Home from "./pages/Home";
import ServiceList from "./pages/ServiceList";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from "./pages/BookingConfirmation";
import TrackBooking from "./pages/TrackBooking";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageBookings from "./pages/ManageBookings";
import ServiceManagement from "./pages/ServiceManagement";

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [bookings, setBookings] = useState([
    {
      id: "BK001",
      name: "John Doe",
      phone: "9876543210",
      vehicleNo: "DL01AB1234",
      service: "Regular Maintenance",
      date: "2026-02-15",
      time: "10:00 AM",
      status: "Pending",
      createdAt: "2026-02-09",
    },
    {
      id: "BK002",
      name: "Jane Smith",
      phone: "9876543211",
      vehicleNo: "DL01AB1235",
      service: "Oil Change",
      date: "2026-02-12",
      time: "2:00 PM",
      status: "Approved",
      createdAt: "2026-02-08",
    },
    {
      id: "BK003",
      name: "Robert Johnson",
      phone: "9876543212",
      vehicleNo: "DL01AB1236",
      service: "Brake Check",
      date: "2026-02-10",
      time: "9:00 AM",
      status: "Completed",
      createdAt: "2026-02-05",
    },
  ]);

  const [currentBooking, setCurrentBooking] = useState(null);

  const [services, setServices] = useState([
    {
      id: 1,
      name: "Regular Maintenance",
      description: "Complete vehicle check and maintenance",
      price: "$99",
      icon: "Wrench",
    },
    {
      id: 2,
      name: "Oil Change",
      description: "Engine oil and filter replacement",
      price: "$49",
      icon: "Droplet",
    },
    {
      id: 3,
      name: "Brake Check",
      description: "Brake pad inspection and service",
      price: "$79",
      icon: "Zap",
    },
    {
      id: 4,
      name: "Tire Rotation",
      description: "Tire balancing and rotation",
      price: "$69",
      icon: "Disc3",
    },
    {
      id: 5,
      name: "Battery Service",
      description: "Battery check and replacement",
      price: "$89",
      icon: "Battery",
    },
    {
      id: 6,
      name: "AC Service",
      description: "Air conditioning refill and maintenance",
      price: "$129",
      icon: "Wind",
    },
  ]);

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: `BK${String(bookings.length + 1).padStart(3, "0")}`,
      status: "Pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBookings([...bookings, newBooking]);
    setCurrentBooking(newBooking);
    return newBooking;
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(
      bookings.map((b) =>
        b.id === bookingId ? { ...b, status: newStatus } : b,
      ),
    );
  };

  const addService = (service) => {
    const newService = {
      ...service,
      id: services.length + 1,
    };
    setServices([...services, newService]);
  };

  const useCheckAdminAuth = () => {
    return isAdminLoggedIn;
  };

  const ProtectedRoute = ({ children }) => {
    return isAdminLoggedIn ? children : <Navigate to="/admin/login" />;
  };

  return (
    <AuthContext.Provider
      value={{ isAdminLoggedIn, setIsAdminLoggedIn, useCheckAdminAuth }}
    >
      <BookingContext.Provider
        value={{
          bookings,
          setBookings,
          currentBooking,
          setCurrentBooking,
          addBooking,
          updateBookingStatus,
          services,
          setServices,
          addService,
        }}
      >
        <Router>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServiceList />} />
            <Route path="/book" element={<BookingForm />} />
            <Route path="/confirmation" element={<BookingConfirmation />} />
            <Route path="/track" element={<TrackBooking />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
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
              element={
                <ProtectedRoute>
                  <ManageBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute>
                  <ServiceManagement />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </BookingContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
