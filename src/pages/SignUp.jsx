import { useState, useContext, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  Phone,
  UserPlus,
  Sparkles,
  Shield,
  CheckCircle,
  ArrowRight,
  Chrome,
  Facebook,
  Rocket,
  Gift,
  Zap,
  CheckCircle2,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import { authAPI } from "../api";

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate form progress
  const formProgress = useMemo(() => {
    let completed = 0;
    if (formData.name.trim()) completed++;
    if (formData.email.trim() && /\S+@\S+\.\S+/.test(formData.email))
      completed++;
    if (
      formData.phone.trim() &&
      /^\d{10}$/.test(formData.phone.replace(/\D/g, ""))
    )
      completed++;
    if (formData.password && formData.password.length >= 6) completed++;
    if (
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    )
      completed++;
    return Math.round((completed / 5) * 100);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      login(response.data);
      navigate("/my-bookings");
    } catch (err) {
      setErrors({
        general:
          err.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { width: "0%", color: "bg-slate-200", label: "" };
    if (password.length < 6)
      return { width: "25%", color: "bg-red-500", label: "Weak" };
    if (password.length < 8)
      return { width: "50%", color: "bg-amber-500", label: "Fair" };
    if (password.length < 10)
      return { width: "75%", color: "bg-sky-500", label: "Good" };
    return { width: "100%", color: "bg-emerald-500", label: "Strong" };
  };

  const passwordStrength = getPasswordStrength();

  const benefits = [
    { icon: Rocket, title: "Quick Setup", desc: "Get started in 2 minutes" },
    { icon: Gift, title: "Free Forever", desc: "No hidden charges" },
    { icon: Zap, title: "Instant Booking", desc: "Book services instantly" },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen py-12 px-4 bg-gradient-mesh relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-float pointer-events-none" />
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-float pointer-events-none"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Benefits */}
            <div
              className={`hidden lg:block sticky top-24 transition-all duration-700 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
            >
              <div className="glass-card p-8 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white border-emerald-700/50">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Join VehicleCare</h2>
                    <p className="text-emerald-200 text-sm">
                      Create your free account
                    </p>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-200 text-sm">
                      Profile completion
                    </span>
                    <span className="text-emerald-300 font-bold">
                      {formProgress}%
                    </span>
                  </div>
                  <div className="h-2 bg-emerald-800/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${formProgress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 bg-emerald-800/30 rounded-xl border border-emerald-700/30"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <benefit.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {benefit.title}
                        </p>
                        <p className="text-emerald-200 text-sm">
                          {benefit.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-800/30 rounded-xl p-4 border border-emerald-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <p className="text-sm text-emerald-300 font-medium">
                      Your data is secure
                    </p>
                  </div>
                  <p className="text-emerald-200 text-sm">
                    We use 256-bit encryption to keep your information safe and
                    never share it with third parties.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-emerald-700/50">
                  <p className="text-emerald-200 text-sm mb-3">
                    Join 2,500+ happy customers
                  </p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} className="w-4 h-4 text-amber-400" />
                    ))}
                    <span className="ml-2 text-emerald-200 text-sm">
                      4.9/5 rating
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div
              className={`transition-all duration-700 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            >
              {/* Mobile Header */}
              <div className="text-center mb-8 lg:hidden">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-xl opacity-50 animate-pulse-glow pointer-events-none" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform duration-300">
                    <UserPlus className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                    Create Account
                  </span>
                </h1>
                <p className="text-slate-600 text-lg">
                  Sign up to book and track your services
                </p>
              </div>

              {/* Form Card */}
              <div className="glass-card p-8 relative z-20">
                <div className="hidden lg:block mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">
                    Create Account
                  </h1>
                  <p className="text-slate-600">
                    Fill in your details to get started
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* General Error Message */}
                  {errors.general && (
                    <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-scale-in">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle size={20} className="text-red-600" />
                      </div>
                      <span className="text-red-700 font-medium">
                        {errors.general}
                      </span>
                    </div>
                  )}

                  {/* Name */}
                  <div className="space-y-2">
                    <label className="form-label flex items-center gap-2">
                      <User size={14} className="text-emerald-500" />
                      Full Name
                    </label>
                    <div
                      className={`relative rounded-xl transition-all duration-300 ${focusedField === "name" ? "ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/10" : ""} ${errors.name ? "ring-2 ring-red-400/50" : ""}`}
                    >
                      <User
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 pointer-events-none ${focusedField === "name" ? "text-emerald-500" : "text-slate-400"}`}
                      />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="John Doe"
                        className="input-field pl-12 !rounded-xl"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="form-label flex items-center gap-2">
                      <Mail size={14} className="text-emerald-500" />
                      Email Address
                    </label>
                    <div
                      className={`relative rounded-xl transition-all duration-300 ${focusedField === "email" ? "ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/10" : ""} ${errors.email ? "ring-2 ring-red-400/50" : ""}`}
                    >
                      <Mail
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 pointer-events-none ${focusedField === "email" ? "text-emerald-500" : "text-slate-400"}`}
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
                    {errors.email && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="form-label flex items-center gap-2">
                      <Phone size={14} className="text-emerald-500" />
                      Phone Number
                    </label>
                    <div
                      className={`relative rounded-xl transition-all duration-300 ${focusedField === "phone" ? "ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/10" : ""} ${errors.phone ? "ring-2 ring-red-400/50" : ""}`}
                    >
                      <Phone
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 pointer-events-none ${focusedField === "phone" ? "text-emerald-500" : "text-slate-400"}`}
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="9876543210"
                        className="input-field pl-12 !rounded-xl"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="form-label flex items-center gap-2">
                      <Lock size={14} className="text-emerald-500" />
                      Password
                    </label>
                    <div
                      className={`relative rounded-xl transition-all duration-300 ${focusedField === "password" ? "ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/10" : ""} ${errors.password ? "ring-2 ring-red-400/50" : ""}`}
                    >
                      <Lock
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 pointer-events-none ${focusedField === "password" ? "text-emerald-500" : "text-slate-400"}`}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Create a password"
                        className="input-field pl-12 pr-12 !rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors duration-200 p-1"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {/* Password strength indicator */}
                    {formData.password && (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${passwordStrength.color} transition-all duration-300 rounded-full`}
                            style={{ width: passwordStrength.width }}
                          />
                        </div>
                        <span
                          className={`text-xs font-medium ${passwordStrength.color.replace("bg-", "text-")}`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="form-label flex items-center gap-2">
                      <Lock size={14} className="text-emerald-500" />
                      Confirm Password
                    </label>
                    <div
                      className={`relative rounded-xl transition-all duration-300 ${focusedField === "confirmPassword" ? "ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/10" : ""} ${errors.confirmPassword ? "ring-2 ring-red-400/50" : ""}`}
                    >
                      <Lock
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 pointer-events-none ${focusedField === "confirmPassword" ? "text-emerald-500" : "text-slate-400"}`}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Confirm your password"
                        className="input-field pl-12 !rounded-xl"
                      />
                      {formData.confirmPassword &&
                        formData.password === formData.confirmPassword && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <CheckCircle
                              size={18}
                              className="text-emerald-500"
                            />
                          </div>
                        )}
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-xl font-semibold 
                         hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all duration-300 
                         shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5
                         flex items-center justify-center gap-3 text-lg group"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus size={20} />
                        <span>Create Account</span>
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
                      Or sign up with
                    </span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <Chrome
                      size={20}
                      className="text-slate-600 group-hover:text-emerald-600 transition-colors"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Google
                    </span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <Facebook
                      size={20}
                      className="text-slate-600 group-hover:text-blue-600 transition-colors"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Facebook
                    </span>
                  </button>
                </div>

                {/* Sign In Link */}
                <p className="text-center text-slate-600">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-emerald-500" />
                  <span className="text-sm">256-bit SSL</span>
                </div>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-teal-500" />
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
