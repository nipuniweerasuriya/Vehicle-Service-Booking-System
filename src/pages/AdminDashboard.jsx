import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  DollarSign,
  Wrench,
  Eye,
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
  BarChart3,
  Users,
  Target,
  Activity,
  Shield,
  ChevronDown,
  PieChart,
  Star,
  Trash2,
  Plus,
  Edit,
  Mail,
  Filter,
  Droplet,
  Wind,
  Battery,
  Disc3,
  ClipboardCheck,
  Tag,
  Power,
  Package,
  Percent,
  Timer,
  ToggleLeft,
  ToggleRight,
  Copy,
  Archive,
  Grid3X3,
  List,
} from "lucide-react";
import { bookingsAPI, adminAPI, servicesAPI } from "../api";

// Icon map for services
const iconMap = {
  Wrench,
  Droplet,
  Wind,
  Battery,
  Disc3,
  ClipboardCheck,
  Search,
  Target,
  Sparkles,
  Zap,
  Car,
  Shield,
  Clock,
  Star,
  Package,
  Activity,
  Calendar,
  Home,
  Phone,
  Mail,
  Tag,
};

// Service categories
const serviceCategories = [
  { value: "maintenance", label: "Maintenance", color: "blue" },
  { value: "repair", label: "Repair", color: "amber" },
  { value: "inspection", label: "Inspection", color: "violet" },
  { value: "comfort", label: "Comfort", color: "emerald" },
];

