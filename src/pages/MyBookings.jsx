import { useState, useEffect, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Car,
  Wrench,
  Plus,
  RefreshCw,
  ChevronRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Timer,
  Activity,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import { bookingsAPI } from "../api";

export default function MyBookings() {
  const { user, isUserLoggedIn } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (!isUserLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  const getStatusBadge = (status) => {
    const classes = {
      Pending: "badge-pending",
      Approved: "badge-approved",
      Completed: "badge-completed",
      Rejected: "badge-rejected",
    };
    return classes[status] || "badge-pending";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Timer size={14} />;
      case "Approved":
        return <CheckCircle2 size={14} />;
      case "Completed":
        return <Sparkles size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const formatDate = (dateStr) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", options);
  };

  const stats = [
    {
      label: "Total",
      value: bookings.length,
      icon: TrendingUp,
      gradient: "from-slate-500 to-slate-600",
      bg: "bg-gradient-to-br from-slate-50 to-slate-100",
      ring: "ring-slate-200",
    },
    {
      label: "Pending",
      value: bookings.filter((b) => b.status === "Pending").length,
      icon: Timer,
      gradient: "from-amber-500 to-orange-500",
      bg: "bg-gradient-to-br from-amber-50 to-orange-50",
      ring: "ring-amber-200",
    },
    {
      label: "Approved",
      value: bookings.filter((b) => b.status === "Approved").length,
      icon: CheckCircle2,
      gradient: "from-sky-500 to-blue-500",
      bg: "bg-gradient-to-br from-sky-50 to-blue-50",
      ring: "ring-sky-200",
    },
    {
      label: "Completed",
      value: bookings.filter((b) => b.status === "Completed").length,
      icon: Sparkles,
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
      ring: "ring-emerald-200",
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen py-10 px-4 bg-gradient-mesh relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 animate-slide-down">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-sky-500/30">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    My Bookings
                  </h1>
                  <p className="text-slate-500">
                    Welcome back,{" "}
                    <span className="text-sky-600 font-medium">
                      {user?.name || "User"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fetchBookings(true)}
                disabled={refreshing}
                className="btn-secondary flex items-center gap-2 group"
              >
                <RefreshCw
                  size={16}
                  className={`${refreshing ? "animate-spin" : "group-hover:rotate-180"} transition-transform duration-500`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <Link
                to="/services"
                className="btn-primary flex items-center gap-2 group"
              >
                <Plus
                  size={16}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
                <span>View Services</span>
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={`${stat.bg} rounded-2xl p-5 ring-1 ${stat.ring} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon size={18} className="text-white" />
                  </div>
                  <span
                    className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-600">
                  {stat.label} Bookings
                </p>
              </div>
            ))}
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="text-center py-20">
              <div className="relative inline-block">
                <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Car size={24} className="text-sky-600" />
                </div>
              </div>
              <p className="text-slate-600 mt-4 font-medium">
                Loading your bookings...
              </p>
            </div>
          ) : error ? (
            <div className="glass-card p-8 text-center animate-scale-in">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <button onClick={() => fetchBookings()} className="btn-primary">
                Try Again
              </button>
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking, idx) => (
                <div
                  key={booking._id}
                  className="glass-card p-6 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 animate-slide-up group"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left - Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-sm font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-lg ring-1 ring-sky-200">
                          #{booking.bookingId}
                        </span>
                        <span
                          className={`badge ${getStatusBadge(booking.status)} flex items-center gap-1.5`}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Wrench size={16} className="text-white" />
                        </div>
                        {booking.serviceType}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                          <Car size={14} className="text-slate-400" />
                          <span className="font-medium">
                            {booking.vehicleNumber}
                          </span>
                        </span>
                        <span className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                          <Calendar size={14} className="text-slate-400" />
                          <span className="font-medium">
                            {formatDate(booking.date)}
                          </span>
                        </span>
                        <span className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                          <Clock size={14} className="text-slate-400" />
                          <span className="font-medium">{booking.time}</span>
                        </span>
                      </div>

                      {/* Progress Tracker for Approved Bookings */}
                      {booking.status === "Approved" &&
                        booking.progress !== undefined && (
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Activity size={14} className="text-sky-600" />
                                Service Progress
                              </span>
                              <span className="text-sm font-bold text-sky-600">
                                {booking.progress || 0}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full transition-all duration-500"
                                style={{ width: `${booking.progress || 0}%` }}
                              />
                            </div>
                            {booking.progressStage && (
                              <p className="text-xs text-slate-500 mt-2">
                                Current Stage:{" "}
                                <span className="font-medium text-slate-700">
                                  {booking.progressStage}
                                </span>
                              </p>
                            )}
                          </div>
                        )}
                    </div>

                    {/* Right - Action */}
                    <Link
                      to={`/track?id=${booking.bookingId}`}
                      className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-semibold text-sm 
                               bg-sky-50 hover:bg-sky-100 px-4 py-2.5 rounded-xl transition-all duration-300
                               group-hover:shadow-md"
                    >
                      View Details
                      <ChevronRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center animate-scale-in">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-xl" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-sky-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                No Bookings Yet
              </h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                You haven't made any service bookings yet. Browse our services
                to get started with premium vehicle care.
              </p>
              <Link
                to="/services"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg group"
              >
                <Sparkles
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />
                Explore Our Services
                <ChevronRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
