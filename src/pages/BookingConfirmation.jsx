import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  Download,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BookingContext } from "../context/BookingContext";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const { currentBooking } = useContext(BookingContext);

  useEffect(() => {
    if (!currentBooking) {
      navigate("/book");
    }
  }, [currentBooking, navigate]);

  if (!currentBooking) {
    return null;
  }

  // Format date
  const formatDate = (dateStr) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", options);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen py-16 px-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12 animate-slide-down">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-200 rounded-full blur opacity-75 animate-pulse"></div>
                <CheckCircle size={80} className="text-emerald-600 relative" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Your service booking has been successfully created
            </p>
            <p className="text-gray-500">
              We've sent confirmation details to your phone
            </p>
          </div>

          {/* Confirmation Card */}
          <div className="card shadow-medium mb-8 bg-white/80 backdrop-blur">
            {/* Booking ID Section */}
            <div className="bg-gradient-to-r from-cyan-50 via-teal-50 to-emerald-50 rounded-xl p-6 mb-8 border-2 border-cyan-200">
              <p className="text-sm text-gray-600 mb-2">Your Booking ID</p>
              <div className="flex items-center justify-between gap-4">
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent font-mono">
                  {currentBooking.id}
                </p>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(currentBooking.id)
                  }
                  className="px-4 py-2 bg-white border-2 border-cyan-200 rounded-lg hover:bg-cyan-50 transition text-sm font-semibold text-cyan-700"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-3">
                Save this ID to track your booking
              </p>
            </div>

            {/* Status Badge */}
            <div className="mb-8">
              <div className="flex items-center space-x-3">
                <div className="badge badge-pending flex items-center space-x-2">
                  <Clock size={16} />
                  <span>Status: {currentBooking.status}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Our team will contact you within 2 hours to confirm your
                appointment
              </p>
            </div>

            {/* Booking Details */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="font-bold text-lg mb-6">Booking Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">
                    Customer Name
                  </p>
                  <p className="text-lg text-gray-900 font-semibold">
                    {currentBooking.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">
                    Phone Number
                  </p>
                  <p className="text-lg text-gray-900 font-semibold">
                    {currentBooking.phone}
                  </p>
                </div>

                {/* Vehicle Info */}
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">
                    Vehicle Number
                  </p>
                  <p className="text-lg text-gray-900 font-semibold">
                    {currentBooking.vehicleNo}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">
                    Service Type
                  </p>
                  <p className="text-lg text-gray-900 font-semibold">
                    {currentBooking.service}
                  </p>
                </div>

                {/* Appointment Info */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock size={16} className="text-blue-600" />
                    <p className="text-sm text-gray-600 font-semibold">
                      Appointment Date
                    </p>
                  </div>
                  <p className="text-lg text-gray-900 font-semibold">
                    {formatDate(currentBooking.date)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock size={16} className="text-blue-600" />
                    <p className="text-sm text-gray-600 font-semibold">
                      Appointment Time
                    </p>
                  </div>
                  <p className="text-lg text-gray-900 font-semibold">
                    {currentBooking.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Service Center Info */}
            <div className="border-t border-gray-200 mt-8 pt-8">
              <h3 className="font-bold text-lg mb-4">Service Center Details</h3>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin
                    className="text-blue-600 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Main Service Center
                    </p>
                    <p className="text-gray-600">
                      123 Auto Street, Tech City, TC 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone
                    className="text-blue-600 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Contact</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock
                    className="text-blue-600 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Operating Hours
                    </p>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-gray-600">
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h4 className="font-bold text-blue-900 mb-3">Important Notes</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Please arrive 5-10 minutes before your appointment</li>
                <li>• Bring your vehicle documents and keys</li>
                <li>
                  • You can cancel or reschedule up to 24 hours before the
                  appointment
                </li>
                <li>
                  • Your booking is confirmed. You'll receive payment details
                  after service assessment
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              to="/track"
              className="btn-outline flex items-center justify-center space-x-2 flex-1"
            >
              <span>Track Booking</span>
              <ArrowRight size={20} />
            </Link>
            <button
              onClick={() => window.print()}
              className="btn-secondary flex items-center justify-center space-x-2 flex-1"
            >
              <Download size={20} />
              <span>Download Confirmation</span>
            </button>
          </div>

          {/* Return Home Link */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Or explore more services</p>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center space-x-2"
            >
              <span>Return to Home</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
