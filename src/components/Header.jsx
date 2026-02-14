import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Wrench,
  LayoutDashboard,
  CalendarCheck,
  LogIn,
  ChevronDown,
  Bell,
  CreditCard,
  Check,
  Clock,
} from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { notificationsAPI } from "../api";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { isAdminLoggedIn, logout, user, isUserLoggedIn, logoutUser } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (isUserLoggedIn) {
        try {
          const res = await notificationsAPI.getAll();
          setNotifications(res.data);
        } catch (err) {
          console.log("Failed to fetch notifications");
        }
      } else if (isAdminLoggedIn) {
        try {
          const res = await notificationsAPI.getAdminNotifications();
          setNotifications(res.data);
        } catch (err) {
          console.log("Failed to fetch admin notifications");
        }
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isUserLoggedIn, isAdminLoggedIn]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.log("Failed to mark as read");
    }
  };

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || '{"name": "Admin"}',
  );

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const handleUserLogout = () => {
    logoutUser();
    setUserMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? "text-sky-600 bg-sky-50"
        : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
    }`;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="text-sky-600">Vehicle</span>
              <span className="text-slate-800">Care</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {!isAdminLoggedIn ? (
              <>
                <Link to="/" className={navLinkClass("/")}>
                  Home
                </Link>
                <Link to="/services" className={navLinkClass("/services")}>
                  Services
                </Link>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition-all"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition-all"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition-all"
                >
                  Contact
                </button>

                <div className="w-px h-6 bg-slate-200 mx-2"></div>

                {isUserLoggedIn ? (
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <button
                        onClick={() => {
                          setNotifMenuOpen(!notifMenuOpen);
                          setUserMenuOpen(false);
                        }}
                        className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                      >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      {notifMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setNotifMenuOpen(false)}
                          />
                          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
                            <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                              <p className="font-semibold text-slate-900">
                                Notifications
                              </p>
                              {unreadCount > 0 && (
                                <span className="text-xs text-sky-600 font-medium">
                                  {unreadCount} new
                                </span>
                              )}
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                              {notifications.length === 0 ? (
                                <div className="px-4 py-8 text-center text-sm text-slate-500">
                                  No notifications yet
                                </div>
                              ) : (
                                notifications.map((notif) => (
                                  <div
                                    key={notif._id}
                                    className={`px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 ${
                                      !notif.read ? "bg-sky-50/50" : ""
                                    }`}
                                    onClick={() => {
                                      markAsRead(notif._id);
                                      if (notif.type === "payment_required") {
                                        navigate("/my-bookings");
                                        setNotifMenuOpen(false);
                                      }
                                    }}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                          notif.type === "payment_required"
                                            ? "bg-amber-100"
                                            : "bg-emerald-100"
                                        }`}
                                      >
                                        {notif.type === "payment_required" ? (
                                          <CreditCard
                                            size={16}
                                            className="text-amber-600"
                                          />
                                        ) : (
                                          <Check
                                            size={16}
                                            className="text-emerald-600"
                                          />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900">
                                          {notif.title}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                          {notif.message}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                          <Clock size={10} />
                                          {new Date(
                                            notif.createdAt,
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                      {!notif.read && (
                                        <span className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0 mt-1"></span>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => {
                          setUserMenuOpen(!userMenuOpen);
                          setNotifMenuOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-slate-700 hidden lg:block">
                          {user?.name?.split(" ")[0] || "Account"}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-slate-400 transition-transform ${
                            userMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {userMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setUserMenuOpen(false)}
                          />
                          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
                            <div className="px-4 py-3 border-b border-slate-100">
                              <p className="font-semibold text-slate-900">
                                {user?.name}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {user?.email}
                              </p>
                            </div>
                            <Link
                              to="/my-bookings"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <CalendarCheck size={18} />
                              My Bookings
                            </Link>
                            <div className="border-t border-slate-100 mt-1 pt-1">
                              <button
                                onClick={handleUserLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <LogOut size={18} />
                                Sign Out
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition-all"
                    >
                      <LogIn size={16} />
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/admin/dashboard"
                  className={navLinkClass("/admin/dashboard")}
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </span>
                </Link>
                <Link
                  to="/admin/bookings"
                  className={navLinkClass("/admin/bookings")}
                >
                  <span className="flex items-center gap-2">
                    <CalendarCheck size={16} />
                    Bookings
                  </span>
                </Link>
                <Link
                  to="/admin/services"
                  className={navLinkClass("/admin/services")}
                >
                  <span className="flex items-center gap-2">
                    <Wrench size={16} />
                    Services
                  </span>
                </Link>

                <div className="w-px h-6 bg-slate-200 mx-2"></div>

                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifMenuOpen(!notifMenuOpen);
                      setAdminMenuOpen(false);
                    }}
                    className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setNotifMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
                        <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                          <p className="font-semibold text-slate-900">
                            Admin Notifications
                          </p>
                          {unreadCount > 0 && (
                            <span className="text-xs text-sky-600 font-medium">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-slate-500">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <div
                                key={notif._id}
                                className={`px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 ${
                                  !notif.read ? "bg-emerald-50/50" : ""
                                }`}
                                onClick={() => markAsRead(notif._id)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-100">
                                    <CreditCard
                                      size={16}
                                      className="text-emerald-600"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900">
                                      {notif.title}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                      {notif.message}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                      <Clock size={10} />
                                      {new Date(
                                        notif.createdAt,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  {!notif.read && (
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1"></span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      setAdminMenuOpen(!adminMenuOpen);
                      setNotifMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {(adminUser.name || "A").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {adminUser.name || "Admin"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform ${
                        adminMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {adminMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setAdminMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setAdminMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                        <Link
                          to="/admin/bookings"
                          onClick={() => setAdminMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <CalendarCheck size={16} />
                          Bookings
                        </Link>
                        <Link
                          to="/admin/services"
                          onClick={() => setAdminMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Wrench size={16} />
                          Services
                        </Link>
                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            onClick={() => {
                              setAdminMenuOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <div className="flex flex-col gap-1">
              {!isAdminLoggedIn ? (
                <>
                  <Link
                    to="/"
                    className={`px-4 py-3 rounded-lg ${
                      isActive("/")
                        ? "text-sky-600 bg-sky-50"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/services"
                    className={`px-4 py-3 rounded-lg ${
                      isActive("/services")
                        ? "text-sky-600 bg-sky-50"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Services
                  </Link>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 text-left"
                  >
                    How It Works
                  </button>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 text-left"
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 text-left"
                  >
                    Contact
                  </button>

                  <div className="border-t border-slate-100 my-2"></div>

                  {isUserLoggedIn ? (
                    <>
                      <div className="px-4 py-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/my-bookings"
                        className="px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <CalendarCheck size={18} />
                        My Bookings
                      </Link>
                      <button
                        onClick={() => {
                          handleUserLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-3 w-full text-left"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/signin"
                        className="px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LogIn size={18} />
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        className="mx-4 mt-2 py-3 bg-sky-500 text-white text-center rounded-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="px-4 py-3 flex items-center gap-3 bg-slate-50 rounded-lg mx-2 mb-2">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {(adminUser.name || "A").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {adminUser.name || "Admin"}
                      </p>
                      <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                  </div>
                  <Link
                    to="/admin/dashboard"
                    className={`px-4 py-3 rounded-lg flex items-center gap-3 ${
                      isActive("/admin/dashboard")
                        ? "text-sky-600 bg-sky-50"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/bookings"
                    className={`px-4 py-3 rounded-lg flex items-center gap-3 ${
                      isActive("/admin/bookings")
                        ? "text-sky-600 bg-sky-50"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <CalendarCheck size={18} />
                    Bookings
                  </Link>
                  <Link
                    to="/admin/services"
                    className={`px-4 py-3 rounded-lg flex items-center gap-3 ${
                      isActive("/admin/services")
                        ? "text-sky-600 bg-sky-50"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Wrench size={18} />
                    Services
                  </Link>
                  <div className="border-t border-slate-100 my-2"></div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-3 w-full text-left"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
