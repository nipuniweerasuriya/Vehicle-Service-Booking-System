import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Wrench,
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
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const { isAdminLoggedIn, logout, user, isUserLoggedIn, logoutUser } =
    useContext(AuthContext);

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || '{"name": "Admin"}',
  );
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
                  to="/reviews"
                  className={`px-4 py-2 rounded-xl ${navLinkClass("/reviews")}`}
                >
                  Reviews
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
              <div className="relative">
                <button
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {(adminUser.name || "A").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {adminUser.name || "Admin"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${adminMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {adminMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setAdminMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/bookings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        <CalendarCheck size={16} />
                        Bookings
                      </Link>
                      <Link
                        to="/admin/services"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        <Wrench size={16} />
                        Services
                      </Link>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={() => {
                          setAdminMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
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
                    to="/reviews"
                    className={`px-4 py-2.5 rounded-lg ${navLinkClass("/reviews")}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reviews
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
                  <div className="px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg mb-2 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
                      {(adminUser.name || "A").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {adminUser.name || "Admin"}
                      </p>
                      <p className="text-xs text-white/70">Administrator</p>
                    </div>
                  </div>
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
                    <Wrench size={16} />
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
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slideDown { animation: slideDown 0.2s ease-out; }
      `}</style>
    </header>
  );
}
