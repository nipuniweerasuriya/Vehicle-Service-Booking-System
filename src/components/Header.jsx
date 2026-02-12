import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Settings,
  LayoutDashboard,
  CalendarCheck,
  User,
  LogIn,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAdminLoggedIn, logout, user, isUserLoggedIn, logoutUser } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

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
    `text-sm font-semibold transition-all duration-300 ${
      isActive(path)
        ? "text-sky-600 bg-sky-50/80"
        : "text-slate-600 hover:text-sky-600 hover:bg-sky-50/50"
    }`;

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm shadow-slate-200/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                Vehicle
              </span>
              <span className="text-slate-800">Care</span>
            </span>
            <span className="ml-1 w-2 h-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 group-hover:scale-125 transition-transform" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {!isAdminLoggedIn ? (
              <>
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-xl ${navLinkClass("/")}`}
                >
                  Home
                </Link>
                <Link
                  to="/services"
                  className={`px-4 py-2 rounded-xl ${navLinkClass("/services")}`}
                >
                  Services
                </Link>
                <Link
                  to="/track"
                  className={`px-4 py-2 rounded-xl ${navLinkClass("/track")}`}
                >
                  Track Booking
                </Link>

                <div className="w-px h-6 bg-slate-200 mx-3"></div>

                {isUserLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all duration-300 group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md shadow-sky-500/30 group-hover:shadow-lg transition-shadow">
                        <span className="text-white text-sm font-bold">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <span className="hidden lg:block">
                        {user?.name?.split(" ")[0] || "Account"}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200/60 py-2 z-50 animate-scale-in">
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm font-bold text-slate-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/my-bookings"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-3 transition-colors"
                        >
                          <CalendarCheck size={16} />
                          My Bookings
                        </Link>
                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            onClick={handleUserLogout}
                            className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className={`px-4 py-2 rounded-xl flex items-center gap-2 ${navLinkClass("/signin")}`}
                    >
                      <LogIn size={16} />
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="btn-primary ml-2 px-5 py-2.5 text-sm flex items-center gap-2 group"
                    >
                      <Sparkles
                        size={14}
                        className="group-hover:rotate-12 transition-transform"
                      />
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${navLinkClass("/admin/dashboard")}`}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link
                  to="/admin/bookings"
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${navLinkClass("/admin/bookings")}`}
                >
                  <CalendarCheck size={16} />
                  Bookings
                </Link>
                <Link
                  to="/admin/services"
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${navLinkClass("/admin/services")}`}
                >
                  <Settings size={16} />
                  Services
                </Link>
                <div className="w-px h-6 bg-slate-200 mx-2"></div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 animate-slide-down">
            <div className="flex flex-col gap-1">
              {!isAdminLoggedIn ? (
                <>
                  <Link
                    to="/"
                    className={`px-4 py-2.5 rounded-lg ${navLinkClass("/")}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/services"
                    className={`px-4 py-2.5 rounded-lg ${navLinkClass("/services")}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Services
                  </Link>
                  <Link
                    to="/track"
                    className={`px-4 py-2.5 rounded-lg ${navLinkClass("/track")}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Track Booking
                  </Link>

                  <div className="border-t border-slate-100 my-2"></div>

                  {isUserLoggedIn ? (
                    <>
                      <div className="px-4 py-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/my-bookings"
                        className={`px-4 py-2.5 rounded-lg flex items-center gap-2 ${navLinkClass("/my-bookings")}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <CalendarCheck size={16} />
                        My Bookings
                      </Link>
                      <button
                        onClick={() => {
                          handleUserLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/signin"
                        className={`px-4 py-2.5 rounded-lg flex items-center gap-2 ${navLinkClass("/signin")}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LogIn size={16} />
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        className="mx-4 mt-2 btn-primary text-center py-2.5"
                        onClick={() => setMobileMenuOpen(false)}
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
                    className={`px-4 py-2.5 rounded-lg flex items-center gap-2 ${navLinkClass("/admin/dashboard")}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/bookings"
                    className={`px-4 py-2.5 rounded-lg flex items-center gap-2 ${navLinkClass("/admin/bookings")}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <CalendarCheck size={16} />
                    Bookings
                  </Link>
                  <Link
                    to="/admin/services"
                    className={`px-4 py-2.5 rounded-lg flex items-center gap-2 ${navLinkClass("/admin/services")}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings size={16} />
                    Services
                  </Link>
                  <div className="border-t border-slate-100 my-2"></div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut size={16} />
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
