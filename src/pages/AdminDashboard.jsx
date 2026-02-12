import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Settings,
  DollarSign,
  Wrench,
  Eye,
  Bell,
  Search,
  Car,
  CheckCircle,
  LogOut,
  X,
  Phone,
  Home,
  Menu,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Zap,
  Calendar,
  ArrowUpRight,
  BarChart3,
  Users,
  Target,
  Award,
  Activity,
  Shield,
  ChevronDown,
  Layers,
  PieChart,
  FileText,
} from "lucide-react";
import { bookingsAPI, adminAPI } from "../api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
    today: 0,
    thisWeek: 0,
  });
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    revenue: 0,
  });

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") ||
      '{"name": "Admin", "email": "admin@vehiclecare.com"}',
  );

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Animate numbers
  const animateValue = useCallback((end, key, duration = 1000) => {
    const start = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOut);

      setAnimatedStats((prev) => ({ ...prev, [key]: current }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Load data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setError(null);
    try {
      const dashboardRes = await adminAPI.getDashboard();
      const data = dashboardRes.data;

      if (data.recentBookings) {
        setBookings(data.recentBookings);
      }

      if (data.bookings) {
        setStats({
          total: data.bookings.total || 0,
          pending: data.bookings.pending || 0,
          approved: data.bookings.approved || 0,
          completed: data.bookings.completed || 0,
          rejected: data.bookings.rejected || 0,
          today: data.bookings.today || 0,
          thisWeek: data.bookings.thisWeek || 0,
        });

        setTimeout(() => {
          animateValue(data.bookings.total || 0, "total");
          animateValue(data.bookings.pending || 0, "pending");
          animateValue(data.bookings.approved || 0, "approved");
          animateValue(data.bookings.completed || 0, "completed");
          animateValue(data.revenue?.total || 0, "revenue", 1500);
        }, 200);
      }

      if (data.revenue) {
        setRevenue(data.revenue.total || 0);
      }
    } catch (err) {
      console.error("Dashboard API error:", err);
      try {
        const bookingsRes = await bookingsAPI.getAll();
        const allBookings = bookingsRes.data || [];
        setBookings(allBookings);

        const pending = allBookings.filter(
          (b) => b.status === "Pending",
        ).length;
        const approved = allBookings.filter(
          (b) => b.status === "Approved",
        ).length;
        const completed = allBookings.filter(
          (b) => b.status === "Completed",
        ).length;
        const rejected = allBookings.filter(
          (b) => b.status === "Rejected",
        ).length;

        setStats({
          total: allBookings.length,
          pending,
          approved,
          completed,
          rejected,
          today: 0,
          thisWeek: 0,
        });

        animateValue(allBookings.length, "total");
        animateValue(pending, "pending");
        animateValue(approved, "approved");
        animateValue(completed, "completed");
      } catch (bookingsErr) {
        setError("Unable to load dashboard data.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingsAPI.updateStatus(bookingId, newStatus);
      loadDashboardData();
      setSelectedBooking(null);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/signin");
  };

  // Get greeting
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12)
      return {
        text: "Good Morning",
        tip: "Start your day by reviewing pending bookings!",
      };
    if (hour < 17)
      return {
        text: "Good Afternoon",
        tip: "Great time to catch up on approvals!",
      };
    if (hour < 21)
      return { text: "Good Evening", tip: "Wrap up today's tasks!" };
    return { text: "Good Night", tip: "Check tomorrow's schedule!" };
  };

  const greeting = getGreeting();
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      !searchQuery ||
      (booking.customerName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (booking.bookingId || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (booking.vehicleNumber || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Navigation items
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      desc: "Overview & Analytics",
      link: "/admin/dashboard",
      active: true,
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: CalendarCheck,
      desc: "Manage appointments",
      link: "/admin/bookings",
      badge: stats.pending,
    },
    {
      id: "services",
      label: "Services",
      icon: Wrench,
      desc: "Service catalog",
      link: "/admin/services",
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      desc: "Customer database",
      link: "#",
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      desc: "Analytics & reports",
      link: "#",
    },
  ];

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Loading Dashboard
          </h2>
          <p className="text-slate-400">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Connection Error
          </h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl hover:bg-slate-100"
        >
          <Menu size={22} className="text-slate-700" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Car className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-red-50 text-red-500"
        >
          <LogOut size={20} />
        </button>
      </div>

      <div className="flex">
        {/* Smart Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-slate-900 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-white text-lg">VehicleCare</h1>
                  <p className="text-xs text-slate-500">Admin Console</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Admin Profile Card */}
          <div className="p-4">
            <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {(adminUser.name || "A").charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-800"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">
                    {adminUser.name || "Admin"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {adminUser.email || "admin@vehiclecare.com"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  <span>Online</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-slate-700 text-slate-300 rounded-md">
                  <Shield size={10} />
                  <span>Admin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Mini Cards */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarCheck size={14} className="text-blue-400" />
                  <span className="text-xs text-slate-400">Bookings</span>
                </div>
                <p className="text-xl font-bold text-white">
                  {animatedStats.total}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} className="text-amber-400" />
                  <span className="text-xs text-slate-400">Pending</span>
                </div>
                <p className="text-xl font-bold text-white">
                  {animatedStats.pending}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Menu
            </p>
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                  item.active
                    ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30"
                    : "hover:bg-slate-800/70"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.active
                      ? "bg-blue-600"
                      : "bg-slate-800 group-hover:bg-slate-700"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={
                      item.active
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white"
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium ${item.active ? "text-white" : "text-slate-300 group-hover:text-white"}`}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{item.desc}</p>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-1 text-xs font-bold bg-amber-500 text-white rounded-md">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Performance Widget */}
          <div className="p-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-blue-400" />
                  <span className="text-sm font-medium text-white">
                    Performance
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {completionRate}%
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500">
                Completion rate this period
              </p>
            </div>
          </div>

          {/* System Status */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                System Status
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs text-slate-400">API Server</span>
                </div>
                <span className="text-xs text-emerald-400">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs text-slate-400">Database</span>
                </div>
                <span className="text-xs text-emerald-400">Connected</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-800">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-all"
            >
              <Home size={18} />
              <span className="text-sm">Back to Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-1"
            >
              <LogOut size={18} />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <header className="hidden lg:block bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                  <span>{greeting.text}</span>
                  <span className="text-slate-300">|</span>
                  <span>
                    {currentTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-900">
                  Welcome back, {adminUser.name?.split(" ")[0] || "Admin"}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden xl:block">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-10 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  <RefreshCw
                    size={18}
                    className={`text-slate-600 ${refreshing ? "animate-spin" : ""}`}
                  />
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all relative"
                  >
                    <Bell size={18} className="text-slate-600" />
                    {stats.pending > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {stats.pending > 9 ? "9+" : stats.pending}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                      <div className="p-4 bg-slate-900 text-white">
                        <h3 className="font-bold">Notifications</h3>
                        <p className="text-slate-400 text-sm">Stay updated</p>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {stats.pending > 0 && (
                          <div className="p-4 hover:bg-slate-50 border-b border-slate-100">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-amber-600" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">
                                  Pending Bookings
                                </p>
                                <p className="text-sm text-slate-500">
                                  {stats.pending} booking(s) await review
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="p-4 hover:bg-slate-50">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                All Systems Online
                              </p>
                              <p className="text-sm text-slate-500">
                                Everything running smoothly
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {(adminUser.name || "A").charAt(0)}
                  </div>
                  <div className="hidden xl:block">
                    <p className="font-semibold text-slate-900 text-sm">
                      {adminUser.name || "Admin"}
                    </p>
                    <p className="text-xs text-slate-500">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-4 lg:p-6 space-y-6">
            {/* Alert Banner */}
            {stats.pending > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-amber-800">Action Required</p>
                  <p className="text-sm text-amber-600">
                    You have {stats.pending} pending booking(s) waiting for
                    review.
                  </p>
                </div>
                <Link
                  to="/admin/bookings"
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors flex-shrink-0"
                >
                  Review Now
                </Link>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Bookings */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  {stats.today > 0 && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <TrendingUp size={12} />+{stats.today}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1">
                  {animatedStats.total}
                </p>
                <p className="text-sm text-slate-500">Total Bookings</p>
              </div>

              {/* Pending */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  {stats.pending > 0 && (
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full animate-pulse">
                      Action needed
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1">
                  {animatedStats.pending}
                </p>
                <p className="text-sm text-slate-500">Pending Review</p>
              </div>

              {/* In Progress */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1">
                  {animatedStats.approved}
                </p>
                <p className="text-sm text-slate-500">In Progress</p>
              </div>

              {/* Completed */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    {completionRate}%
                  </span>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1">
                  {animatedStats.completed}
                </p>
                <p className="text-sm text-slate-500">Completed</p>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Performance Chart */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Performance</h3>
                    <p className="text-xs text-slate-500">
                      Completion overview
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="52"
                        stroke="#f1f5f9"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="52"
                        stroke="url(#perfGradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${completionRate * 3.27} 327`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient
                          id="perfGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900">
                        {completionRate}%
                      </span>
                      <span className="text-xs text-slate-500">Complete</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-slate-600">Completed</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {stats.completed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-slate-600">In Progress</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {stats.approved}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-slate-600">Pending</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {stats.pending}
                    </span>
                  </div>
                </div>
              </div>

              {/* Revenue Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">Revenue</h3>
                      <p className="text-xs text-slate-400">Total earnings</p>
                    </div>
                  </div>

                  <p className="text-4xl font-bold mb-2">
                    ${animatedStats.revenue}
                  </p>
                  <p className="text-slate-400 text-sm mb-6">
                    From {stats.completed} completed jobs
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">Avg. Value</p>
                      <p className="text-lg font-bold">
                        $
                        {stats.completed > 0
                          ? Math.round(revenue / stats.completed)
                          : 0}
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">This Week</p>
                      <p className="text-lg font-bold">{stats.thisWeek || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Quick Actions</h3>
                    <p className="text-xs text-slate-500">Shortcuts</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/admin/bookings?status=Pending"
                    className="flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-xl transition-all group"
                  >
                    <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">
                        Review Pending
                      </p>
                      <p className="text-xs text-slate-500">
                        {stats.pending} items
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  </Link>

                  <Link
                    to="/admin/services"
                    className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition-all group"
                  >
                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Settings className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">
                        Manage Services
                      </p>
                      <p className="text-xs text-slate-500">Edit catalog</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-blue-400" />
                  </Link>

                  <Link
                    to="/admin/bookings"
                    className="flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-xl transition-all group"
                  >
                    <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CalendarCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">
                        All Bookings
                      </p>
                      <p className="text-xs text-slate-500">
                        {stats.total} total
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Recent Bookings
                      </h3>
                      <p className="text-xs text-slate-500">
                        {filteredBookings.length} found
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 w-36"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <Link
                      to="/admin/bookings"
                      className="flex items-center gap-1 px-3 py-2 text-blue-600 font-medium text-sm hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      View All <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>

              {filteredBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                          Booking
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                          Customer
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase hidden md:table-cell">
                          Service
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase hidden lg:table-cell">
                          Schedule
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                          Status
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-bold text-slate-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredBookings.slice(0, 6).map((booking) => (
                        <tr
                          key={booking._id || booking.bookingId}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Car size={16} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="font-mono font-bold text-blue-600 text-sm">
                                  {booking.bookingId}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {booking.vehicleNumber}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-medium text-slate-900 text-sm">
                              {booking.customerName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {booking.phone}
                            </p>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell">
                            <p className="text-sm text-slate-900">
                              {booking.serviceType}
                            </p>
                            <p className="text-xs text-emerald-600 font-medium">
                              {booking.servicePrice || "-"}
                            </p>
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <p className="text-sm text-slate-900">
                              {booking.date}
                            </p>
                            <p className="text-xs text-slate-500">
                              {booking.time}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setSelectedBooking(booking)}
                                className="p-2 hover:bg-blue-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                                title="View"
                              >
                                <Eye size={16} />
                              </button>
                              {booking.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(
                                        booking._id || booking.bookingId,
                                        "Approved",
                                      )
                                    }
                                    className="p-2 hover:bg-emerald-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                                    title="Approve"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(
                                        booking._id || booking.bookingId,
                                        "Rejected",
                                      )
                                    }
                                    className="p-2 hover:bg-red-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                                    title="Reject"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </>
                              )}
                              {booking.status === "Approved" && (
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(
                                      booking._id || booking.bookingId,
                                      "Completed",
                                    )
                                  }
                                  className="p-2 hover:bg-emerald-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                                  title="Complete"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarCheck className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">
                    No bookings found
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    {searchQuery || statusFilter !== "all"
                      ? "Try different filters"
                      : "Bookings will appear here"}
                  </p>
                  {(searchQuery || statusFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                      className="text-blue-600 font-medium text-sm hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Booking Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Booking Details</p>
                  <h3 className="text-xl font-bold font-mono">
                    {selectedBooking.bookingId}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                  {(selectedBooking.customerName || "C").charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    {selectedBooking.customerName}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Phone size={14} />
                    {selectedBooking.phone}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench size={14} className="text-blue-600" />
                    <span className="text-xs text-slate-500">Service</span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {selectedBooking.serviceType}
                  </p>
                  <p className="text-emerald-600 font-medium text-sm">
                    {selectedBooking.servicePrice || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Car size={14} className="text-blue-600" />
                    <span className="text-xs text-slate-500">Vehicle</span>
                  </div>
                  <p className="font-mono font-bold text-slate-900">
                    {selectedBooking.vehicleNumber}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-blue-600" />
                  <span className="text-xs text-slate-500">Schedule</span>
                </div>
                <p className="font-bold text-slate-900">
                  {selectedBooking.date} at {selectedBooking.time}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-500">Status</span>
                <StatusBadge status={selectedBooking.status} />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                {selectedBooking.status === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          selectedBooking._id || selectedBooking.bookingId,
                          "Approved",
                        )
                      }
                      className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} /> Approve
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          selectedBooking._id || selectedBooking.bookingId,
                          "Rejected",
                        )
                      }
                      className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} /> Reject
                    </button>
                  </>
                )}
                {selectedBooking.status === "Approved" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        selectedBooking._id || selectedBooking.bookingId,
                        "Completed",
                      )
                    }
                    className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} /> Mark Complete
                  </button>
                )}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification overlay */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Approved: "bg-blue-100 text-blue-700 border-blue-200",
    Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
  };

  const dots = {
    Pending: "bg-amber-500",
    Approved: "bg-blue-500",
    Completed: "bg-emerald-500",
    Rejected: "bg-red-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.Pending}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dots[status] || dots.Pending}`}
      ></span>
      {status}
    </span>
  );
}