// Progress stages for bookings
const progressStages = [
  { value: "Waiting", label: "Waiting", progress: 0 },
  { value: "Received", label: "Vehicle Received", progress: 20 },
  { value: "Inspection", label: "Under Inspection", progress: 40 },
  { value: "InProgress", label: "Work In Progress", progress: 60 },
  { value: "QualityCheck", label: "Quality Check", progress: 80 },
  { value: "Completed", label: "Completed", progress: 100 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Active section tab
  const [activeSection, setActiveSection] = useState("dashboard");

  // Dashboard state
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

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [reviewDeleteConfirm, setReviewDeleteConfirm] = useState(null);

  // Services state
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: "",
    icon: "Wrench",
    category: "maintenance",
    duration: 60,
    status: "active",
    featured: false,
    discount: 0,
  });
  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all"); // all, active, inactive
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState("all");
  const [serviceViewMode, setServiceViewMode] = useState("grid"); // grid, list
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceStats, setServiceStats] = useState(null);
  const [showServiceStats, setShowServiceStats] = useState(false);

  // Bookings management state
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [progressModal, setProgressModal] = useState(null);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
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
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load section data when tab changes
  useEffect(() => {
    if (activeSection === "users" && users.length === 0) loadUsers();
    if (activeSection === "reviews" && reviews.length === 0) loadReviews();
    if (activeSection === "services") loadServices();
    if (activeSection === "bookings" && bookings.length === 0)
      loadDashboardData();
  }, [activeSection]);

  const loadDashboardData = async () => {
    setError(null);
    try {
      const dashboardRes = await adminAPI.getDashboard();
      const data = dashboardRes.data;

      if (data.recentBookings) setBookings(data.recentBookings);
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
      if (data.revenue) setRevenue(data.revenue.total || 0);
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

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await adminAPI.getReviews();
      setReviews(res.data || []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadServices = async () => {
    setServicesLoading(true);
    try {
      // Load services first
      const servicesRes = await servicesAPI.getAll();
      setServices(servicesRes.data || []);
      
      // Try to load stats separately (don't fail if stats fail)
      try {
        const statsRes = await servicesAPI.getStats();
        setServiceStats(statsRes.data || null);
      } catch (statsErr) {
        console.error("Failed to load service stats:", statsErr);
        setServiceStats(null);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setServicesLoading(false);
    }
  };

  // Toggle service status (active/inactive)
  const handleToggleServiceStatus = async (serviceId) => {
    try {
      const res = await servicesAPI.toggleStatus(serviceId);
      setServices(services.map((s) => (s._id === serviceId ? res.data : s)));
    } catch (err) {
      alert("Failed to toggle service status");
    }
  };

  // Toggle service featured
  const handleToggleServiceFeatured = async (serviceId) => {
    try {
      const res = await servicesAPI.toggleFeatured(serviceId);
      setServices(services.map((s) => (s._id === serviceId ? res.data : s)));
    } catch (err) {
      alert("Failed to toggle featured status");
    }
  };

  // Bulk update services status
  const handleBulkServiceStatus = async (status) => {
    if (selectedServices.length === 0) return;
    try {
      await servicesAPI.bulkUpdateStatus(selectedServices, status);
      setServices(
        services.map((s) =>
          selectedServices.includes(s._id) ? { ...s, status } : s,
        ),
      );
      setSelectedServices([]);
    } catch (err) {
      alert("Failed to update services");
    }
  };

  // Bulk delete services
  const handleBulkDeleteServices = async () => {
    if (selectedServices.length === 0) return;
    if (!confirm(`Delete ${selectedServices.length} service(s)?`)) return;
    try {
      await servicesAPI.bulkDelete(selectedServices);
      setServices(services.filter((s) => !selectedServices.includes(s._id)));
      setSelectedServices([]);
    } catch (err) {
      alert("Failed to delete services");
    }
  };

  // Toggle service selection
  const toggleServiceSelection = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  // Select all visible services
  const selectAllServices = () => {
    const visibleIds = filteredServices.map((s) => s._id);
    if (selectedServices.length === visibleIds.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(visibleIds);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    if (activeSection === "dashboard") loadDashboardData();
    else if (activeSection === "bookings") loadDashboardData();
    else if (activeSection === "users") loadUsers();
    else if (activeSection === "reviews") loadReviews();
    else if (activeSection === "services") loadServices();
    setTimeout(() => setRefreshing(false), 1000);
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

  const handleProgressUpdate = async (bookingId, stage) => {
    try {
      const stageInfo = progressStages.find((s) => s.value === stage);
      await bookingsAPI.updateProgress(bookingId, stageInfo.progress, stage);
      if (stage === "Completed")
        await bookingsAPI.updateStatus(bookingId, "Completed");
      loadDashboardData();
      setProgressModal(null);
    } catch (error) {
      console.error("Failed to update progress:", error);
      alert("Failed to update progress");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter((u) => u._id !== userId));
      setDeleteConfirm(null);
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleReviewStatus = async (reviewId, status) => {
    try {
      await adminAPI.updateReviewStatus(reviewId, status);
      setReviews(
        reviews.map((r) => (r._id === reviewId ? { ...r, status } : r)),
      );
    } catch (err) {
      alert("Failed to update review status");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await adminAPI.deleteReview(reviewId);
      setReviews(reviews.filter((r) => r._id !== reviewId));
      setReviewDeleteConfirm(null);
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...serviceForm,
        price: parseFloat(serviceForm.price) || 0,
        duration: parseInt(serviceForm.duration) || 60,
        discount: parseFloat(serviceForm.discount) || 0,
      };

      if (editingService) {
        const res = await servicesAPI.update(editingService._id, formData);
        setServices(
          services.map((s) => (s._id === editingService._id ? res.data : s)),
        );
      } else {
        const res = await servicesAPI.create(formData);
        setServices([...services, res.data]);
      }
      setShowServiceForm(false);
      setEditingService(null);
      resetServiceForm();
      loadServices(); // Reload to get updated stats
    } catch (err) {
      alert("Failed to save service");
    }
  };

  const resetServiceForm = () => {
    setServiceForm({
      name: "",
      description: "",
      price: "",
      icon: "Wrench",
      category: "maintenance",
      duration: 60,
      status: "active",
      featured: false,
      discount: 0,
    });
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await servicesAPI.delete(serviceId);
      setServices(services.filter((s) => s._id !== serviceId));
    } catch (err) {
      alert("Failed to delete service");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/");
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12)
      return {
        text: "Good Morning",
        tip: "Start by reviewing pending bookings!",
      };
    if (hour < 17)
      return { text: "Good Afternoon", tip: "Great time for approvals!" };
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
      !bookingSearch ||
      (booking.customerName || "")
        .toLowerCase()
        .includes(bookingSearch.toLowerCase()) ||
      (booking.bookingId || "")
        .toLowerCase()
        .includes(bookingSearch.toLowerCase()) ||
      (booking.vehicleNumber || "")
        .toLowerCase()
        .includes(bookingSearch.toLowerCase());
    const matchesStatus =
      bookingFilter === "all" || booking.status === bookingFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.phone?.includes(userSearch),
  );

  // Filter reviews
  const filteredReviews = reviews.filter(
    (review) => reviewFilter === "all" || review.status === reviewFilter,
  );

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      !serviceSearch ||
      service.name?.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      service.description?.toLowerCase().includes(serviceSearch.toLowerCase());
    const matchesStatus =
      serviceFilter === "all" || service.status === serviceFilter;
    const matchesCategory =
      serviceCategoryFilter === "all" ||
      service.category === serviceCategoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Navigation items
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      desc: "Overview & Analytics",
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: CalendarCheck,
      desc: "Manage appointments",
      badge: stats.pending,
    },
    {
      id: "services",
      label: "Services",
      icon: Wrench,
      desc: "Service catalog",
    },
    { id: "users", label: "Users", icon: Users, desc: "Manage users" },
    { id: "reviews", label: "Reviews", icon: Star, desc: "Manage reviews" },
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
        <Link to="/" className="flex items-center group">
          <span className="text-xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              Vehicle
            </span>
            <span className="text-slate-800">Care</span>
          </span>
          <span className="ml-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 group-hover:scale-125 transition-transform" />
        </Link>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-red-50 text-red-500"
        >
          <LogOut size={20} />
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center group">
                <span className="text-2xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                    Vehicle
                  </span>
                  <span className="text-white">Care</span>
                </span>
                <span className="ml-1 w-2 h-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 group-hover:scale-125 transition-transform" />
              </Link>
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
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {(adminUser.name || "A").charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-800"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate text-sm">
                    {adminUser.name || "Admin"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {adminUser.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  Online
                </span>
                <span className="flex items-center gap-1 px-2 py-1 bg-slate-700 text-slate-300 rounded-md">
                  <Shield size={10} />
                  Admin
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarCheck size={13} className="text-blue-400" />
                  <span className="text-xs text-slate-400">Total</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {animatedStats.total}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={13} className="text-amber-400" />
                  <span className="text-xs text-slate-400">Pending</span>
                </div>
                <p className="text-lg font-bold text-white">
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
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30"
                    : "hover:bg-slate-800/70"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    activeSection === item.id
                      ? "bg-blue-600"
                      : "bg-slate-800 group-hover:bg-slate-700"
                  }`}
                >
                  <item.icon
                    size={17}
                    className={
                      activeSection === item.id
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white"
                    }
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p
                    className={`font-medium text-sm ${activeSection === item.id ? "text-white" : "text-slate-300 group-hover:text-white"}`}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{item.desc}</p>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-md">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Performance */}
          <div className="p-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target size={15} className="text-blue-400" />
                  <span className="text-sm font-medium text-white">
                    Performance
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {completionRate}%
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-all text-sm"
            >
              <Home size={17} />
              Back to Website
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-1 text-sm"
            >
              <LogOut size={17} />
              Sign Out
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
          <header className="hidden lg:block bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-0.5">
                  {greeting.text} •{" "}
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <h1 className="text-lg font-bold text-slate-900">
                  Welcome, {adminUser.name?.split(" ")[0] || "Admin"}
                </h1>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                <RefreshCw
                  size={18}
                  className={`text-slate-600 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </header>

          {/* Content Area */}
          <div className="p-4 lg:p-6">
            {/* DASHBOARD SECTION */}
            {activeSection === "dashboard" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Alert */}
                {stats.pending > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-amber-800">
                        Action Required
                      </p>
                      <p className="text-sm text-amber-600">
                        {stats.pending} pending booking(s) waiting for review.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveSection("bookings")}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors flex-shrink-0"
                    >
                      Review Now
                    </button>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    icon={CalendarCheck}
                    label="Total Bookings"
                    value={animatedStats.total}
                    color="blue"
                    badge={stats.today > 0 ? `+${stats.today}` : null}
                  />
                  <StatCard
                    icon={Clock}
                    label="Pending Review"
                    value={animatedStats.pending}
                    color="amber"
                    badge={stats.pending > 0 ? "Action needed" : null}
                    pulse
                  />
                  <StatCard
                    icon={Wrench}
                    label="In Progress"
                    value={animatedStats.approved}
                    color="blue"
                    badge="Active"
                  />
                  <StatCard
                    icon={CheckCircle2}
                    label="Completed"
                    value={animatedStats.completed}
                    color="emerald"
                    badge={`${completionRate}%`}
                  />
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
                        <h3 className="font-bold text-slate-900">
                          Performance
                        </h3>
                        <p className="text-xs text-slate-500">
                          Completion overview
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center mb-6">
                      <div className="relative w-28 h-28">
                        <svg className="w-28 h-28 transform -rotate-90">
                          <circle
                            cx="56"
                            cy="56"
                            r="46"
                            stroke="#f1f5f9"
                            strokeWidth="10"
                            fill="none"
                          />
                          <circle
                            cx="56"
                            cy="56"
                            r="46"
                            stroke="url(#perfGradient)"
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray={`${completionRate * 2.89} 289`}
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
                          <span className="text-xl font-bold text-slate-900">
                            {completionRate}%
                          </span>
                          <span className="text-xs text-slate-500">
                            Complete
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                          Completed
                        </span>
                        <span className="font-bold">{stats.completed}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                          In Progress
                        </span>
                        <span className="font-bold">{stats.approved}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                          Pending
                        </span>
                        <span className="font-bold">{stats.pending}</span>
                      </div>
                    </div>
                  </div>

                  {/* Revenue */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold">Revenue</h3>
                          <p className="text-xs text-slate-400">
                            Total earnings
                          </p>
                        </div>
                      </div>
                      <p className="text-3xl font-bold mb-2">
                        ${animatedStats.revenue}
                      </p>
                      <p className="text-slate-400 text-sm mb-4">
                        From {stats.completed} completed jobs
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/10 rounded-lg p-3">
                          <p className="text-slate-400 text-xs mb-1">
                            Avg. Value
                          </p>
                          <p className="text-lg font-bold">
                            $
                            {stats.completed > 0
                              ? Math.round(revenue / stats.completed)
                              : 0}
                          </p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <p className="text-slate-400 text-xs mb-1">
                            This Week
                          </p>
                          <p className="text-lg font-bold">
                            {stats.thisWeek || 0}
                          </p>
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
                        <h3 className="font-bold text-slate-900">
                          Quick Actions
                        </h3>
                        <p className="text-xs text-slate-500">Shortcuts</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <QuickActionBtn
                        icon={Clock}
                        label="Review Pending"
                        sub={`${stats.pending} items`}
                        color="amber"
                        onClick={() => {
                          setActiveSection("bookings");
                          setBookingFilter("Pending");
                        }}
                      />
                      <QuickActionBtn
                        icon={Users}
                        label="View Users"
                        sub={`${users.length || "View"} users`}
                        color="violet"
                        onClick={() => setActiveSection("users")}
                      />
                      <QuickActionBtn
                        icon={Star}
                        label="Manage Reviews"
                        sub="Moderate feedback"
                        color="amber"
                        onClick={() => setActiveSection("reviews")}
                      />
                    </div>
                  </div>
                </div>

                {/* Recent Bookings */}
                <RecentBookingsTable
                  bookings={filteredBookings.slice(0, 5)}
                  onView={setSelectedBooking}
                  onStatusUpdate={handleStatusUpdate}
                  onViewAll={() => setActiveSection("bookings")}
                />
              </div>
            )}

            {/* BOOKINGS SECTION */}
            {activeSection === "bookings" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Manage Bookings
                    </h2>
                    <p className="text-slate-500 text-sm">
                      View and manage all service bookings
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-40"
                      />
                    </div>
                    <select
                      value={bookingFilter}
                      onChange={(e) => setBookingFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Booking Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  <MiniStat
                    label="All"
                    value={stats.total}
                    active={bookingFilter === "all"}
                    onClick={() => setBookingFilter("all")}
                  />
                  <MiniStat
                    label="Pending"
                    value={stats.pending}
                    color="amber"
                    active={bookingFilter === "Pending"}
                    onClick={() => setBookingFilter("Pending")}
                  />
                  <MiniStat
                    label="Approved"
                    value={stats.approved}
                    color="blue"
                    active={bookingFilter === "Approved"}
                    onClick={() => setBookingFilter("Approved")}
                  />
                  <MiniStat
                    label="Completed"
                    value={stats.completed}
                    color="emerald"
                    active={bookingFilter === "Completed"}
                    onClick={() => setBookingFilter("Completed")}
                  />
                  <MiniStat
                    label="Rejected"
                    value={stats.rejected}
                    color="red"
                    active={bookingFilter === "Rejected"}
                    onClick={() => setBookingFilter("Rejected")}
                  />
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
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
                          {filteredBookings.map((booking) => (
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
                                    <>
                                      <button
                                        onClick={() =>
                                          setProgressModal(
                                            booking.bookingId || booking._id,
                                          )
                                        }
                                        className="p-2 hover:bg-sky-100 rounded-lg text-slate-400 hover:text-sky-600 transition-colors"
                                        title="Update Progress"
                                      >
                                        <Activity size={16} />
                                      </button>
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
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState
                      icon={CalendarCheck}
                      title="No bookings found"
                      subtitle={
                        bookingSearch || bookingFilter !== "all"
                          ? "Try different filters"
                          : "Bookings will appear here"
                      }
                    />
                  )}
                </div>
              </div>
            )}

            {/* SERVICES SECTION */}
            {activeSection === "services" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Header with stats toggle */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Service Management
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Manage your service catalog with advanced features
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setShowServiceStats(!showServiceStats)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${showServiceStats ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                      <PieChart size={16} />
                      Analytics
                    </button>
                    <button
                      onClick={() => {
                        setShowServiceForm(true);
                        setEditingService(null);
                        resetServiceForm();
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus size={16} /> Add Service
                    </button>
                  </div>
                </div>

                {/* Analytics Panel */}
                {showServiceStats && serviceStats && (
                  <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100">
                    <div className="flex items-center gap-2 mb-4">
                      <PieChart className="w-5 h-5 text-violet-600" />
                      <h3 className="font-bold text-slate-900">
                        Service Analytics
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-xs text-slate-500 mb-1">
                          Total Services
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {serviceStats.total}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-xs text-slate-500 mb-1">Active</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          {serviceStats.active}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-xs text-slate-500 mb-1">Inactive</p>
                        <p className="text-2xl font-bold text-slate-400">
                          {serviceStats.inactive}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-xs text-slate-500 mb-1">Featured</p>
                        <p className="text-2xl font-bold text-amber-600">
                          {serviceStats.featured}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-xs text-slate-500 mb-1">
                          With Discount
                        </p>
                        <p className="text-2xl font-bold text-red-600">
                          {serviceStats.withDiscount}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-xs text-slate-500 mb-1">Avg Price</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ${Math.round(serviceStats.avgPrice)}
                        </p>
                      </div>
                    </div>
                    {/* Category breakdown */}
                    {serviceStats.categories && (
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-3">
                          By Category
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {Object.entries(serviceStats.categories).map(
                            ([cat, data]) => {
                              const catInfo = serviceCategories.find(
                                (c) => c.value === cat,
                              );
                              return (
                                <div
                                  key={cat}
                                  className="bg-white rounded-lg px-4 py-3 shadow-sm flex items-center gap-3"
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full bg-${catInfo?.color || "slate"}-500`}
                                  ></div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-900 capitalize">
                                      {cat}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {data.active}/{data.count} active
                                    </p>
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Filters & Actions Bar */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-xs">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="Search services..."
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Status Filter */}
                    <select
                      value={serviceFilter}
                      onChange={(e) => setServiceFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>

                    {/* Category Filter */}
                    <select
                      value={serviceCategoryFilter}
                      onChange={(e) => setServiceCategoryFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Categories</option>
                      {serviceCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => setServiceViewMode("grid")}
                        className={`p-2 rounded-md transition-colors ${serviceViewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        <Grid3X3 size={16} />
                      </button>
                      <button
                        onClick={() => setServiceViewMode("list")}
                        className={`p-2 rounded-md transition-colors ${serviceViewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        <List size={16} />
                      </button>
                    </div>

                    {/* Bulk Actions */}
                    {selectedServices.length > 0 && (
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-sm text-slate-500">
                          {selectedServices.length} selected
                        </span>
                        <button
                          onClick={() => handleBulkServiceStatus("active")}
                          className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-200"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() => handleBulkServiceStatus("inactive")}
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200"
                        >
                          Deactivate
                        </button>
                        <button
                          onClick={handleBulkDeleteServices}
                          className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Services List/Grid */}
                {servicesLoading ? (
                  <LoadingSpinner />
                ) : filteredServices.length > 0 ? (
                  serviceViewMode === "grid" ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredServices.map((service) => {
                        const IconComponent = iconMap[service.icon] || Wrench;
                        const categoryInfo = serviceCategories.find(
                          (c) => c.value === service.category,
                        );
                        const isSelected = selectedServices.includes(
                          service._id,
                        );
                        const finalPrice =
                          service.discount > 0
                            ? (
                                service.price *
                                (1 - service.discount / 100)
                              ).toFixed(0)
                            : service.price;

                        return (
                          <div
                            key={service._id}
                            className={`bg-white rounded-xl border-2 transition-all hover:shadow-lg relative ${isSelected ? "border-blue-500 bg-blue-50/30" : "border-slate-200"} ${service.status === "inactive" ? "opacity-60" : ""}`}
                          >
                            {/* Selection checkbox */}
                            <div className="absolute top-3 left-3 z-10">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleServiceSelection(service._id)
                                }
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                            </div>

                            {/* Featured badge */}
                            {service.featured && (
                              <div className="absolute top-3 right-3 z-10">
                                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1">
                                  <Star size={10} className="fill-amber-500" />{" "}
                                  Featured
                                </span>
                              </div>
                            )}

                            {/* Discount badge */}
                            {service.discount > 0 && (
                              <div
                                className="absolute top-3 right-3 z-10"
                                style={{
                                  right: service.featured ? "90px" : "12px",
                                }}
                              >
                                <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                                  -{service.discount}%
                                </span>
                              </div>
                            )}

                            <div className="p-5 pt-10">
                              {/* Icon & Status */}
                              <div className="flex items-center justify-between mb-4">
                                <div
                                  className={`w-12 h-12 bg-${categoryInfo?.color || "blue"}-100 rounded-xl flex items-center justify-center`}
                                >
                                  <IconComponent
                                    className={`w-6 h-6 text-${categoryInfo?.color || "blue"}-600`}
                                  />
                                </div>
                                <button
                                  onClick={() =>
                                    handleToggleServiceStatus(service._id)
                                  }
                                  className={`p-1 rounded-lg transition-colors ${service.status === "active" ? "text-emerald-600 hover:bg-emerald-100" : "text-slate-400 hover:bg-slate-100"}`}
                                  title={
                                    service.status === "active"
                                      ? "Deactivate"
                                      : "Activate"
                                  }
                                >
                                  {service.status === "active" ? (
                                    <ToggleRight size={24} />
                                  ) : (
                                    <ToggleLeft size={24} />
                                  )}
                                </button>
                              </div>

                              {/* Category tag */}
                              <span
                                className={`inline-block px-2 py-0.5 bg-${categoryInfo?.color || "slate"}-100 text-${categoryInfo?.color || "slate"}-700 rounded text-xs font-medium mb-2 capitalize`}
                              >
                                {service.category}
                              </span>

                              {/* Name & Description */}
                              <h3 className="font-bold text-slate-900 mb-1">
                                {service.name}
                              </h3>
                              <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                                {service.description}
                              </p>

                              {/* Duration */}
                              <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
                                <Timer size={12} />
                                <span>{service.duration} min</span>
                              </div>

                              {/* Price */}
                              <div className="flex items-center gap-2 mb-4">
                                <p className="text-xl font-bold text-emerald-600">
                                  ${finalPrice}
                                </p>
                                {service.discount > 0 && (
                                  <p className="text-sm text-slate-400 line-through">
                                    ${service.price}
                                  </p>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                <button
                                  onClick={() =>
                                    handleToggleServiceFeatured(service._id)
                                  }
                                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${service.featured ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600 hover:bg-amber-50"}`}
                                >
                                  <Star
                                    size={14}
                                    className={
                                      service.featured ? "fill-amber-500" : ""
                                    }
                                  />
                                  {service.featured ? "Featured" : "Feature"}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingService(service);
                                    setServiceForm({
                                      name: service.name,
                                      description: service.description,
                                      price: service.price,
                                      icon: service.icon,
                                      category:
                                        service.category || "maintenance",
                                      duration: service.duration || 60,
                                      status: service.status || "active",
                                      featured: service.featured || false,
                                      discount: service.discount || 0,
                                    });
                                    setShowServiceForm(true);
                                  }}
                                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteService(service._id)
                                  }
                                  className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* List View */
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-4 py-3 text-left">
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedServices.length ===
                                      filteredServices.length &&
                                    filteredServices.length > 0
                                  }
                                  onChange={selectAllServices}
                                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                                Service
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                                Category
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                                Duration
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                                Price
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase">
                                Status
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase">
                                Featured
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredServices.map((service) => {
                              const IconComponent =
                                iconMap[service.icon] || Wrench;
                              const categoryInfo = serviceCategories.find(
                                (c) => c.value === service.category,
                              );
                              const isSelected = selectedServices.includes(
                                service._id,
                              );
                              const finalPrice =
                                service.discount > 0
                                  ? (
                                      service.price *
                                      (1 - service.discount / 100)
                                    ).toFixed(0)
                                  : service.price;

                              return (
                                <tr
                                  key={service._id}
                                  className={`hover:bg-slate-50/50 transition-colors ${service.status === "inactive" ? "opacity-60" : ""}`}
                                >
                                  <td className="px-4 py-4">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() =>
                                        toggleServiceSelection(service._id)
                                      }
                                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`w-10 h-10 bg-${categoryInfo?.color || "blue"}-100 rounded-lg flex items-center justify-center`}
                                      >
                                        <IconComponent
                                          className={`w-5 h-5 text-${categoryInfo?.color || "blue"}-600`}
                                        />
                                      </div>
                                      <div>
                                        <p className="font-medium text-slate-900">
                                          {service.name}
                                        </p>
                                        <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">
                                          {service.description}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span
                                      className={`px-2 py-1 bg-${categoryInfo?.color || "slate"}-100 text-${categoryInfo?.color || "slate"}-700 rounded text-xs font-medium capitalize`}
                                    >
                                      {service.category}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className="text-sm text-slate-600">
                                      {service.duration} min
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-emerald-600">
                                        ${finalPrice}
                                      </span>
                                      {service.discount > 0 && (
                                        <>
                                          <span className="text-xs text-slate-400 line-through">
                                            ${service.price}
                                          </span>
                                          <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-xs font-bold">
                                            -{service.discount}%
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <button
                                      onClick={() =>
                                        handleToggleServiceStatus(service._id)
                                      }
                                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${service.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                                    >
                                      {service.status === "active" ? (
                                        <Power size={12} />
                                      ) : (
                                        <Power size={12} />
                                      )}
                                      {service.status}
                                    </button>
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <button
                                      onClick={() =>
                                        handleToggleServiceFeatured(service._id)
                                      }
                                      className={`p-1.5 rounded-lg transition-colors ${service.featured ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400 hover:text-amber-500"}`}
                                    >
                                      <Star
                                        size={16}
                                        className={
                                          service.featured
                                            ? "fill-amber-500"
                                            : ""
                                        }
                                      />
                                    </button>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                      <button
                                        onClick={() => {
                                          setEditingService(service);
                                          setServiceForm({
                                            name: service.name,
                                            description: service.description,
                                            price: service.price,
                                            icon: service.icon,
                                            category:
                                              service.category || "maintenance",
                                            duration: service.duration || 60,
                                            status: service.status || "active",
                                            featured: service.featured || false,
                                            discount: service.discount || 0,
                                          });
                                          setShowServiceForm(true);
                                        }}
                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                                      >
                                        <Edit size={16} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteService(service._id)
                                        }
                                        className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                ) : (
                  <EmptyState
                    icon={Wrench}
                    title="No services found"
                    subtitle={
                      serviceSearch ||
                      serviceFilter !== "all" ||
                      serviceCategoryFilter !== "all"
                        ? "Try different filters"
                        : "Add your first service to get started"
                    }
                  />
                )}
              </div>
            )}

            {/* USERS SECTION */}
            {activeSection === "users" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      User Management
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Manage registered users
                    </p>
                  </div>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-48"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    icon={Users}
                    label="Total Users"
                    value={users.length}
                    color="violet"
                    small
                  />
                </div>

                {usersLoading ? (
                  <LoadingSpinner />
                ) : filteredUsers.length > 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                              User
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                              Contact
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase hidden md:table-cell">
                              Joined
                            </th>
                            <th className="px-5 py-3 text-right text-xs font-bold text-slate-500 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredUsers.map((user) => (
                            <tr
                              key={user._id}
                              className="hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                                  </div>
                                  <div>
                                    <p className="font-medium text-slate-900">
                                      {user.name || "Unknown"}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      ID: {user._id}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <p className="text-sm text-slate-900 flex items-center gap-2">
                                  <Mail size={14} className="text-slate-400" />
                                  {user.email}
                                </p>
                                {user.phone && (
                                  <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                    <Phone
                                      size={12}
                                      className="text-slate-400"
                                    />
                                    {user.phone}
                                  </p>
                                )}
                              </td>
                              <td className="px-5 py-4 hidden md:table-cell">
                                <p className="text-sm text-slate-600">
                                  {user.createdAt
                                    ? new Date(
                                        user.createdAt,
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </p>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center justify-end">
                                  {deleteConfirm === user._id ? (
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() =>
                                          handleDeleteUser(user._id)
                                        }
                                        className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs rounded-lg hover:bg-slate-300"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setDeleteConfirm(user._id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete User"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    icon={Users}
                    title="No users found"
                    subtitle={
                      userSearch
                        ? "Try a different search"
                        : "Users will appear here when they register"
                    }
                  />
                )}
              </div>
            )}

            {/* REVIEWS SECTION */}
            {activeSection === "reviews" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Review Management
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Manage customer reviews and feedback
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {["all", "pending", "approved", "rejected"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => setReviewFilter(status)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            reviewFilter === status
                              ? "bg-amber-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <MiniStat
                    label="All Reviews"
                    value={reviews.length}
                    active={reviewFilter === "all"}
                    onClick={() => setReviewFilter("all")}
                  />
                  <MiniStat
                    label="Pending"
                    value={reviews.filter((r) => r.status === "pending").length}
                    color="amber"
                    active={reviewFilter === "pending"}
                    onClick={() => setReviewFilter("pending")}
                  />
                  <MiniStat
                    label="Approved"
                    value={
                      reviews.filter((r) => r.status === "approved").length
                    }
                    color="emerald"
                    active={reviewFilter === "approved"}
                    onClick={() => setReviewFilter("approved")}
                  />
                  <MiniStat
                    label="Rejected"
                    value={
                      reviews.filter((r) => r.status === "rejected").length
                    }
                    color="red"
                    active={reviewFilter === "rejected"}
                    onClick={() => setReviewFilter("rejected")}
                  />
                </div>

                {reviewsLoading ? (
                  <LoadingSpinner />
                ) : filteredReviews.length > 0 ? (
                  <div className="space-y-4">
                    {filteredReviews.map((review) => (
                      <div
                        key={review._id}
                        className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                                {review.userName?.charAt(0)?.toUpperCase() ||
                                  "U"}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">
                                  {review.userName || "Anonymous"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {review.userEmail}
                                </p>
                              </div>
                              <ReviewStatusBadge status={review.status} />
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={16}
                                  className={
                                    star <= review.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-300"
                                  }
                                />
                              ))}
                              <span className="text-sm text-slate-500 ml-2">
                                {new Date(
                                  review.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {review.serviceType && (
                              <p className="text-sm text-sky-600 mb-2">
                                Service: {review.serviceType}
                              </p>
                            )}
                            <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
                              "{review.comment}"
                            </p>
                          </div>
                          <div className="flex sm:flex-col gap-2">
                            {review.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleReviewStatus(review._id, "approved")
                                  }
                                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle size={20} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleReviewStatus(review._id, "rejected")
                                  }
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <XCircle size={20} />
                                </button>
                              </>
                            )}
                            {review.status !== "pending" && (
                              <button
                                onClick={() =>
                                  handleReviewStatus(review._id, "pending")
                                }
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Mark Pending"
                              >
                                <Clock size={20} />
                              </button>
                            )}
                            {reviewDeleteConfirm === review._id ? (
                              <div className="flex sm:flex-col gap-1">
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setReviewDeleteConfirm(null)}
                                  className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded hover:bg-slate-300"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  setReviewDeleteConfirm(review._id)
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Star}
                    title="No reviews found"
                    subtitle={
                      reviewFilter !== "all"
                        ? "Try a different filter"
                        : "Reviews will appear here when users submit them"
                    }
                  />
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <Modal onClose={() => setSelectedBooking(null)}>
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
        </Modal>
      )}

      {/* Progress Update Modal */}
      {progressModal && (
        <Modal onClose={() => setProgressModal(null)}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-600" /> Update Progress
              </h3>
              <button
                onClick={() => setProgressModal(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Select the current stage for booking{" "}
              <span className="font-mono font-medium text-sky-600">
                {progressModal}
              </span>
            </p>
            <div className="space-y-2">
              {progressStages.map((stage) => (
                <button
                  key={stage.value}
                  onClick={() =>
                    handleProgressUpdate(progressModal, stage.value)
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 group-hover:bg-sky-100 rounded-lg flex items-center justify-center transition-colors">
                      <span className="text-sm font-bold text-slate-600 group-hover:text-sky-600">
                        {stage.progress}%
                      </span>
                    </div>
                    <span className="font-medium text-slate-700 group-hover:text-sky-700">
                      {stage.label}
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-slate-400 group-hover:text-sky-500"
                  />
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Service Form Modal */}
      {showServiceForm && (
        <Modal
          onClose={() => {
            setShowServiceForm(false);
            setEditingService(null);
            resetServiceForm();
          }}
        >
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              {editingService ? "Edit Service" : "Add New Service"}
            </h3>
            <form onSubmit={handleServiceSubmit} className="space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={serviceForm.name}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    rows={3}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {serviceCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Icon
                  </label>
                  <select
                    value={serviceForm.icon}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, icon: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {Object.keys(iconMap).map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={serviceForm.price}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, price: e.target.value })
                    }
                    placeholder="99"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={serviceForm.duration}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        duration: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="60"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={serviceForm.discount}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        discount: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={serviceForm.status}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, status: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <button
                  type="button"
                  onClick={() =>
                    setServiceForm({
                      ...serviceForm,
                      featured: !serviceForm.featured,
                    })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${serviceForm.featured ? "bg-amber-500" : "bg-slate-300"}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${serviceForm.featured ? "translate-x-7" : "translate-x-1"}`}
                  ></span>
                </button>
                <div>
                  <p className="font-medium text-slate-900">Featured Service</p>
                  <p className="text-xs text-slate-500">
                    Display this service prominently on the homepage
                  </p>
                </div>
              </div>

              {/* Preview */}
              {(serviceForm.price || serviceForm.discount > 0) && (
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-100">
                  <p className="text-xs font-medium text-slate-600 mb-2">
                    Price Preview
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-emerald-600">
                      $
                      {serviceForm.discount > 0
                        ? (
                            (parseFloat(serviceForm.price) || 0) *
                            (1 - serviceForm.discount / 100)
                          ).toFixed(2)
                        : parseFloat(serviceForm.price || 0).toFixed(2)}
                    </span>
                    {serviceForm.discount > 0 && (
                      <>
                        <span className="text-lg text-slate-400 line-through">
                          ${parseFloat(serviceForm.price || 0).toFixed(2)}
                        </span>
                        <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-bold">
                          -{serviceForm.discount}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  {editingService ? "Update Service" : "Add Service"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowServiceForm(false);
                    setEditingService(null);
                    resetServiceForm();
                  }}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

// Helper Components
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

function ReviewStatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}
    >
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color, badge, pulse, small }) {
  const colors = {
    blue: {
      bg: "bg-blue-100",
      icon: "text-blue-600",
      badge: "text-emerald-600 bg-emerald-50",
    },
    amber: {
      bg: "bg-amber-100",
      icon: "text-amber-600",
      badge: "text-amber-600 bg-amber-50",
    },
    emerald: {
      bg: "bg-emerald-100",
      icon: "text-emerald-600",
      badge: "text-emerald-600 bg-emerald-50",
    },
    violet: {
      bg: "bg-violet-100",
      icon: "text-violet-600",
      badge: "text-violet-600 bg-violet-50",
    },
  };
  const c = colors[color] || colors.blue;
  return (
    <div
      className={`bg-white rounded-2xl ${small ? "p-4" : "p-5"} border border-slate-200 hover:shadow-lg transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        {badge && (
          <span
            className={`text-xs font-medium ${c.badge} px-2 py-1 rounded-full ${pulse ? "animate-pulse" : ""}`}
          >
            {badge}
          </span>
        )}
      </div>
      <p
        className={`${small ? "text-2xl" : "text-3xl"} font-bold text-slate-900 mb-1`}
      >
        {value}
      </p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function MiniStat({ label, value, color, active, onClick }) {
  const colors = {
    amber: "border-amber-500 bg-amber-50",
    blue: "border-blue-500 bg-blue-50",
    emerald: "border-emerald-500 bg-emerald-50",
    red: "border-red-500 bg-red-50",
  };
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all ${active ? colors[color] || "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
    >
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </button>
  );
}

function QuickActionBtn({ icon: Icon, label, sub, color, onClick }) {
  const colors = {
    amber: "bg-amber-50 hover:bg-amber-100 border-amber-100",
    blue: "bg-blue-50 hover:bg-blue-100 border-blue-100",
    emerald: "bg-emerald-50 hover:bg-emerald-100 border-emerald-100",
    violet: "bg-violet-50 hover:bg-violet-100 border-violet-100",
  };
  const iconColors = {
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
    violet: "bg-violet-100 text-violet-600",
  };
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 ${colors[color]} border rounded-xl transition-all group text-left`}
    >
      <div
        className={`w-9 h-9 ${iconColors[color]} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-slate-900 text-sm">{label}</p>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400" />
    </button>
  );
}

function RecentBookingsTable({ bookings, onView, onStatusUpdate, onViewAll }) {
  if (bookings.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Recent Bookings</h3>
            <p className="text-xs text-slate-500">{bookings.length} found</p>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 px-3 py-2 text-blue-600 font-medium text-sm hover:bg-blue-50 rounded-lg transition-colors"
        >
          View All <ChevronRight size={14} />
        </button>
      </div>
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
              <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                Status
              </th>
              <th className="px-5 py-3 text-right text-xs font-bold text-slate-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((booking) => (
              <tr
                key={booking._id || booking.bookingId}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="font-mono font-bold text-blue-600 text-sm">
                    {booking.bookingId}
                  </p>
                  <p className="text-xs text-slate-400">
                    {booking.vehicleNumber}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900 text-sm">
                    {booking.customerName}
                  </p>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <p className="text-sm text-slate-900">
                    {booking.serviceType}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(booking)}
                      className="p-2 hover:bg-blue-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    {booking.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            onStatusUpdate(
                              booking._id || booking.bookingId,
                              "Approved",
                            )
                          }
                          className="p-2 hover:bg-emerald-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() =>
                            onStatusUpdate(
                              booking._id || booking.bookingId,
                              "Rejected",
                            )
                          }
                          className="p-2 hover:bg-red-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 text-center py-16">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm">{subtitle}</p>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 text-center py-16">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-slate-600">Loading...</p>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
