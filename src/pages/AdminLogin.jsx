import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Lock,
  Mail,
  AlertCircle,
  Shield,
  Sparkles,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { authAPI } from "../api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setIsAdminLoggedIn } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.adminLogin({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminUser", JSON.stringify(response.data));
      setIsAdminLoggedIn(true);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Home
        </Link>

        
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Shield className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-slate-400">Vehicle Service Booking System</p>
        </div>

        
        <div className="glass-card p-8 bg-white/95 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={20} className="text-sky-500" />
            <h2 className="text-xl font-bold text-slate-900">
              Administrator Login
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                <AlertCircle
                  className="text-red-500 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@vehiclecare.com"
                  className="input-field pl-12"
                  disabled={loading}
                />
              </div>
            </div>

            
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-field pl-12 pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500 cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-slate-600 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 font-bold text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-3 font-medium">
              Demo Credentials:
            </p>
            <div className="bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Email:</span>
                <code className="bg-white px-3 py-1 rounded-lg text-sky-600 font-medium">
                  admin@vehiclecare.com
                </code>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Password:</span>
                <code className="bg-white px-3 py-1 rounded-lg text-sky-600 font-medium">
                  admin123
                </code>
              </div>
            </div>
          </div>
        </div>

        
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            This admin portal is restricted to authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
