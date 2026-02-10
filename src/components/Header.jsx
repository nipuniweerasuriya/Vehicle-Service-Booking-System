import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdminLoggedIn, setIsAdminLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    navigate("/admin/login");
  };

  return (
    <header className="bg-white shadow-medium sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-300 transform group-hover:scale-110">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">
              VehicleCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAdminLoggedIn ? (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Home
                </Link>
                <Link
                  to="/services"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Services
                </Link>
                <Link
                  to="/book"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Book Service
                </Link>
                <Link
                  to="/track"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Track Booking
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/bookings"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Bookings
                </Link>
                <Link
                  to="/admin/services"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Services
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 font-medium transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            {!isAdminLoggedIn ? (
              <>
                <Link
                  to="/"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  Home
                </Link>
                <Link
                  to="/services"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  Services
                </Link>
                <Link
                  to="/book"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  Book Service
                </Link>
                <Link
                  to="/track"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  Track Booking
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin/dashboard"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/bookings"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  Bookings
                </Link>
                <Link
                  to="/admin/services"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  Services
                </Link>
                <button
                  onClick={handleLogout}
                  className="block py-2 w-full text-left text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
