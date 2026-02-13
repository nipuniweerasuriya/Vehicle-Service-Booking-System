import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
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
  Sparkles,
  Zap,
  Award,
  Target,
  HeartHandshake,
  Car,
  Settings,
  BadgeCheck,
  ChevronDown,
  MapPin,
  FileCheck,
  CreditCard,
  ClipboardList,
  MousePointerClick,
  Play,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BookingContext } from "../context/BookingContext";
import { reviewsAPI } from "../api";

// Custom hook for animated counter
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const { services } = useContext(BookingContext);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Fetch approved reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewsAPI.getAll();
        setReviews(response.data.slice(0, 6)); // Show max 6 reviews
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
      subtitle: "Expert maintenance and repair services",
      description:
        "Trust our certified technicians to keep your vehicle running at peak performance",
    },
    {
      title: "Quick and Reliable",
      subtitle: "Same-day service available",
      description:
        "Get back on the road faster with our efficient service process",
    },
    {
      title: "Quality Guaranteed",
      subtitle: "Genuine parts and warranty",
      description:
        "We use only certified parts and stand behind every repair we make",
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
        "Book your service in under 2 minutes with our streamlined online system",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: BadgeCheck,
      title: "Certified Experts",
      description: "All technicians are professionally trained and certified",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description:
        "Choose a time that works for you with our flexible appointment slots",
      color: "from-sky-500 to-blue-500",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Every service is backed by our satisfaction guarantee",
      color: "from-violet-500 to-purple-500",
    },
  ];

  // Default testimonials if no reviews available
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

  // Use fetched reviews if available, otherwise use defaults
  const displayReviews = reviews.length > 0 ? reviews : defaultTestimonials;

  const howItWorks = [
    {
      step: 1,
      icon: MousePointerClick,
      title: "Choose Service",
      description: "Browse our services and select what your vehicle needs",
      color: "from-sky-500 to-cyan-500",
    },
    {
      step: 2,
      icon: Calendar,
      title: "Book Appointment",
      description: "Pick a convenient date and time for your service",
      color: "from-violet-500 to-purple-500",
    },
    {
      step: 3,
      icon: Car,
      title: "Drop Off Vehicle",
      description:
        "Bring your vehicle to our service center at the scheduled time",
      color: "from-amber-500 to-orange-500",
    },
    {
      step: 4,
      icon: FileCheck,
      title: "Get It Done",
      description: "We service your vehicle and notify you when it's ready",
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <>
      <Header />

      <main className="bg-slate-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-400 text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse-slow"></span>
                  Professional Auto Service
                </div>

                <div className="relative h-32 mb-6 overflow-hidden">
                  {slides.map((slide, idx) => (
                    <h1
                      key={idx}
                      className={`absolute inset-0 text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight transition-all duration-700 ${
                        idx === currentSlide
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      }`}
                    >
                      {slide.title}
                    </h1>
                  ))}
                </div>

                <div className="relative h-20 mb-8 overflow-hidden">
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

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/services"
                    className="btn-primary flex items-center gap-2 px-6 py-3"
                  >
                    <span>View Services</span>
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/signin"
                    className="btn-ghost text-white border border-slate-600 hover:bg-slate-800 flex items-center gap-2 px-6 py-3"
                  >
                    <span>Sign In</span>
                  </Link>
                </div>

                {/* Slide Indicators */}
                <div className="flex gap-2 mt-8">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentSlide
                          ? "bg-sky-500 w-8"
                          : "bg-slate-600 w-4 hover:bg-slate-500"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Content - Stats */}
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
                      className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 group"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div
                        className={`w-12 h-12 ${colorClasses[stat.color]} rounded-xl flex items-center justify-center mb-4 border transition-all group-hover:scale-110`}
                      >
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <p className="text-3xl md:text-4xl font-bold text-white mb-1">
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

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
              <path
                fill="#f8fafc"
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section id="about" className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="bg-gradient-to-r from-sky-100 to-cyan-100 px-5 py-2 rounded-full text-sm font-bold text-sky-700 inline-block mb-4">
                Why Choose Us
              </span>
              <h2 className="text-4xl font-bold mb-4">
                <span className="gradient-text">Experience the Difference</span>
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                We combine expertise, quality, and convenience to deliver the
                best vehicle service experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="glass-card p-6 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white"
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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Connector Line */}
                  {idx < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-slate-300 to-slate-200" />
                  )}

                  <div className="relative glass-card p-6 text-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    {/* Step Number */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-sm font-bold text-slate-700 border border-slate-200">
                      {item.step}
                    </div>

                    <div
                      className={`w-16 h-16 mx-auto mb-5 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/services"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
              >
                <Play size={20} />
                Get Started Now
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <span className="bg-gradient-to-r from-sky-100 to-cyan-100 px-5 py-2 rounded-full text-sm font-bold text-sky-700 inline-block mb-4">
                  Our Services
                </span>
                <h2 className="text-4xl font-bold mb-4">
                  <span className="gradient-text">What We Offer</span>
                </h2>
                <p className="text-slate-600 max-w-xl text-lg">
                  Comprehensive vehicle maintenance and repair solutions for all
                  your needs
                </p>
              </div>
              <Link
                to="/services"
                className="btn-primary mt-6 md:mt-0 w-fit flex items-center gap-2"
              >
                View All Services
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((service, idx) => {
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
                    className="glass-card p-6 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br ${gradients[idx]} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}
                      >
                        <Wrench className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1 truncate text-slate-900">
                          {service.name}
                        </h3>
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold gradient-text">
                            {service.price}
                          </p>
                          <span className="text-sky-500 text-sm font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            Book Now <ArrowRight size={14} />
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

        {/* Customer Reviews Section */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="bg-gradient-to-r from-amber-100 to-orange-100 px-5 py-2 rounded-full text-sm font-bold text-amber-700 inline-block mb-4">
                Customer Reviews
              </span>
              <h2 className="text-4xl font-bold mb-4">
                <span className="gradient-text">What Our Customers Say</span>
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                Real feedback from our valued customers
              </p>
            </div>

            {reviewsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {displayReviews.map((review, idx) => (
                  <div
                    key={review._id || idx}
                    className="glass-card p-6 hover:shadow-xl transition-all duration-300"
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
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
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
        <section
          id="contact"
          className="py-24 px-4 bg-gradient-to-b from-white to-slate-50"
        >
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
                Find answers to common questions about our services
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="glass-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 text-lg">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-slate-500 transition-transform duration-300 flex-shrink-0 ${
                        openFaq === idx ? "rotate-180" : ""
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
              <a
                href="tel:+15551234567"
                className="btn-outline inline-flex items-center gap-2"
              >
                <Phone size={18} />
                Contact Support
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-gradient-mesh">
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 md:p-16 text-center overflow-hidden">
              {/* Background decorations */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/20 border border-sky-500/30 rounded-full text-sky-400 text-sm font-medium mb-6">
                  <Sparkles size={16} />
                  Ready to Get Started?
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Book Your Service Today
                </h2>
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                  Experience professional vehicle care with our expert
                  technicians. Quality service, guaranteed satisfaction.
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
                    to="/signin"
                    className="px-10 py-4 text-lg text-white border-2 border-slate-600 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    Sign In / Sign Up
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
