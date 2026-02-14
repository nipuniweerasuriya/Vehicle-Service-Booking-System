import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Wrench,
  Users,
  Star,
  Calendar,
  Phone,
  Zap,
  Award,
  Car,
  BadgeCheck,
  ChevronDown,
  FileCheck,
  MousePointerClick,
  ChevronRight,
  Sparkles,
  Droplet,
  Gauge,
  Settings,
  Wind,
  Battery,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BookingContext } from "../context/BookingContext";
import { AuthContext } from "../context/AuthContext";
import { reviewsAPI } from "../api";

function useCountUp(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
    }
  }, [startOnView]);

  useEffect(() => {
    if (startOnView && ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
          }
        },
        { threshold: 0.5 },
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime;
    const numericEnd = parseInt(end.replace(/\D/g, ""));

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * numericEnd));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, hasStarted]);

  return { count, ref };
}

export default function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { services } = useContext(BookingContext);
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewsAPI.getAll();
        setReviews(response.data.slice(0, 6));
      } catch (err) {
        console.log("Failed to fetch reviews");
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const slides = [
    {
      title: "Professional Vehicle Care",
      description:
        "Expert maintenance and repair services from certified technicians",
    },
    {
      title: "Quality You Can Trust",
      description:
        "Premium parts, comprehensive warranty, and transparent pricing",
    },
    {
      title: "Convenient & Reliable",
      description:
        "Flexible scheduling with same-day service options available",
    },
  ];

  const stats = [
    {
      value: "2,500+",
      label: "Services Completed",
      icon: Wrench,
      color: "sky",
    },
    {
      value: "98%",
      label: "Customer Satisfaction",
      icon: Star,
      color: "amber",
    },
    {
      value: "24/7",
      label: "Support Available",
      icon: Phone,
      color: "emerald",
    },
    { value: "50+", label: "Expert Technicians", icon: Users, color: "violet" },
  ];

  const features = [
    {
      icon: Zap,
      title: "Quick Booking",
      description:
        "Book your service online in under 2 minutes with our streamlined system",
      color: "from-sky-500 to-cyan-500",
    },
    {
      icon: BadgeCheck,
      title: "Certified Technicians",
      description:
        "All our technicians are ASE-certified with extensive experience",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description:
        "Open 7 days a week with convenient time slots to fit your schedule",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Shield,
      title: "Guaranteed Quality",
      description:
        "12-month warranty on all parts and labor for your peace of mind",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const defaultTestimonials = [
    {
      userName: "John Smith",
      serviceType: "Toyota Owner",
      comment:
        "Excellent service! My car runs like new after the maintenance. Highly recommend!",
      rating: 5,
    },
    {
      userName: "Sarah Johnson",
      serviceType: "Honda Owner",
      comment:
        "Fast, professional, and affordable. The online booking system is super convenient.",
      rating: 5,
    },
    {
      userName: "Mike Davis",
      serviceType: "BMW Owner",
      comment:
        "Best auto service I've ever experienced. The team really knows their stuff!",
      rating: 5,
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultTestimonials;

  const howItWorks = [
    {
      step: 1,
      icon: MousePointerClick,
      title: "Choose Service",
      description: "Browse and select your needed service",
      color: "from-sky-500 to-cyan-500",
    },
    {
      step: 2,
      icon: Calendar,
      title: "Book Online",
      description: "Pick your preferred date and time",
      color: "from-violet-500 to-purple-500",
    },
    {
      step: 3,
      icon: Car,
      title: "Drop Off",
      description: "Bring your vehicle to our center",
      color: "from-amber-500 to-orange-500",
    },
    {
      step: 4,
      icon: FileCheck,
      title: "Done!",
      description: "We'll notify you when it's ready",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const faqs = [
    {
      question: "How long does a typical service take?",
      answer:
        "Most standard services take 1-3 hours. Complex repairs may take longer, and we'll provide an estimate upfront.",
    },
    {
      question: "Do you provide pickup and drop-off service?",
      answer:
        "Yes! We offer complimentary pickup and drop-off within a 10-mile radius for services over $100.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, cash, and digital wallets like Apple Pay and Google Pay.",
    },
    {
      question: "Is there a warranty on repairs?",
      answer:
        "Absolutely! All our repairs come with a 12-month or 12,000-mile warranty, whichever comes first.",
    },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  const quickServices = [
    { icon: Droplet, label: "Oil Change", time: "30 min", price: "$49" },
    { icon: Gauge, label: "Brake Check", time: "45 min", price: "$29" },
    { icon: Settings, label: "Engine Tune", time: "2 hrs", price: "$149" },
    { icon: Wind, label: "AC Service", time: "1 hr", price: "$89" },
    { icon: Battery, label: "Battery", time: "20 min", price: "$99" },
    { icon: Car, label: "Full Service", time: "3 hrs", price: "$299" },
  ];

  const filteredServices = useMemo(() => {
    return services.slice(0, 6);
  }, [services]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <>
      <Header />

      <main className="bg-slate-50">
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-400 text-sm font-medium mb-6">
                  <CheckCircle size={16} />
                  Trusted Auto Service Center
                </div>

                <div className="relative h-24 md:h-32 mb-6 overflow-hidden">
                  {slides.map((slide, idx) => (
                    <h1
                      key={idx}
                      className={`absolute inset-0 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight transition-all duration-700 ${
                        idx === currentSlide
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      }`}
                    >
                      {slide.title}
                    </h1>
                  ))}
                </div>

                <div className="relative h-16 mb-10 overflow-hidden">
                  {slides.map((slide, idx) => (
                    <p
                      key={idx}
                      className={`absolute inset-0 text-lg text-slate-400 leading-relaxed transition-all duration-700 delay-100 ${
                        idx === currentSlide
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      }`}
                    >
                      {slide.description}
                    </p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                  <Link
                    to="/services"
                    className="btn-primary flex items-center gap-2 px-8 py-4 text-lg"
                  >
                    <span>Book a Service</span>
                    <ArrowRight size={20} />
                  </Link>
                  {user ? (
                    <Link
                      to="/my-bookings"
                      className="px-8 py-4 text-lg text-white border-2 border-slate-600 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                      My Bookings
                    </Link>
                  ) : (
                    <Link
                      to="/signin"
                      className="px-8 py-4 text-lg text-white border-2 border-slate-600 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                      Sign In
                    </Link>
                  )}
                </div>

                <div className="flex gap-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentSlide
                          ? "bg-sky-500 w-8"
                          : "bg-slate-600 w-2 hover:bg-slate-500"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, idx) => {
                  const colorClasses = {
                    sky: "text-sky-400 bg-sky-400/10 border-sky-400/20",
                    amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
                    emerald:
                      "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
                    violet:
                      "text-violet-400 bg-violet-400/10 border-violet-400/20",
                  };
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  const { count, ref } = useCountUp(stat.value, 2000);
                  const suffix = stat.value.replace(/[0-9,]/g, "");
                  return (
                    <div
                      key={idx}
                      ref={ref}
                      className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300 group"
                    >
                      <div
                        className={`w-12 h-12 ${colorClasses[stat.color]} rounded-xl flex items-center justify-center mb-4 border`}
                      >
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">
                        {count.toLocaleString()}
                        {suffix}
                      </p>
                      <p className="text-sm text-slate-400">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
              <path
                fill="#f8fafc"
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              ></path>
            </svg>
          </div>
        </section>

        <section className="py-12 px-4 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Quick Services
              </h2>
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Available Now
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickServices.map((service, idx) => (
                <Link
                  key={idx}
                  to="/services"
                  className="group bg-white rounded-xl p-4 border border-slate-200 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <service.icon className="w-6 h-6 text-sky-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">
                    {service.label}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={12} />
                    <span>{service.time}</span>
                  </div>
                  <p className="text-sky-600 font-bold text-sm mt-2">
                    {service.price}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="bg-gradient-to-r from-sky-100 to-cyan-100 px-5 py-2 rounded-full text-sm font-bold text-sky-700 inline-block mb-4">
                Why Choose Us
              </span>
              <h2 className="text-4xl font-bold mb-4">
                <span className="gradient-text">Smart Service Experience</span>
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                Combining cutting-edge technology with expert craftsmanship
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  <div
                    className={`relative w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="relative">
                    <h3 className="font-bold text-xl text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="bg-gradient-to-r from-violet-100 to-purple-100 px-5 py-2 rounded-full text-sm font-bold text-violet-700 inline-block mb-4">
                Simple Process
              </span>
              <h2 className="text-4xl font-bold mb-4">
                <span className="gradient-text">How It Works</span>
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                Get your vehicle serviced in just 4 easy steps
              </p>
            </div>

            <div className="relative">
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-sky-200 via-violet-200 to-emerald-200 -translate-y-1/2 rounded-full" />

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {howItWorks.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="relative bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-100 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 z-10">
                      {/* Step Number Badge */}
                      <div
                        className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                      >
                        {item.step}
                      </div>

                      <div
                        className={`w-16 h-16 mx-auto mb-5 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                      >
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                to="/services"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg shadow-lg shadow-sky-500/30"
              >
                <Sparkles size={20} />
                Get Started Now
              </Link>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <span className="bg-gradient-to-r from-sky-100 to-cyan-100 px-5 py-2 rounded-full text-sm font-bold text-sky-700 inline-block mb-4">
                  Our Services
                </span>
                <h2 className="text-4xl font-bold mb-4">
                  <span className="gradient-text">Popular Services</span>
                </h2>
                <p className="text-slate-600 max-w-xl text-lg">
                  Comprehensive solutions for all your vehicle needs
                </p>
              </div>
              <Link
                to="/services"
                className="btn-primary mt-6 md:mt-0 w-fit flex items-center gap-2"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, idx) => {
                const gradients = [
                  "from-sky-500 to-cyan-500",
                  "from-emerald-500 to-teal-500",
                  "from-violet-500 to-purple-500",
                  "from-orange-500 to-red-500",
                  "from-amber-500 to-orange-500",
                  "from-indigo-500 to-violet-500",
                ];
                return (
                  <Link
                    key={service._id || idx}
                    to="/services"
                    className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br ${gradients[idx % gradients.length]} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                      >
                        <Wrench className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 mt-6">
                        <h3 className="font-bold text-lg mb-1 text-slate-900">
                          {service.name}
                        </h3>
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold gradient-text">
                            {service.price}
                          </p>
                          <span className="text-sky-500 text-sm font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            Book <ChevronRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="bg-gradient-to-r from-amber-100 to-orange-100 px-5 py-2 rounded-full text-sm font-bold text-amber-700 inline-block mb-4">
                Customer Reviews
              </span>
              <h2 className="text-4xl font-bold mb-4">
                <span className="gradient-text">Trusted by Thousands</span>
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                Real feedback from our satisfied customers
              </p>
            </div>

            {reviewsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-3 border-slate-200 border-t-sky-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {displayReviews.map((review, idx) => (
                  <div
                    key={review._id || idx}
                    className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-transparent hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex gap-1 mb-4">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className="fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-slate-700 mb-6 italic line-clamp-4">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                        {(review.userName || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {review.userName || "Customer"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {review.serviceType || "Vehicle Service"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="contact" className="py-20 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="bg-gradient-to-r from-emerald-100 to-teal-100 px-5 py-2 rounded-full text-sm font-bold text-emerald-700 inline-block mb-4">
                Got Questions?
              </span>
              <h2 className="text-4xl font-bold mb-4">
                <span className="gradient-text">
                  Frequently Asked Questions
                </span>
              </h2>
              <p className="text-slate-600 text-lg">
                Find answers to common questions
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:border-sky-200 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-100/50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 text-lg">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-slate-500 transition-transform duration-300 flex-shrink-0 ${
                        openFaq === idx ? "rotate-180 text-sky-500" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === idx ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <p className="px-6 pb-6 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <p className="text-slate-600 mb-4">Still have questions?</p>
              <Link
                to="/signin"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Phone size={18} />
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 md:p-16 text-center overflow-hidden">
              {/* Animated background */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
              <div
                className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow"
                style={{ animationDelay: "2s" }}
              ></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/20 border border-sky-500/30 rounded-full text-sky-400 text-sm font-medium mb-6">
                  <Sparkles size={16} className="animate-pulse" />
                  Professional Auto Care
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Book Your Service Today
                </h2>
                <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                  Experience premium vehicle service from our certified
                  technicians
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/services"
                    className="btn-primary px-10 py-4 text-lg flex items-center gap-2 shadow-lg shadow-sky-500/30"
                  >
                    <Sparkles size={20} />
                    Book Now
                  </Link>
                  <Link
                    to="/signup"
                    className="px-10 py-4 text-lg text-white border-2 border-slate-600 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
