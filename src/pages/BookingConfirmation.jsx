import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  Download,
  Calendar,
  Car,
  Wrench,
  User,
  Copy,
  Sparkles,
  Home,
  Search,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BookingContext } from "../context/BookingContext";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const { currentBooking } = useContext(BookingContext);

  useEffect(() => {
    if (!currentBooking) {
      navigate("/services");
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentBooking.id);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen py-16 px-4 bg-gradient-mesh">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-10 animate-scale-in">
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute w-24 h-24 bg-emerald-400/30 rounded-full animate-ping"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30">
                <CheckCircle size={40} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3">
              <span className="gradient-text">Booking Confirmed!</span>
            </h1>
            <p className="text-xl text-slate-600 mb-1">
              Your service booking has been successfully created
            </p>
            <p className="text-slate-500">
              We've sent confirmation details to your phone
            </p>
          </div>

          {/* Confirmation Card */}
          <div className="glass-card p-0 overflow-hidden mb-8 animate-fade-in">
            {/* Booking ID Header */}
            <div className="bg-gradient-to-r from-sky-500 to-cyan-500 p-6 text-white">
              <p className="text-sky-100 text-sm font-medium mb-2">
                Your Booking ID
              </p>
              <div className="flex items-center justify-between gap-4">
                <p className="text-3xl font-bold font-mono tracking-wider">
                  {currentBooking.id}
                </p>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Copy size={16} />
                  Copy
                </button>
              </div>
              <p className="text-sky-100 text-sm mt-3">
                Save this ID to track your booking
              </p>
            </div>

            <div className="p-6">
              {/* Status Badge */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-medium">
                  <Clock size={18} />
                  Status: {currentBooking.status}
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Our team will contact you within 2 hours to confirm your
                  appointment
                </p>
              </div>

              {/* Booking Details Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Customer Info */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User size={18} className="text-sky-500" />
                    <span className="font-bold text-slate-900">Customer</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {currentBooking.name}
                  </p>
                  <p className="text-slate-600">{currentBooking.phone}</p>
                </div>

                {/* Vehicle Info */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Car size={18} className="text-sky-500" />
                    <span className="font-bold text-slate-900">Vehicle</span>
                  </div>
                  <p className="text-lg font-semibold font-mono text-slate-900">
                    {currentBooking.vehicleNo}
                  </p>
                  <p className="text-slate-600">
                    {currentBooking.vehicleModel || "N/A"}
                  </p>
                </div>

                {/* Service Info */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench size={18} className="text-sky-500" />
                    <span className="font-bold text-slate-900">Service</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {currentBooking.service}
                  </p>
                  <p className="text-sky-600 font-bold">
                    {currentBooking.servicePrice || "Contact for price"}
                  </p>
                </div>

                {/* Appointment Info */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={18} className="text-sky-500" />
                    <span className="font-bold text-slate-900">
                      Appointment
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatDate(currentBooking.date)}
                  </p>
                  <p className="text-slate-600">{currentBooking.time}</p>
                </div>
              </div>

              {/* Service Center Info */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-sky-500" />
                  Service Center Details
                </h3>

                <div className="bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-sky-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Main Service Center
                      </p>
                      <p className="text-slate-600">
                        123 Auto Street, Tech City, TC 12345
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone size={20} className="text-sky-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Contact</p>
                      <p className="text-slate-600">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock size={20} className="text-sky-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Operating Hours
                      </p>
                      <p className="text-slate-600">
                        Mon - Fri: 9:00 AM - 6:00 PM
                      </p>
                      <p className="text-slate-600">
                        Saturday: 10:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <Sparkles size={18} />
                  Important Notes
                </h4>
                <ul className="space-y-2 text-sm text-amber-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                    Please arrive 5-10 minutes before your appointment
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                    Bring your vehicle documents and keys
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                    You can cancel or reschedule up to 24 hours before the
                    appointment
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                    Payment details will be provided after service assessment
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              to="/track"
              className="btn-primary flex items-center justify-center gap-2 flex-1"
            >
              <Search size={20} />
              Track Booking
            </Link>
            <button
              onClick={() => window.print()}
              className="btn-secondary flex items-center justify-center gap-2 flex-1"
            >
              <Download size={20} />
              Download
            </button>
          </div>

          {/* Return Home Link */}
          <div className="text-center">
            <p className="text-slate-500 mb-4">Or explore more services</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-semibold transition-colors group"
            >
              <Home size={18} />
              Return to Home
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
