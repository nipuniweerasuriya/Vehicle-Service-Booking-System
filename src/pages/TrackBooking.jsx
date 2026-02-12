import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  Wrench,
  Package,
  ArrowRight,
  Sparkles,
  Shield,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Timer,
  ListChecks,
  Info,
  DollarSign,
  MapPin,
  X,
  RefreshCw,
  Filter,
  Grid3X3,
  List,
  Eye,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { bookingsAPI } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function TrackBooking() {
  const { isUserLoggedIn } = useContext(AuthContext);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // All bookings state
  const [allBookings, setAllBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Fetch all bookings on component mount
  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    setLoadingBookings(true);
    try {
      const response = await bookingsAPI.getAll();
      const bookings = response.data.map((booking) => ({
        id: booking.bookingId,
        name: booking.customerName,
        phone: booking.phone,
        vehicleNo: booking.vehicleNumber,
        vehicleModel: booking.vehicleModel || "N/A",
        service: booking.serviceType,
        servicePrice: booking.servicePrice || "$0",
        date: booking.date,
        time: booking.time,
        status: booking.status,
        createdAt: booking.createdAt?.split("T")[0] || booking.createdAt,
      }));
      setAllBookings(bookings);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Filter bookings by status
  const filteredBookings =
    statusFilter === "All"
      ? allBookings
      : allBookings.filter((b) => b.status === statusFilter);

  // Status counts for filter badges
  const statusCounts = {
    All: allBookings.length,
    Pending: allBookings.filter((b) => b.status === "Pending").length,
    Approved: allBookings.filter((b) => b.status === "Approved").length,
    Completed: allBookings.filter((b) => b.status === "Completed").length,
  };

  // Service details data mapping
  const getServiceDetails = (serviceName) => {
    const serviceData = {
      "Oil Change": {
        duration: "30-45 mins",
        description: "Complete oil change service with premium synthetic oil",
        includes: [
          "Drain old oil completely",
          "Replace oil filter",
          "Add premium synthetic oil",
          "Check fluid levels",
          "Multi-point inspection",
        ],
        notes:
          "We use only top-quality synthetic oils for optimal engine performance.",
      },
      "Full Service": {
        duration: "2-3 hours",
        description: "Comprehensive vehicle service covering all major systems",
        includes: [
          "Oil and filter change",
          "Air filter replacement",
          "Brake inspection",
          "Tire rotation",
          "Fluid top-ups",
          "Battery check",
          "50-point inspection",
        ],
        notes: "Recommended every 12,000 miles or annually.",
      },
      "Brake Service": {
        duration: "1-2 hours",
        description: "Complete brake system inspection and service",
        includes: [
          "Brake pad inspection/replacement",
          "Rotor inspection",
          "Brake fluid check",
          "Brake line inspection",
          "Caliper inspection",
        ],
        notes: "Critical for your safety. We use OEM-quality brake components.",
      },
      "Tire Service": {
        duration: "45-60 mins",
        description: "Complete tire service including rotation and balancing",
        includes: [
          "Tire rotation",
          "Wheel balancing",
          "Pressure adjustment",
          "Tread depth check",
          "Alignment check",
        ],
        notes: "Regular rotation extends tire life by up to 30%.",
      },
      "Battery Replacement": {
        duration: "20-30 mins",
        description: "Battery testing and replacement service",
        includes: [
          "Battery health test",
          "Terminal cleaning",
          "New battery installation",
          "Electrical system check",
          "Old battery recycling",
        ],
        notes: "Includes free battery testing and 2-year warranty.",
      },
      "AC Service": {
        duration: "1-1.5 hours",
        description: "Air conditioning system service and recharge",
        includes: [
          "AC performance test",
          "Refrigerant recharge",
          "Leak detection",
          "Compressor check",
          "Cabin filter replacement",
        ],
        notes: "Ensures optimal cooling performance for summer months.",
      },
    };
    return (
      serviceData[serviceName] || {
        duration: "1-2 hours",
        description: "Professional vehicle service",
        includes: [
          "Complete inspection",
          "Parts replacement as needed",
          "Quality assurance check",
        ],
        notes: "Our certified technicians ensure quality workmanship.",
      }
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setSearched(true);
    setLoading(true);

    if (!searchValue.trim()) {
      setError("Please enter your booking ID");
      setLoading(false);
      return;
    }

    try {
      const response = await bookingsAPI.getById(
        searchValue.trim().toUpperCase(),
      );
      const booking = response.data;

      setSearchResult({
        id: booking.bookingId,
        name: booking.customerName,
        phone: booking.phone,
        vehicleNo: booking.vehicleNumber,
        vehicleModel: booking.vehicleModel || "N/A",
        service: booking.serviceType,
        servicePrice: booking.servicePrice || "$0",
        date: booking.date,
        time: booking.time,
        status: booking.status,
        createdAt: booking.createdAt?.split("T")[0] || booking.createdAt,
      });
    } catch (err) {
      setError("No booking found with this ID. Please check and try again.");
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: Clock,
          label: "Pending Review",
        };
      case "Approved":
        return {
          bg: "bg-sky-100",
          text: "text-sky-700",
          border: "border-sky-200",
          icon: Shield,
          label: "Approved",
        };
      case "Completed":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: CheckCircle,
          label: "Completed",
        };
      default:
        return {
          bg: "bg-slate-100",
          text: "text-slate-700",
          border: "border-slate-200",
          icon: Clock,
          label: status,
        };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", options);
  };

  const timelineSteps = searchResult
    ? [
        {
          step: "Booking Received",
          description: "Your booking has been submitted",
          completed: true,
          current: searchResult.status === "Pending",
          icon: FileText,
        },
        {
          step: "Under Review",
          description: "Our team is reviewing your request",
          completed: searchResult.status !== "Pending",
          current: false,
          icon: Search,
        },
        {
          step: "Approved",
          description: "Booking confirmed and scheduled",
          completed: ["Approved", "Completed"].includes(searchResult.status),
          current: searchResult.status === "Approved",
          icon: Shield,
        },
        {
          step: "Service Completed",
          description: "Your vehicle has been serviced",
          completed: searchResult.status === "Completed",
          current: false,
          icon: CheckCircle,
        },
      ]
    : [];

  return (
    <>
      <Header />

      <main className="min-h-screen py-16 px-4 bg-gradient-mesh">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-12 text-center animate-fade-in">
            <div className="mb-4 inline-block">
              <span className="bg-gradient-to-r from-sky-100 to-cyan-100 px-5 py-2 rounded-full text-sm font-bold text-sky-700">
                Track Status
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Track Your Booking</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Enter your booking ID to check the real-time status of your
              service
            </p>
          </div>

          {/* Search Section */}
          <div className="glass-card p-8 mb-8 animate-fade-in">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Package size={20} />
                  </div>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value.toUpperCase());
                      setError("");
                    }}
                    placeholder="Enter Booking ID (e.g., BK1234567890)"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl text-lg font-mono
                             focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300
                             placeholder:text-slate-400 placeholder:font-sans"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-8 py-4 text-lg flex items-center justify-center gap-2 min-w-[160px]"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search size={20} />
                      Track
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && searched && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                  <AlertCircle
                    className="text-red-500 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <p className="text-red-700 font-medium">{error}</p>
                    <p className="text-red-600 text-sm mt-1">
                      Make sure you entered the correct booking ID from your
                      confirmation.
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* All Bookings Section */}
          {!searchResult && (
            <div className="mb-8 animate-fade-in">
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText size={24} className="text-sky-500" />
                    All Bookings
                  </h2>
                  <p className="text-slate-600 mt-1">
                    View and track all service bookings
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-white shadow text-sky-600" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      <Grid3X3 size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow text-sky-600" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      <List size={18} />
                    </button>
                  </div>
                  {/* Refresh Button */}
                  <button
                    onClick={fetchAllBookings}
                    disabled={loadingBookings}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                  >
                    <RefreshCw
                      size={18}
                      className={loadingBookings ? "animate-spin" : ""}
                    />
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["All", "Pending", "Approved", "Completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2
                      ${
                        statusFilter === status
                          ? status === "Pending"
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                            : status === "Approved"
                              ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                              : status === "Completed"
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                : "bg-slate-800 text-white shadow-lg shadow-slate-800/30"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    {status}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        statusFilter === status ? "bg-white/20" : "bg-slate-200"
                      }`}
                    >
                      {statusCounts[status]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Loading State */}
              {loadingBookings ? (
                <div className="glass-card p-12 text-center">
                  <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-600">Loading bookings...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <Package size={48} className="mx-auto mb-4 text-slate-300" />
                  <h3 className="text-xl font-bold text-slate-700 mb-2">
                    No Bookings Found
                  </h3>
                  <p className="text-slate-500">
                    {statusFilter !== "All"
                      ? `No ${statusFilter.toLowerCase()} bookings available.`
                      : "There are no bookings in the system yet."}
                  </p>
                </div>
              ) : viewMode === "grid" ? (
                /* Grid View */
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className="glass-card p-0 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                    >
                      {/* Status Banner */}
                      <div
                        className={`px-4 py-2 ${getStatusConfig(booking.status).bg}`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-bold ${getStatusConfig(booking.status).text} flex items-center gap-1`}
                          >
                            {(() => {
                              const StatusIcon = getStatusConfig(
                                booking.status,
                              ).icon;
                              return <StatusIcon size={14} />;
                            })()}
                            {getStatusConfig(booking.status).label}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatDate(booking.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        {/* Booking ID */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-sm font-bold text-sky-600">
                            {booking.id}
                          </span>
                          <Eye
                            size={16}
                            className="text-slate-400 group-hover:text-sky-500 transition-colors"
                          />
                        </div>

                        {/* Service Info */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                            <Wrench size={18} className="text-sky-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                              {booking.service}
                            </p>
                            <p className="text-sm text-sky-600 font-bold">
                              {booking.servicePrice}
                            </p>
                          </div>
                        </div>

                        {/* Customer & Vehicle */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <User size={14} className="flex-shrink-0" />
                            <span className="truncate">{booking.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Car size={14} className="flex-shrink-0" />
                            <span className="font-mono">
                              {booking.vehicleNo}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar size={14} className="flex-shrink-0" />
                            <span>
                              {formatDate(booking.date)} at {booking.time}
                            </span>
                          </div>
                        </div>

                        {/* View Details Hint */}
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <span className="text-xs text-sky-500 flex items-center gap-1">
                            <Eye size={12} /> Click to view full details
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="glass-card p-0 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Booking ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Vehicle
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredBookings.map((booking) => (
                          <tr
                            key={booking.id}
                            className="hover:bg-sky-50/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <td className="px-4 py-4">
                              <span className="font-mono text-sm font-bold text-sky-600">
                                {booking.id}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {booking.name}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {booking.phone}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div>
                                <p className="font-medium text-slate-900">
                                  {booking.service}
                                </p>
                                <p className="text-sm text-sky-600 font-bold">
                                  {booking.servicePrice}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div>
                                <p className="font-mono font-semibold text-slate-900">
                                  {booking.vehicleNo}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {booking.vehicleModel}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div>
                                <p className="text-slate-900">
                                  {formatDate(booking.date)}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {booking.time}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusConfig(booking.status).bg} ${getStatusConfig(booking.status).text}`}
                              >
                                {getStatusConfig(booking.status).label}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <button className="p-2 hover:bg-sky-100 rounded-lg transition-colors text-sky-600">
                                <Eye size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selected Booking Modal */}
          {selectedBooking && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
              onClick={() => setSelectedBooking(null)}
            >
              <div
                className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-sky-500 to-cyan-500 p-6 text-white rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sky-100 text-sm">Booking Details</p>
                      <h3 className="text-2xl font-bold font-mono">
                        {selectedBooking.id}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-4 py-2 rounded-xl ${getStatusConfig(selectedBooking.status).bg} ${getStatusConfig(selectedBooking.status).text} font-bold flex items-center gap-2`}
                      >
                        {(() => {
                          const StatusIcon = getStatusConfig(
                            selectedBooking.status,
                          ).icon;
                          return <StatusIcon size={18} />;
                        })()}
                        {getStatusConfig(selectedBooking.status).label}
                      </span>
                      <button
                        onClick={() => setSelectedBooking(null)}
                        className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Progress Timeline */}
                  <div className="bg-slate-50 rounded-xl p-5">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Sparkles size={18} className="text-sky-500" />
                      Progress Timeline
                    </h4>
                    <div className="flex items-center justify-between">
                      {[
                        { step: "Received", status: "Pending" },
                        { step: "Approved", status: "Approved" },
                        { step: "Completed", status: "Completed" },
                      ].map((item, idx) => {
                        const isActive =
                          item.status === "Pending" ||
                          (item.status === "Approved" &&
                            ["Approved", "Completed"].includes(
                              selectedBooking.status,
                            )) ||
                          (item.status === "Completed" &&
                            selectedBooking.status === "Completed");
                        return (
                          <div key={idx} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}
                              >
                                {isActive ? (
                                  <CheckCircle size={20} />
                                ) : (
                                  <Clock size={20} />
                                )}
                              </div>
                              <span
                                className={`text-sm mt-2 font-medium ${isActive ? "text-emerald-700" : "text-slate-400"}`}
                              >
                                {item.step}
                              </span>
                            </div>
                            {idx < 2 && (
                              <div
                                className={`h-1 flex-1 ${isActive && idx === 0 ? "bg-emerald-500" : isActive && selectedBooking.status === "Completed" ? "bg-emerald-500" : "bg-slate-200"}`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Service Details */}
                    <div className="bg-slate-50 rounded-xl p-5">
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Wrench size={18} className="text-sky-500" />
                        Service Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Service</span>
                          <span className="font-semibold text-slate-900">
                            {selectedBooking.service}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Price</span>
                          <span className="font-bold text-sky-600">
                            {selectedBooking.servicePrice}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Duration</span>
                          <span className="font-medium text-slate-700">
                            {
                              getServiceDetails(selectedBooking.service)
                                .duration
                            }
                          </span>
                        </div>
                      </div>

                      {/* What's Included */}
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm font-medium text-slate-700 mb-2">
                          What's Included:
                        </p>
                        <ul className="space-y-1">
                          {getServiceDetails(selectedBooking.service)
                            .includes.slice(0, 4)
                            .map((item, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-slate-600 flex items-center gap-2"
                              >
                                <CheckCircle
                                  size={12}
                                  className="text-emerald-500"
                                />
                                {item}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="bg-slate-50 rounded-xl p-5">
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Calendar size={18} className="text-sky-500" />
                        Appointment
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Date</span>
                          <span className="font-semibold text-slate-900">
                            {formatDate(selectedBooking.date)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Time</span>
                          <span className="font-semibold text-slate-900">
                            {selectedBooking.time}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Booked On</span>
                          <span className="font-medium text-slate-700">
                            {formatDate(selectedBooking.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="bg-slate-50 rounded-xl p-5">
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Car size={18} className="text-sky-500" />
                        Vehicle Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Vehicle No.</span>
                          <span className="font-mono font-bold text-slate-900">
                            {selectedBooking.vehicleNo}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Model</span>
                          <span className="font-semibold text-slate-900">
                            {selectedBooking.vehicleModel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div className="bg-slate-50 rounded-xl p-5">
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <User size={18} className="text-sky-500" />
                        Customer Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Name</span>
                          <span className="font-semibold text-slate-900">
                            {selectedBooking.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Phone</span>
                          <span className="font-semibold text-slate-900">
                            {selectedBooking.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Note */}
                  <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl p-4 border border-sky-200">
                    <div className="flex items-start gap-3">
                      <Info
                        className="text-sky-600 flex-shrink-0 mt-1"
                        size={20}
                      />
                      <div>
                        <p className="font-semibold text-sky-800 mb-1">
                          Service Note
                        </p>
                        <p className="text-sm text-sky-700">
                          {getServiceDetails(selectedBooking.service).notes}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 rounded-b-2xl">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                    >
                      Close
                    </button>
                    <a
                      href="tel:+15551234567"
                      className="flex-1 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors text-center flex items-center justify-center gap-2"
                    >
                      <Phone size={18} />
                      Call Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Result */}
          {searchResult && (
            <div className="animate-scale-in space-y-6">
              {/* Status Header Card */}
              <div className="glass-card p-0 overflow-hidden">
                <div className="bg-gradient-to-r from-sky-500 to-cyan-500 p-6 text-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-sky-100 text-sm font-medium mb-1">
                        Booking ID
                      </p>
                      <p className="text-3xl font-bold font-mono tracking-wider">
                        {searchResult.id}
                      </p>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-xl ${getStatusConfig(searchResult.status).bg} ${getStatusConfig(searchResult.status).text} font-bold text-lg flex items-center gap-2`}
                    >
                      {(() => {
                        const StatusIcon = getStatusConfig(
                          searchResult.status,
                        ).icon;
                        return <StatusIcon size={20} />;
                      })()}
                      {getStatusConfig(searchResult.status).label}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Status Timeline */}
                  <div className="mb-8">
                    <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                      <Sparkles size={20} className="text-sky-500" />
                      Progress Timeline
                    </h3>
                    <div className="relative">
                      {/* Progress Line */}
                      <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200" />
                      <div
                        className="absolute left-6 top-8 w-0.5 bg-gradient-to-b from-emerald-500 to-sky-500 transition-all duration-500"
                        style={{
                          height: `${(timelineSteps.filter((s) => s.completed).length / timelineSteps.length) * 100}%`,
                          maxHeight: "calc(100% - 64px)",
                        }}
                      />

                      <div className="space-y-6">
                        {timelineSteps.map((item, idx) => {
                          const StepIcon = item.icon;
                          return (
                            <div
                              key={idx}
                              className="flex items-start gap-4 relative"
                            >
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300 ${
                                  item.completed
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                    : item.current
                                      ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30 animate-pulse"
                                      : "bg-slate-200 text-slate-400"
                                }`}
                              >
                                <StepIcon size={20} />
                              </div>
                              <div className="pt-2">
                                <p
                                  className={`font-bold ${
                                    item.completed
                                      ? "text-emerald-700"
                                      : item.current
                                        ? "text-sky-700"
                                        : "text-slate-500"
                                  }`}
                                >
                                  {item.step}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {item.description}
                                </p>
                              </div>
                              {item.current && (
                                <span className="ml-auto bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium">
                                  Current
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Service Info - Expandable */}
                    <div
                      className={`bg-slate-50 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
                                  hover:shadow-lg hover:bg-sky-50 border-2 ${expandedCard === "service" ? "border-sky-500 ring-4 ring-sky-500/20" : "border-transparent"}`}
                      onClick={() =>
                        setExpandedCard(
                          expandedCard === "service" ? null : "service",
                        )
                      }
                    >
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <Wrench size={18} className="text-sky-500" />
                            Service Details
                          </h4>
                          <div
                            className={`transition-transform duration-300 ${expandedCard === "service" ? "rotate-180" : ""}`}
                          >
                            <ChevronDown size={20} className="text-sky-500" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Service</span>
                            <span className="font-semibold text-slate-900">
                              {searchResult.service}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Price</span>
                            <span className="font-bold text-sky-600">
                              {searchResult.servicePrice}
                            </span>
                          </div>
                          <div className="border-t border-slate-200 pt-3 flex justify-between">
                            <span className="text-slate-600">Booked On</span>
                            <span className="font-medium text-slate-700">
                              {formatDate(searchResult.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Expanded Service Details */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${expandedCard === "service" ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}
                        >
                          <div className="border-t border-slate-200 pt-4 space-y-4">
                            {/* Duration */}
                            <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Timer size={18} className="text-amber-600" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-500">
                                  Estimated Duration
                                </p>
                                <p className="font-bold text-slate-900">
                                  {
                                    getServiceDetails(searchResult.service)
                                      .duration
                                  }
                                </p>
                              </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Info size={16} className="text-sky-500" />
                                <p className="text-sm font-medium text-slate-700">
                                  Description
                                </p>
                              </div>
                              <p className="text-slate-600 text-sm">
                                {
                                  getServiceDetails(searchResult.service)
                                    .description
                                }
                              </p>
                            </div>

                            {/* What's Included */}
                            <div className="bg-white rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-3">
                                <ListChecks
                                  size={16}
                                  className="text-emerald-500"
                                />
                                <p className="text-sm font-medium text-slate-700">
                                  What's Included
                                </p>
                              </div>
                              <ul className="space-y-2">
                                {getServiceDetails(
                                  searchResult.service,
                                ).includes.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center gap-2 text-sm text-slate-600"
                                  >
                                    <CheckCircle
                                      size={14}
                                      className="text-emerald-500 flex-shrink-0"
                                    />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Additional Note */}
                            <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-lg p-3 border border-sky-100">
                              <p className="text-sm text-sky-700">
                                <strong>Note:</strong>{" "}
                                {getServiceDetails(searchResult.service).notes}
                              </p>
                            </div>

                            {/* View Full Details Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowServiceModal(true);
                              }}
                              className="w-full py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
                            >
                              <FileText size={18} />
                              View Full Service Details
                            </button>
                          </div>
                        </div>

                        {/* Click hint */}
                        {expandedCard !== "service" && (
                          <p className="text-xs text-sky-500 mt-3 text-center animate-pulse">
                            Click to see full service details
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Appointment Info - Expandable */}
                    <div
                      className={`bg-slate-50 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
                                  hover:shadow-lg hover:bg-sky-50 border-2 ${expandedCard === "appointment" ? "border-sky-500 ring-4 ring-sky-500/20" : "border-transparent"}`}
                      onClick={() =>
                        setExpandedCard(
                          expandedCard === "appointment" ? null : "appointment",
                        )
                      }
                    >
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <Calendar size={18} className="text-sky-500" />
                            Appointment
                          </h4>
                          <div
                            className={`transition-transform duration-300 ${expandedCard === "appointment" ? "rotate-180" : ""}`}
                          >
                            <ChevronDown size={20} className="text-sky-500" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Date</span>
                            <span className="font-semibold text-slate-900">
                              {formatDate(searchResult.date)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Time</span>
                            <span className="font-semibold text-slate-900">
                              {searchResult.time}
                            </span>
                          </div>
                        </div>

                        {/* Expanded Appointment Details */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${expandedCard === "appointment" ? "max-h-[400px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}
                        >
                          <div className="border-t border-slate-200 pt-4 space-y-4">
                            {/* Location */}
                            <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <MapPin
                                  size={18}
                                  className="text-emerald-600"
                                />
                              </div>
                              <div>
                                <p className="text-sm text-slate-500">
                                  Service Location
                                </p>
                                <p className="font-bold text-slate-900">
                                  Main Service Center
                                </p>
                                <p className="text-xs text-slate-500">
                                  123 Auto Service Blvd, Suite 100
                                </p>
                              </div>
                            </div>

                            {/* Estimated Duration */}
                            <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Clock size={18} className="text-amber-600" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-500">
                                  Expected Duration
                                </p>
                                <p className="font-bold text-slate-900">
                                  {
                                    getServiceDetails(searchResult.service)
                                      .duration
                                  }
                                </p>
                              </div>
                            </div>

                            {/* Reminders */}
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-100">
                              <p className="text-sm font-medium text-amber-800 mb-2">
                                📋 Before Your Appointment:
                              </p>
                              <ul className="text-sm text-amber-700 space-y-1">
                                <li>• Arrive 10 minutes early</li>
                                <li>• Bring your vehicle registration</li>
                                <li>• Remove valuables from vehicle</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Click hint */}
                        {expandedCard !== "appointment" && (
                          <p className="text-xs text-sky-500 mt-3 text-center animate-pulse">
                            Click to see appointment details
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Info - Expandable */}
                    <div
                      className={`bg-slate-50 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
                                  hover:shadow-lg hover:bg-sky-50 border-2 ${expandedCard === "vehicle" ? "border-sky-500 ring-4 ring-sky-500/20" : "border-transparent"}`}
                      onClick={() =>
                        setExpandedCard(
                          expandedCard === "vehicle" ? null : "vehicle",
                        )
                      }
                    >
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <Car size={18} className="text-sky-500" />
                            Vehicle Information
                          </h4>
                          <div
                            className={`transition-transform duration-300 ${expandedCard === "vehicle" ? "rotate-180" : ""}`}
                          >
                            <ChevronDown size={20} className="text-sky-500" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Vehicle No.</span>
                            <span className="font-mono font-bold text-slate-900">
                              {searchResult.vehicleNo}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Model</span>
                            <span className="font-semibold text-slate-900">
                              {searchResult.vehicleModel}
                            </span>
                          </div>
                        </div>

                        {/* Expanded Vehicle Details */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${expandedCard === "vehicle" ? "max-h-[300px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}
                        >
                          <div className="border-t border-slate-200 pt-4 space-y-4">
                            <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg p-4 text-center">
                              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Car size={32} className="text-sky-600" />
                              </div>
                              <p className="font-bold text-lg text-slate-900">
                                {searchResult.vehicleModel}
                              </p>
                              <p className="font-mono text-sky-600 font-bold">
                                {searchResult.vehicleNo}
                              </p>
                            </div>
                            <div className="bg-sky-50 rounded-lg p-3 border border-sky-100">
                              <p className="text-sm text-sky-700">
                                <strong>Tip:</strong> Keep your vehicle
                                documentation handy during the service
                                appointment.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Click hint */}
                        {expandedCard !== "vehicle" && (
                          <p className="text-xs text-sky-500 mt-3 text-center animate-pulse">
                            Click to see vehicle details
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Customer Info - Expandable */}
                    <div
                      className={`bg-slate-50 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
                                  hover:shadow-lg hover:bg-sky-50 border-2 ${expandedCard === "customer" ? "border-sky-500 ring-4 ring-sky-500/20" : "border-transparent"}`}
                      onClick={() =>
                        setExpandedCard(
                          expandedCard === "customer" ? null : "customer",
                        )
                      }
                    >
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <User size={18} className="text-sky-500" />
                            Customer Details
                          </h4>
                          <div
                            className={`transition-transform duration-300 ${expandedCard === "customer" ? "rotate-180" : ""}`}
                          >
                            <ChevronDown size={20} className="text-sky-500" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Name</span>
                            <span className="font-semibold text-slate-900">
                              {searchResult.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Phone</span>
                            <span className="font-semibold text-slate-900">
                              {searchResult.phone}
                            </span>
                          </div>
                        </div>

                        {/* Expanded Customer Details */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${expandedCard === "customer" ? "max-h-[300px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}
                        >
                          <div className="border-t border-slate-200 pt-4 space-y-4">
                            <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg p-4 text-center">
                              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <User size={32} className="text-emerald-600" />
                              </div>
                              <p className="font-bold text-lg text-slate-900">
                                {searchResult.name}
                              </p>
                              <p className="text-sky-600">
                                {searchResult.phone}
                              </p>
                            </div>
                            <a
                              href="tel:+15551234567"
                              onClick={(e) => e.stopPropagation()}
                              className="block w-full py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors text-center"
                            >
                              <Phone size={16} className="inline mr-2" />
                              Call Support
                            </a>
                          </div>
                        </div>

                        {/* Click hint */}
                        {expandedCard !== "customer" && (
                          <p className="text-xs text-sky-500 mt-3 text-center animate-pulse">
                            Click to see customer details
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Note */}
                  <div className="mt-6 bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
                    <Phone
                      size={20}
                      className="text-sky-600 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-sky-800 font-medium">
                        Need assistance?
                      </p>
                      <p className="text-sky-700 text-sm">
                        Our team is here to help. Call us at{" "}
                        <strong>+1 (555) 123-4567</strong> for any questions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Section */}
          <div className="mt-12 glass-card p-8 bg-gradient-to-r from-sky-50/80 via-cyan-50/80 to-teal-50/80 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Still Need Help?
            </h2>
            <p className="text-slate-600 mb-6">
              Our customer support team is available to assist you with any
              questions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+15551234567" className="btn-primary">
                <Phone size={18} />
                Call Support
              </a>
              <button className="btn-outline">Live Chat</button>
            </div>
          </div>
        </div>
      </main>

      {/* Service Details Modal */}
      {showServiceModal && searchResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowServiceModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-sky-500 to-cyan-500 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sky-100 text-sm">Service Details</p>
                  <h3 className="text-2xl font-bold">{searchResult.service}</h3>
                </div>
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                  <DollarSign
                    size={24}
                    className="text-emerald-600 mx-auto mb-2"
                  />
                  <p className="text-sm text-emerald-600">Total Price</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {searchResult.servicePrice}
                  </p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
                  <Timer size={24} className="text-amber-600 mx-auto mb-2" />
                  <p className="text-sm text-amber-600">Est. Duration</p>
                  <p className="text-2xl font-bold text-amber-700">
                    {getServiceDetails(searchResult.service).duration}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Info size={18} className="text-sky-500" />
                  About This Service
                </h4>
                <p className="text-slate-600 bg-slate-50 rounded-xl p-4">
                  {getServiceDetails(searchResult.service).description}
                </p>
              </div>

              {/* What's Included */}
              <div>
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <ListChecks size={18} className="text-emerald-500" />
                  What's Included
                </h4>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {getServiceDetails(searchResult.service).includes.map(
                      (item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-slate-700"
                        >
                          <CheckCircle
                            size={16}
                            className="text-emerald-500 flex-shrink-0"
                          />
                          {item}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              {/* Booking Summary */}
              <div>
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-sky-500" />
                  Booking Summary
                </h4>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between pb-3 border-b border-slate-200">
                    <span className="text-slate-600">Booking ID</span>
                    <span className="font-mono font-bold text-sky-600">
                      {searchResult.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Appointment Date</span>
                    <span className="font-semibold text-slate-900">
                      {formatDate(searchResult.date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Appointment Time</span>
                    <span className="font-semibold text-slate-900">
                      {searchResult.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Vehicle</span>
                    <span className="font-semibold text-slate-900">
                      {searchResult.vehicleModel} ({searchResult.vehicleNo})
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-200">
                    <span className="text-slate-600">Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusConfig(searchResult.status).bg} ${getStatusConfig(searchResult.status).text}`}
                    >
                      {getStatusConfig(searchResult.status).label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Important Note */}
              <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl p-4 border border-sky-200">
                <div className="flex items-start gap-3">
                  <Sparkles
                    className="text-sky-600 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-sky-800 mb-1">
                      Important Note
                    </p>
                    <p className="text-sm text-sky-700">
                      {getServiceDetails(searchResult.service).notes}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 rounded-b-2xl">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
                <a
                  href="tel:+15551234567"
                  className="flex-1 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
