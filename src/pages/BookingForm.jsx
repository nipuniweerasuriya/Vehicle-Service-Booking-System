import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BookingContext } from "../context/BookingContext";
import {
  Calendar,
  Clock,
  Phone,
  User,
  Car,
  Wrench,
  AlertCircle,
} from "lucide-react";

export default function BookingForm() {
  const navigate = useNavigate();
  const { addBooking, services } = useContext(BookingContext);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicleNo: "",
    vehicleModel: "",
    service: "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      newErrors.phone = "Phone must be 10 digits";
    if (!formData.vehicleNo.trim())
      newErrors.vehicleNo = "Vehicle number is required";
    if (!formData.service) newErrors.service = "Please select a service";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";

    // Check if date is in the future
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.date = "Please select a future date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const booking = {
        name: formData.name,
        phone: formData.phone,
        vehicleNo: formData.vehicleNo,
        service: formData.service,
        date: formData.date,
        time: formData.time,
      };

      addBooking(booking);
      setSubmitted(true);

      setTimeout(() => {
        navigate("/confirmation");
      }, 1000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  // Get min date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Header />

      <main className="min-h-screen py-16 px-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="mb-12 text-center animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent mb-4">
              Book Your Service
            </h1>
            <p className="text-gray-600 text-lg">
              Fill in the details below to schedule your vehicle service
            </p>
          </div>

          {/* Form Card */}
          <div className="card shadow-medium bg-white/80 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2 pb-3 border-b-2 border-cyan-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <span className="text-gray-800">Personal Information</span>
                </h3>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`input-field ${errors.name ? "border-red-500 ring-red-500" : ""}`}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle size={16} />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className={`input-field ${errors.phone ? "border-red-500 ring-red-500" : ""}`}
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle size={16} />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Vehicle Information Section */}
              <div className="border-t border-cyan-200 pt-6">
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2 pb-3 border-b-2 border-cyan-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Car size={20} className="text-white" />
                  </div>
                  <span className="text-gray-800">Vehicle Information</span>
                </h3>

                <div className="space-y-4">
                  {/* Vehicle Number */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Vehicle Registration Number *
                    </label>
                    <input
                      type="text"
                      name="vehicleNo"
                      value={formData.vehicleNo}
                      onChange={handleChange}
                      placeholder="DL01AB1234"
                      className={`input-field ${errors.vehicleNo ? "border-red-500 ring-red-500" : ""}`}
                    />
                    {errors.vehicleNo && (
                      <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle size={16} />
                        <span>{errors.vehicleNo}</span>
                      </p>
                    )}
                  </div>

                  {/* Vehicle Model */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Vehicle Model (Optional)
                    </label>
                    <input
                      type="text"
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleChange}
                      placeholder="Honda Civic 2021"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Service Information Section */}
              <div className="border-t border-cyan-200 pt-6">
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2 pb-3 border-b-2 border-cyan-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Wrench size={20} className="text-white" />
                  </div>
                  <span className="text-gray-800">Service Details</span>
                </h3>

                <div className="space-y-4">
                  {/* Service Selection */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Select Service *
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className={`input-field ${errors.service ? "border-red-500 ring-red-500" : ""}`}
                    >
                      <option value="">-- Choose a service --</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.name}>
                          {service.name} - {service.price}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle size={16} />
                        <span>{errors.service}</span>
                      </p>
                    )}
                  </div>

                  {/* Date and Time Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} />
                          <span>Preferred Date *</span>
                        </div>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={today}
                        className={`input-field ${errors.date ? "border-red-500 ring-red-500" : ""}`}
                      />
                      {errors.date && (
                        <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                          <AlertCircle size={16} />
                          <span>{errors.date}</span>
                        </p>
                      )}
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        <div className="flex items-center space-x-2">
                          <Clock size={16} />
                          <span>Preferred Time *</span>
                        </div>
                      </label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className={`input-field ${errors.time ? "border-red-500 ring-red-500" : ""}`}
                      >
                        <option value="">-- Choose time --</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      {errors.time && (
                        <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                          <AlertCircle size={16} />
                          <span>{errors.time}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You'll receive a confirmation message
                  on your phone with your booking ID and appointment details.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitted}
                className={`w-full btn-primary py-4 text-lg font-bold ${submitted ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {submitted ? "Processing..." : "Complete Booking"}
              </button>

              <p className="text-center text-gray-600 text-sm">
                By booking, you agree to our terms and conditions
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
