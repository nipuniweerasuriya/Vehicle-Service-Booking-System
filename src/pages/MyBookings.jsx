import { useState, useEffect, useContext, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Car,
  Wrench,
  Plus,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Timer,
  Search,
  XCircle,
  Home,
  LayoutDashboard,
  Star,
  X,
  MessageSquare,
  Check,
  TrendingUp,
  Sparkles,
  Bell,
  ArrowRight,
  Activity,
  CalendarCheck,
  Eye,
  User,
  Award,
  Zap,
  Target,
  Gift,
  Lightbulb,
  BarChart3,
  PieChart,
  Shield,
  MapPin,
  Package,
  FileText,
  Phone,
  CreditCard,
  Banknote,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import { bookingsAPI, reviewsAPI, servicesAPI } from "../api";

export default function MyBookings() {
  const { user, isUserLoggedIn } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState("bookings");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [servicesMap, setServicesMap] = useState({});

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    fetchBookings();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    // fetch services once to fallback price when booking.servicePrice missing
    let mounted = true;
    (async () => {
      try {
        const res = await servicesAPI.getAll();
        if (!mounted) return;
        const map = {};
        (res.data || []).forEach((s) => {
          if (s && s.name) map[s.name] = s.price;
        });
        setServicesMap(map);
      } catch (err) {
        // ignore
      }
    })();
    return () => clearInterval(timer);
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

  const handleOpenReview = (booking) => {
    setReviewBooking(booking);
    setReviewRating(5);
    setReviewComment("");
    setReviewSuccess(false);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) return;

    setReviewSubmitting(true);
    try {
      await reviewsAPI.create({
        rating: reviewRating,
        comment: reviewComment,
        serviceType: reviewBooking?.serviceType || "Vehicle Service",
        bookingId: reviewBooking?.bookingId,
      });
      setReviewSuccess(true);
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewBooking(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleOpenPayment = (booking) => {
    setPaymentBooking(booking);
    const raw = booking.servicePrice ?? servicesMap[booking.serviceType];
    const val = Number(raw ?? 0);
    setPaymentAmount(val);
    setPaymentDone(false);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!paymentBooking) return;

    setPaymentLoading(paymentBooking._id);
    try {
      await bookingsAPI.updatePayment(paymentBooking._id, "paid");
      // mark booking as awaiting admin review
      try {
        await bookingsAPI.updateStatus(paymentBooking._id, "Pending");
      } catch (e) {
        // ignore status update failure
      }
      setBookings(
        bookings.map((b) =>
          b._id === paymentBooking._id
            ? {
                ...b,
                paymentStatus: "paid",
                paidAt: new Date().toISOString(),
                status: "Pending",
              }
            : b,
        ),
      );
      // mark as done and update selected booking so details show paid
      setPaymentDone(true);
      setSelectedBooking((prev) =>
        prev && prev._id === paymentBooking._id
          ? { ...prev, paymentStatus: "paid", paidAt: new Date().toISOString() }
          : prev,
      );
      // keep modal briefly to show confirmation then close
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentBooking(null);
        setPaymentDone(false);
      }, 1400);
    } catch (err) {
      console.error("Failed to process payment");
    } finally {
      setPaymentLoading(null);
    }
  };

  if (!isUserLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: "Good Morning" };
    if (hour < 17) return { text: "Good Afternoon" };
    if (hour < 21) return { text: "Good Evening" };
    return { text: "Good Night" };
  };

  const greeting = getGreeting();

  const getStatusConfig = (status, paymentStatus) => {
    const configs = {
      Pending: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-200",
        icon: Timer,
        dot: "bg-amber-500",
        gradient: "from-amber-500 to-orange-500",
        label: "Pending Review",
      },
      PendingPaid: {
        bg: "bg-sky-50",
        text: "text-sky-600",
        border: "border-sky-200",
        icon: Activity,
        dot: "bg-sky-500",
        gradient: "from-sky-500 to-indigo-500",
        label: "Awaiting Admin Review",
      },
      Approved: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        icon: Activity,
        dot: "bg-blue-500",
        gradient: "from-blue-500 to-indigo-500",
        label: "In Progress",
      },
      Completed: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
        icon: CheckCircle2,
        dot: "bg-emerald-500",
        gradient: "from-emerald-500 to-teal-500",
        label: "Completed",
      },
      Rejected: {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
        icon: XCircle,
        dot: "bg-red-500",
        gradient: "from-red-500 to-pink-500",
        label: "Rejected",
      },
    };
    if (status === "Pending" && paymentStatus === "paid")
      return configs.PendingPaid;
    return configs[status] || configs.Pending;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr + "T00:00:00");
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatFullDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      !searchQuery ||
      booking.bookingId?.toString().includes(searchQuery) ||
      booking.serviceType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vehicleNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "Pending").length,
      inProgress: bookings.filter((b) => b.status === "Approved").length,
      completed: bookings.filter((b) => b.status === "Completed").length,
      rejected: bookings.filter((b) => b.status === "Rejected").length,
    }),
    [bookings],
  );

  const upcomingBooking = useMemo(() => {
    const activeBookings = bookings.filter(
      (b) => b.status === "Pending" || b.status === "Approved",
    );
    return activeBookings.sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    )[0];
  }, [bookings]);

  const smartTip = useMemo(() => {
    if (stats.pending > 0)
      return {
        text: `You have ${stats.pending} pending booking${stats.pending > 1 ? "s" : ""} awaiting confirmation`,
        color: "amber",
      };
    if (stats.inProgress > 0)
      return {
        text: `${stats.inProgress} service${stats.inProgress > 1 ? "s" : ""} currently in progress`,
        color: "blue",
      };
    if (stats.completed > 0 && stats.total === stats.completed)
      return {
        text: "All services completed! Ready for a new booking?",
        color: "emerald",
      };
    return { text: "Book your first service to get started!", color: "slate" };
  }, [stats]);

  const serviceInsights = useMemo(() => {
    const serviceCount = {};
    bookings.forEach((b) => {
      serviceCount[b.serviceType] = (serviceCount[b.serviceType] || 0) + 1;
    });
    const mostUsed = Object.entries(serviceCount).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const completionRate =
      stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    return {
      mostUsedService: mostUsed ? mostUsed[0] : "None yet",
      mostUsedCount: mostUsed ? mostUsed[1] : 0,
      completionRate,
      totalServices: Object.keys(serviceCount).length,
    };
  }, [bookings, stats]);

  const recentActivity = useMemo(() => {
    return [...bookings]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date),
      )
      .slice(0, 5);
  }, [bookings]);

  const filterItems = [
    { icon: LayoutDashboard, label: "All", filter: "all", count: stats.total },
    {
      icon: Timer,
      label: "Pending",
      filter: "Pending",
      count: stats.pending,
      color: "amber",
    },
    {
      icon: Activity,
      label: "In Progress",
      filter: "Approved",
      count: stats.inProgress,
      color: "blue",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      filter: "Completed",
      count: stats.completed,
      color: "emerald",
    },
  ];

  const sidebarNavItems = [
    {
      id: "bookings",
      label: "My Bookings",
      icon: CalendarCheck,
      desc: "View all bookings",
    },
    {
      id: "insights",
      label: "Insights",
      icon: BarChart3,
      desc: "Service analytics",
    },
  ];

  const quickTips = [
    {
      icon: Shield,
      text: "Regular maintenance extends vehicle life",
      color: "blue",
    },
    {
      icon: Clock,
      text: "Book early for preferred time slots",
      color: "amber",
    },
    {
      icon: Star,
      text: "Leave reviews to help other customers",
      color: "purple",
    },
    {
      icon: Gift,
      text: "Check for seasonal offers and discounts",
      color: "emerald",
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="flex">
          <aside className="hidden lg:block w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 min-h-screen flex-shrink-0">
            <div className="p-5 sticky top-0">
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-4 mb-5 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white truncate">
                      {user?.name || "User"}
                    </h3>
                    <p className="text-slate-400 text-xs truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-300">{greeting.text}</span>
                  <span className="flex items-center gap-1 ml-auto px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarCheck size={14} className="text-blue-400" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Total
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={14} className="text-emerald-400" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Done
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-400">
                    {stats.completed}
                  </p>
                </div>
              </div>

              {stats.pending > 0 && (
                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-3 mb-5 border border-amber-500/30">
                  <div className="flex items-center gap-2">
                    <Bell size={14} className="text-amber-400" />
                    <span className="text-xs text-amber-200">
                      {stats.pending} awaiting confirmation
                    </span>
                  </div>
                </div>
              )}

              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
                Dashboard
              </p>
              <nav className="space-y-1 mb-5">
                {sidebarNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <Icon size={18} />
                      <div className="text-left">
                        <span className="text-sm font-medium block">
                          {item.label}
                        </span>
                        <span
                          className={`text-[10px] ${isActive ? "text-blue-200" : "text-slate-500"}`}
                        >
                          {item.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {activeSection === "bookings" && (
                <>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
                    Filter by Status
                  </p>
                  <nav className="space-y-1 mb-5">
                    {filterItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = statusFilter === item.filter;
                      return (
                        <button
                          key={item.filter}
                          onClick={() => setStatusFilter(item.filter)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-sm ${
                            isActive
                              ? "bg-slate-700 text-white"
                              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon size={14} />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                              isActive
                                ? "bg-slate-600"
                                : "bg-slate-700/50 text-slate-500"
                            }`}
                          >
                            {item.count}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </>
              )}

              {upcomingBooking && activeSection === "bookings" && (
                <div className="mb-5">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
                    Next Booking
                  </p>
                  <button
                    onClick={() => setSelectedBooking(upcomingBooking)}
                    className="w-full text-left bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl p-3 border border-blue-500/30 hover:border-blue-400/50 transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={12} className="text-blue-400" />
                      <span className="text-[10px] text-blue-300 uppercase tracking-wider">
                        {upcomingBooking.status}
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium truncate mb-1">
                      {upcomingBooking.serviceType}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {formatDate(upcomingBooking.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {upcomingBooking.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-emerald-400 font-semibold text-sm">
                        {(() => {
                          const raw =
                            upcomingBooking.servicePrice ??
                            servicesMap[upcomingBooking.serviceType];
                          const v = Number(raw ?? 0);
                          return v > 0 ? `$${v.toFixed(2)}` : "$0.00";
                        })()}
                      </span>
                      <div className="flex items-center gap-1 text-blue-400 text-xs group-hover:gap-2 transition-all">
                        <span>View Details</span>
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <Link
                  to="/services"
                  className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-blue-600/25"
                >
                  <Plus size={16} />
                  <span>New Booking</span>
                </Link>
                <Link
                  to="/"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-sm"
                >
                  <Home size={16} />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </aside>

          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="lg:hidden mb-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{greeting.text}</p>
                      <h3 className="font-semibold text-slate-900">
                        {user?.name}
                      </h3>
                    </div>
                  </div>
                  <Link
                    to="/services"
                    className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/25"
                  >
                    <Plus size={18} />
                  </Link>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      {stats.total}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Total
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-amber-600">
                      {stats.pending}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Pending
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-blue-600">
                      {stats.inProgress}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Active
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-emerald-600">
                      {stats.completed}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Done
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {sidebarNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon size={16} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="hidden lg:block mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900">
                      {greeting.text}, {user?.name?.split(" ")[0]}!
                    </h1>
                  </div>
                  <p className="text-slate-500">{smartTip.text}</p>
                </div>
                <button
                  onClick={() => fetchBookings(true)}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors shadow-sm"
                >
                  <RefreshCw
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: "Total Bookings",
                  value: stats.total,
                  icon: CalendarCheck,
                  gradient: "from-slate-500 to-slate-600",
                },
                {
                  label: "Pending",
                  value: stats.pending,
                  icon: Timer,
                  gradient: "from-amber-500 to-orange-500",
                },
                {
                  label: "In Progress",
                  value: stats.inProgress,
                  icon: Activity,
                  gradient: "from-blue-500 to-indigo-500",
                },
                {
                  label: "Completed",
                  value: stats.completed,
                  icon: CheckCircle2,
                  gradient: "from-emerald-500 to-teal-500",
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                      >
                        <Icon size={18} className="text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {activeSection === "bookings" && (
              <>
                <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
                  {filterItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = statusFilter === item.filter;
                    return (
                      <button
                        key={item.filter}
                        onClick={() => setStatusFilter(item.filter)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                            : "bg-white text-slate-600 border border-slate-200"
                        }`}
                      >
                        <Icon size={14} />
                        {item.label}
                        <span
                          className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                            isActive ? "bg-white/20" : "bg-slate-100"
                          }`}
                        >
                          {item.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {statusFilter === "all"
                        ? "All Bookings"
                        : statusFilter === "Approved"
                          ? "In Progress"
                          : statusFilter}
                    </h2>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
                      {filteredBookings.length}
                    </span>
                  </div>
                </div>

                <div className="relative mb-5">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search by booking ID, service, or vehicle..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <div className="w-12 h-12 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500">Loading your bookings...</p>
                  </div>
                ) : error ? (
                  <div className="bg-white rounded-2xl border border-red-200 p-10 text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <AlertCircle size={28} className="text-red-500" />
                    </div>
                    <p className="text-red-600 font-semibold mb-1">
                      Something went wrong
                    </p>
                    <p className="text-slate-500 text-sm mb-4">{error}</p>
                    <button
                      onClick={() => fetchBookings()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : filteredBookings.length > 0 ? (
                  <div className="space-y-3">
                    {filteredBookings.map((booking, index) => {
                      const config = getStatusConfig(
                        booking.status,
                        booking.paymentStatus,
                      );

                      return (
                        <div
                          key={booking._id}
                          className="bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all overflow-hidden group animate-fadeIn"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex">
                            <div
                              className={`w-1.5 bg-gradient-to-b ${config.gradient}`}
                            />

                            <div className="flex-1 p-4 sm:p-5">
                              <div className="flex items-start gap-4">
                                <div
                                  className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                                >
                                  <Wrench size={20} className="text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span
                                      className={`${config.bg} ${config.text} px-2 py-0.5 rounded-lg text-xs font-semibold`}
                                    >
                                      {booking.status === "Approved"
                                        ? "In Progress"
                                        : booking.status}
                                    </span>
                                    <span className="text-slate-400 text-xs font-mono">
                                      #{booking.bookingId}
                                    </span>
                                  </div>
                                  <h3 className="font-semibold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors truncate">
                                    {booking.serviceType}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                      <Car
                                        size={14}
                                        className="text-slate-400"
                                      />
                                      {booking.vehicleNumber}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                      <Calendar
                                        size={14}
                                        className="text-slate-400"
                                      />
                                      {formatDate(booking.date)}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                      <Clock
                                        size={14}
                                        className="text-slate-400"
                                      />
                                      {booking.time}
                                    </span>
                                    <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                                      <Banknote
                                        size={14}
                                        className="text-emerald-500"
                                      />
                                      {(() => {
                                        const raw =
                                          booking.servicePrice ??
                                          servicesMap[booking.serviceType];
                                        const val = Number(raw ?? 0);
                                        return val > 0
                                          ? `$${val.toFixed(2)}`
                                          : "$0.00";
                                      })()}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                  {booking.status === "Approved" &&
                                    booking.progress !== undefined && (
                                      <div className="hidden sm:block w-28">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-xs text-slate-400">
                                            Progress
                                          </span>
                                          <span className="text-xs font-bold text-blue-600">
                                            {booking.progress}%
                                          </span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                                            style={{
                                              width: `${booking.progress}%`,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )}

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        setSelectedBooking(booking)
                                      }
                                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white rounded-xl transition-all text-sm font-medium group/btn"
                                    >
                                      <Eye size={14} />
                                      <span className="hidden sm:inline">
                                        View
                                      </span>
                                      <ChevronRight
                                        size={14}
                                        className="group-hover/btn:translate-x-0.5 transition-transform"
                                      />
                                    </button>
                                    {booking.status === "Completed" && (
                                      <>
                                        <button
                                          onClick={() =>
                                            handleOpenReview(booking)
                                          }
                                          className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-500 text-amber-600 hover:text-white rounded-xl transition-all text-sm font-medium"
                                          title="Write Review"
                                        >
                                          <Star size={14} />
                                          <span className="hidden sm:inline">
                                            Review
                                          </span>
                                        </button>
                                        {booking.paymentStatus !== "paid" && (
                                          <button
                                            onClick={() =>
                                              handleOpenPayment(booking)
                                            }
                                            disabled={
                                              paymentLoading === booking._id
                                            }
                                            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl transition-all text-sm font-medium"
                                            title="Pay Now"
                                          >
                                            {paymentLoading === booking._id ? (
                                              <RefreshCw
                                                size={14}
                                                className="animate-spin"
                                              />
                                            ) : (
                                              <CreditCard size={14} />
                                            )}
                                            <span className="hidden sm:inline">
                                              Pay
                                            </span>
                                          </button>
                                        )}
                                        {booking.paymentStatus === "paid" && (
                                          <span className="flex items-center gap-1.5 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-medium">
                                            <Check size={14} />
                                            <span className="hidden sm:inline">
                                              Paid
                                            </span>
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {booking.status === "Approved" &&
                                booking.progress !== undefined && (
                                  <div className="sm:hidden mt-4 pt-4 border-t border-slate-100">
                                    <div className="flex justify-between items-center mb-1.5">
                                      <span className="text-xs text-slate-500">
                                        Service Progress
                                      </span>
                                      <span className="text-xs font-bold text-blue-600">
                                        {booking.progress}%
                                      </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                                        style={{
                                          width: `${booking.progress}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calendar size={28} className="text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 text-lg mb-2">
                      {searchQuery || statusFilter !== "all"
                        ? "No results found"
                        : "No bookings yet"}
                    </h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                      {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "Book your first vehicle service to get started"}
                    </p>
                    {searchQuery || statusFilter !== "all" ? (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                        }}
                        className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                      >
                        Clear Filters
                      </button>
                    ) : (
                      <Link
                        to="/services"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
                      >
                        <Plus size={16} />
                        Book a Service
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}

            {activeSection === "insights" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
                    <BarChart3 size={16} />
                    Service Analytics
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Your Service Insights
                  </h2>
                  <p className="text-slate-500">
                    Track your service history and get personalized
                    recommendations
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <PieChart size={24} className="opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        Rate
                      </span>
                    </div>
                    <p className="text-4xl font-bold mb-1">
                      {serviceInsights.completionRate}%
                    </p>
                    <p className="text-blue-100 text-sm">Completion Rate</p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <Target size={24} className="opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        Services
                      </span>
                    </div>
                    <p className="text-4xl font-bold mb-1">
                      {serviceInsights.totalServices}
                    </p>
                    <p className="text-emerald-100 text-sm">
                      Service Types Used
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <Award size={24} className="opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        Top
                      </span>
                    </div>
                    <p className="text-2xl font-bold mb-1 truncate">
                      {serviceInsights.mostUsedService}
                    </p>
                    <p className="text-amber-100 text-sm">
                      Most Booked Service
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <Zap size={24} className="opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-4xl font-bold mb-1">
                      {stats.inProgress}
                    </p>
                    <p className="text-purple-100 text-sm">In Progress</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                    <PieChart size={18} className="text-blue-500" />
                    Status Breakdown
                  </h3>
                  {stats.total > 0 ? (
                    <div className="space-y-4">
                      {[
                        {
                          label: "Pending",
                          count: stats.pending,
                          color: "amber",
                          gradient: "from-amber-500 to-orange-500",
                        },
                        {
                          label: "In Progress",
                          count: stats.inProgress,
                          color: "blue",
                          gradient: "from-blue-500 to-indigo-500",
                        },
                        {
                          label: "Completed",
                          count: stats.completed,
                          color: "emerald",
                          gradient: "from-emerald-500 to-teal-500",
                        },
                        {
                          label: "Rejected",
                          count: stats.rejected,
                          color: "red",
                          gradient: "from-red-500 to-pink-500",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-4"
                        >
                          <div className="w-24 text-sm text-slate-600">
                            {item.label}
                          </div>
                          <div className="flex-1">
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-500`}
                                style={{
                                  width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-16 text-right">
                            <span className="text-sm font-bold text-slate-900">
                              {item.count}
                            </span>
                            <span className="text-xs text-slate-400 ml-1">
                              (
                              {stats.total > 0
                                ? Math.round((item.count / stats.total) * 100)
                                : 0}
                              %)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-8">
                      No booking data available yet
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                    <Activity size={18} className="text-blue-500" />
                    Recent Activity
                  </h3>
                  {recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {recentActivity.map((booking, idx) => {
                        const config = getStatusConfig(
                          booking.status,
                          booking.paymentStatus,
                        );
                        return (
                          <div
                            key={booking._id}
                            className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <div
                              className={`w-10 h-10 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center shadow`}
                            >
                              <Wrench size={16} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 truncate">
                                {booking.serviceType}
                              </p>
                              <p className="text-xs text-slate-500">
                                {formatDate(booking.date)} •{" "}
                                {booking.vehicleNumber}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-sm font-semibold text-emerald-600">
                                {(() => {
                                  const raw =
                                    booking.servicePrice ??
                                    servicesMap[booking.serviceType];
                                  const v = Number(raw ?? 0);
                                  return v > 0 ? `$${v.toFixed(2)}` : "$0.00";
                                })()}
                              </span>
                              <span
                                className={`${config.bg} ${config.text} px-2 py-1 rounded-lg text-xs font-semibold`}
                              >
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-8">
                      No recent activity
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                    <Lightbulb size={18} className="text-amber-500" />
                    Quick Tips
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {quickTips.map((tip, idx) => {
                      const Icon = tip.icon;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-4 bg-${tip.color}-50 rounded-xl border border-${tip.color}-100`}
                        >
                          <div
                            className={`w-10 h-10 bg-${tip.color}-100 rounded-lg flex items-center justify-center`}
                          >
                            <Icon
                              size={18}
                              className={`text-${tip.color}-600`}
                            />
                          </div>
                          <p className="text-sm text-slate-700 flex-1">
                            {tip.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
                  <h3 className="text-xl font-bold mb-2">
                    Ready for your next service?
                  </h3>
                  <p className="text-blue-100 mb-4">
                    Keep your vehicle in top condition with regular maintenance
                  </p>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                  >
                    <Plus size={18} />
                    Book New Service
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Booking Details</p>
                  <h3 className="text-xl font-bold font-mono">
                    {selectedBooking.bookingId}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1.5 rounded-lg ${getStatusConfig(selectedBooking.status, selectedBooking.paymentStatus).bg} ${getStatusConfig(selectedBooking.status, selectedBooking.paymentStatus).text} font-bold text-sm flex items-center gap-1.5`}
                  >
                    {(() => {
                      const Icon = getStatusConfig(
                        selectedBooking.status,
                        selectedBooking.paymentStatus,
                      ).icon;
                      return <Icon size={16} />;
                    })()}
                    {
                      getStatusConfig(
                        selectedBooking.status,
                        selectedBooking.paymentStatus,
                      ).label
                    }
                  </span>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {selectedBooking.status === "Approved" &&
                selectedBooking.progress !== undefined && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-slate-900">
                        Service Progress
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {selectedBooking.progress}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{ width: `${selectedBooking.progress}%` }}
                      />
                    </div>
                    {selectedBooking.progressStage && (
                      <p className="text-sm text-slate-600 mt-2">
                        Stage:{" "}
                        <span className="font-medium text-blue-600">
                          {selectedBooking.progressStage}
                        </span>
                      </p>
                    )}
                  </div>
                )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Wrench size={16} className="text-blue-500" />
                    Service
                  </h4>
                  <p className="text-slate-700">
                    {selectedBooking.serviceType}
                  </p>
                  <p className="text-blue-600 font-bold mt-1">
                    {(() => {
                      const raw =
                        selectedBooking.servicePrice ??
                        servicesMap[selectedBooking.serviceType];
                      const v = Number(raw ?? 0);
                      return v > 0 ? `$${v.toFixed(2)}` : "$0.00";
                    })()}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Car size={16} className="text-blue-500" />
                    Vehicle
                  </h4>
                  <p className="font-mono font-bold text-slate-900">
                    {selectedBooking.vehicleNumber}
                  </p>
                  <p className="text-slate-600 text-sm">
                    {selectedBooking.vehicleModel || "N/A"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Banknote size={16} className="text-emerald-500" />
                    Payment
                  </h4>
                  {selectedBooking.paymentStatus === "paid" ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          Paid
                        </p>
                        <p className="text-xs text-slate-500">
                          {selectedBooking.paidAt
                            ? formatFullDate(selectedBooking.paidAt)
                            : "—"}
                        </p>
                      </div>
                      <div className="text-emerald-600 font-bold">
                        {(() => {
                          const raw =
                            selectedBooking.servicePrice ??
                            servicesMap[selectedBooking.serviceType];
                          const v = Number(raw ?? 0);
                          return v > 0 ? `$${v.toFixed(2)}` : "$0.00";
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          Unpaid
                        </p>
                        <p className="text-xs text-slate-500">
                          Complete payment to mark as paid
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={() => handleOpenPayment(selectedBooking)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                        >
                          Pay
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-500" />
                    Appointment
                  </h4>
                  <p className="text-slate-700">
                    {formatFullDate(selectedBooking.date)}
                  </p>
                  <p className="text-slate-600 text-sm">
                    {selectedBooking.time}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <User size={16} className="text-blue-500" />
                    Customer
                  </h4>
                  <p className="text-slate-700">
                    {selectedBooking.customerName}
                  </p>
                  <p className="text-slate-600 text-sm">
                    {selectedBooking.phone}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>

                {selectedBooking.status === "Completed" && (
                  <button
                    onClick={() => {
                      handleOpenReview(selectedBooking);
                      setSelectedBooking(null);
                    }}
                    className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Star size={18} />
                    Write Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slideUp">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Star size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Write a Review
                    </h3>
                    {reviewBooking && (
                      <p className="text-sm text-slate-500">
                        #{reviewBooking.bookingId}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewRating(5);
                    setReviewComment("");
                    setReviewSuccess(false);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
            </div>

            {reviewSuccess ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Check size={32} className="text-emerald-600" />
                </div>
                <h4 className="text-xl font-semibold text-slate-900 mb-2">
                  Thank You!
                </h4>
                <p className="text-slate-500 mb-6">
                  Your review has been submitted and is pending approval.
                </p>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewSuccess(false);
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="p-6">
                {reviewBooking && (
                  <div className="bg-slate-50 rounded-xl p-4 mb-5">
                    <p className="text-sm font-medium text-slate-900">
                      {reviewBooking.serviceType}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {reviewBooking.vehicleNumber} •{" "}
                      {formatDate(reviewBooking.date)}
                    </p>
                  </div>
                )}

                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    How was your experience?
                  </label>
                  <div className="flex gap-1 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1.5 transition-transform hover:scale-110"
                      >
                        <Star
                          size={36}
                          className={
                            star <= reviewRating
                              ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                              : "text-slate-200"
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-slate-500 mt-2">
                    {reviewRating === 5 && "Excellent!"}
                    {reviewRating === 4 && "Very Good!"}
                    {reviewRating === 3 && "Good"}
                    {reviewRating === 2 && "Fair"}
                    {reviewRating === 1 && "Poor"}
                  </p>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this service..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmitReview}
                  disabled={reviewSubmitting || !reviewComment.trim()}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-500 hover:to-indigo-500 transition-all disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 disabled:shadow-none"
                >
                  {reviewSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <MessageSquare size={16} />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showPaymentModal && paymentBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slideUp">
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Complete Payment
                </h3>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentBooking(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={18} className="text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl p-4 mb-5">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Service</span>
                    <span className="text-sm font-semibold">
                      {paymentBooking.serviceType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Booking ID</span>
                    <span className="text-sm font-semibold">
                      {paymentBooking.bookingId}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                    <span className="text-sm font-medium text-slate-900">
                      Amount Due
                    </span>
                    <span className="text-lg font-bold text-sky-600">
                      {paymentAmount > 0
                        ? `$${paymentAmount.toFixed(2)}`
                        : "$0.00"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-sm font-medium text-slate-700 mb-3">
                  Payment Method
                </p>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {paymentBooking.paymentMethod === "card" ? (
                    <>
                      <CreditCard size={20} className="text-sky-500" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Card Payment
                        </p>
                        <p className="text-xs text-slate-500">
                          ****{paymentBooking.cardLast4 || "****"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Banknote size={20} className="text-emerald-500" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Cash Payment
                        </p>
                        <p className="text-xs text-slate-500">Pay at pickup</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {paymentDone ? (
                <div className="w-full py-3.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border border-emerald-100">
                  <Check size={16} />
                  Payment Completed
                </div>
              ) : (
                <button
                  onClick={handleConfirmPayment}
                  disabled={paymentLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
                >
                  {paymentLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Confirm Payment
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>

      <Footer />
    </>
  );
}
