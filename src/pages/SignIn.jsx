import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn,
  Sparkles,
  Shield,
  ArrowRight,
  Chrome,
  Facebook,
  Fingerprint,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import { authAPI } from "../api";

export default function SignIn() {
  const navigate = useNavigate();
  const { login, setIsAdminLoggedIn } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for remembered email
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Handle remember me
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", formData.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      const response = await authAPI.login(formData);
      const userData = response.data;

      if (userData.role === "admin") {
        // Admin login - store admin data and redirect to dashboard
        localStorage.setItem("adminToken", userData.token);
        localStorage.setItem("adminUser", JSON.stringify(userData));
        setIsAdminLoggedIn(true);
        navigate("/admin/dashboard");
      } else {
        // Regular user login
        login(userData);
        navigate("/my-bookings");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: CheckCircle2, text: "Track your bookings" },
    { icon: CheckCircle2, text: "Get service updates" },
    { icon: CheckCircle2, text: "Exclusive offers" },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen py-12 px-4 bg-gradient-mesh relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl animate-float pointer-events-none" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float pointer-events-none"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Benefits */}
            <div
              className={`hidden lg:block transition-all duration-700 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
            >
              <div className="glass-card p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-slate-700">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Fingerprint className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Welcome Back!</h2>
                    <p className="text-slate-400 text-sm">
                      Sign in to continue
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 transition-all duration-500`}
                      style={{ transitionDelay: `${idx * 150}ms` }}
                    >
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <benefit.icon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-slate-300">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <p className="text-sm text-slate-400 mb-2">Quick Tip</p>
                  <p className="text-slate-300 text-sm">
                    Enable "Remember me" for faster access next time. Your email
                    will be saved securely.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-700">
                  <p className="text-slate-400 text-sm mb-3">
                    Trusted by thousands
                  </p>
                  <div className="flex -space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 border-2 border-slate-800 flex items-center justify-center text-xs font-bold"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                      +2k
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div
              className={`transition-all duration-700 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            >
              {/* Header */}
              <div className="text-center mb-8 lg:hidden">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-2xl blur-xl opacity-50 animate-pulse-glow pointer-events-none" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform duration-300">
                    <LogIn className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-3">
                  <span className="gradient-text">Welcome Back</span>
                </h1>
                <p className="text-slate-600 text-lg">
                  Sign in to manage your bookings
                </p>
              </div>

              {/* Form Card */}
              <div className="glass-card p-8 relative z-20">
                <div className="hidden lg:block mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">
                    Sign In
                  </h1>
                  <p className="text-slate-600">
                    Access your VehicleCare account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-scale-in">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle size={20} className="text-red-600" />
                      </div>
                      <span className="text-red-700 font-medium">{error}</span>
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="form-label flex items-center gap-2">
                      <Mail size={14} className="text-sky-500" />
                      Email Address
                    </label>
                    <div
                      className={`relative rounded-xl transition-all duration-300 ${focusedField === "email" ? "ring-2 ring-sky-400/50 shadow-lg shadow-sky-500/10" : ""}`}
                    >
                      <Mail
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 pointer-events-none ${focusedField === "email" ? "text-sky-500" : "text-slate-400"}`}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="you@example.com"
                        className="input-field pl-12 !rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="form-label flex items-center gap-2">
                        <Lock size={14} className="text-sky-500" />
                        Password
                      </label>
                      <button
                        type="button"
                        className="text-sm text-sky-600 hover:text-sky-700 font-medium hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div
                      className={`relative rounded-xl transition-all duration-300 ${focusedField === "password" ? "ring-2 ring-sky-400/50 shadow-lg shadow-sky-500/10" : ""}`}
                    >
                      <Lock
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 pointer-events-none ${focusedField === "password" ? "text-sky-500" : "text-slate-400"}`}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter your password"
                        className="input-field pl-12 pr-12 !rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition-colors duration-200 p-1"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                        rememberMe
                          ? "bg-sky-500 border-sky-500"
                          : "border-slate-300 hover:border-sky-400"
                      }`}
                    >
                      {rememberMe && (
                        <CheckCircle2 size={14} className="text-white" />
                      )}
                    </button>
                    <span className="text-slate-600 text-sm">
                      Remember me for 30 days
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg group"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <KeyRound size={20} />
                        <span>Sign In</span>
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200/70"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white/80 text-slate-500 text-sm font-medium rounded-full">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group">
                    <Chrome
                      size={20}
                      className="text-slate-600 group-hover:text-sky-600 transition-colors"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Google
                    </span>
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group">
                    <Facebook
                      size={20}
                      className="text-slate-600 group-hover:text-blue-600 transition-colors"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Facebook
                    </span>
                  </button>
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-slate-600">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-sky-600 hover:text-sky-700 font-semibold hover:underline"
                  >
                    Sign up free
                  </Link>
                </p>
              </div>

              {/* Trust badges */}
              <div className="mt-6 flex items-center justify-center gap-6 text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-emerald-500" />
                  <span className="text-sm">256-bit SSL</span>
                </div>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-sky-500" />
                  <span className="text-sm">Free Forever</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
