import { useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  Droplet,
  Zap,
  Disc3,
  Battery,
  Wind,
  X,
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  CheckCircle,
  ChevronRight,
  Sparkles,
  ClipboardCheck,
  Search,
  Target,
  Star,
  Timer,
  Tag,
  Filter,
  CreditCard,
  Banknote,
  Lock,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BookingContext } from "../context/BookingContext";
import { AuthContext } from "../context/AuthContext";

export default function ServiceList() {
  const navigate = useNavigate();
  const { services, addBooking } = useContext(BookingContext);
  const { user, isUserLoggedIn } = useContext(AuthContext);

  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicleNo: "",
    vehicleModel: "",
    date: "",
    time: "",
    paymentMethod: "cash",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
  });
  const [errors, setErrors] = useState({});

  const openBookingModal = (service) => {
    if (!isUserLoggedIn) {
      navigate("/signin", {
        state: {
          from: "/services",
          message: "Please sign in to book a service",
        },
      });
      return;
    }

    setSelectedService(service);
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      vehicleNo: "",
      vehicleModel: "",
      date: "",
      time: "",
      paymentMethod: "cash",
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
      cardName: "",
    });
    setStep(1);
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
    setStep(1);
  };

  const quickDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
      });
    }
    return dates;
  }, []);

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.date) newErrors.date = "Please select a date";
      if (!formData.time) newErrors.time = "Please select a time";
    } else if (step === 2) {
      if (!formData.vehicleNo.trim())
        newErrors.vehicleNo = "Vehicle number is required";
      if (!formData.vehicleModel.trim())
        newErrors.vehicleModel = "Vehicle model is required";
      if (!formData.paymentMethod)
        newErrors.paymentMethod = "Please select a payment method";
      if (formData.paymentMethod === "card") {
        if (
          !formData.cardNumber.trim() ||
          formData.cardNumber.replace(/\s/g, "").length !== 16
        )
          newErrors.cardNumber = "Enter valid 16-digit card number";
        if (
          !formData.cardExpiry.trim() ||
          !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)
        )
          newErrors.cardExpiry = "Enter valid expiry (MM/YY)";
        if (!formData.cardCvv.trim() || !/^\d{3,4}$/.test(formData.cardCvv))
          newErrors.cardCvv = "Enter valid CVV";
        if (!formData.cardName.trim())
          newErrors.cardName = "Cardholder name is required";
      }
      if (!isUserLoggedIn) {
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone is required";
        else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
          newErrors.phone = "Enter valid 10-digit phone";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const bookingData = {
        name: isUserLoggedIn ? user.name : formData.name,
        phone: isUserLoggedIn ? user.phone : formData.phone,
        vehicleNo: formData.vehicleNo,
        vehicleModel: formData.vehicleModel,
        service: selectedService.name,
        servicePrice: selectedService.price,
        date: formData.date,
        time: formData.time,
        paymentMethod: formData.paymentMethod,
        paymentStatus: "pending",
        cardLast4:
          formData.paymentMethod === "card"
            ? formData.cardNumber.slice(-4)
            : null,
      };

      await addBooking(bookingData);
      setStep(4);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  const iconMap = {
    Wrench: Wrench,
    Droplet: Droplet,
    Zap: Zap,
    Disc3: Disc3,
    Battery: Battery,
    Wind: Wind,
    ClipboardCheck: ClipboardCheck,
    Search: Search,
    Target: Target,
    Sparkles: Sparkles,
    Star: Star,
    Car: Car,
    Clock: Clock,
    Calendar: Calendar,
    Shield: CheckCircle,
  };

  const categoryColors = {
    maintenance: {
      bg: "from-blue-500 to-cyan-500",
      light: "bg-blue-100 text-blue-700",
    },
    repair: {
      bg: "from-amber-500 to-orange-500",
      light: "bg-amber-100 text-amber-700",
    },
    inspection: {
      bg: "from-violet-500 to-purple-500",
      light: "bg-violet-100 text-violet-700",
    },
    comfort: {
      bg: "from-emerald-500 to-teal-500",
      light: "bg-emerald-100 text-emerald-700",
    },
  };

  const activeServices = services.filter((s) => s.status !== "inactive");
  const featuredServices = activeServices.filter((s) => s.featured);
  const regularServices = activeServices.filter((s) => !s.featured);

  return (
    <>
      <Header />

      <main className="min-h-screen py-16 px-4 bg-gradient-mesh">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-fade-in text-center">
            <div className="mb-4 inline-block">
              <span className="bg-gradient-to-r from-sky-100 to-cyan-100 px-5 py-2 rounded-full text-sm font-bold text-sky-700">
                Our Services
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">
                Professional Vehicle Services
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of professional vehicle
              maintenance and repair services.
            </p>
          </div>

          {featuredServices.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h2 className="text-xl font-bold text-slate-900">
                  Featured Services
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredServices.map((service) => {
                  const IconComponent = iconMap[service.icon] || Wrench;
                  const catColors =
                    categoryColors[service.category] ||
                    categoryColors.maintenance;
                  const price =
                    typeof service.price === "number"
                      ? service.price
                      : parseFloat(service.price) || 0;
                  const finalPrice =
                    service.discount > 0
                      ? (price * (1 - service.discount / 100)).toFixed(0)
                      : price;

                  return (
                    <div
                      key={service._id || service.id}
                      className="glass-card p-6 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-white"
                    >
                      <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Star size={12} className="fill-white" /> Featured
                      </div>

                      {service.discount > 0 && (
                        <div className="absolute -top-3 right-4 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                          -{service.discount}% OFF
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-4 mt-2">
                        <div
                          className={`p-3 bg-gradient-to-br ${catColors.bg} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="text-white" size={28} />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold gradient-text">
                            ${finalPrice}
                          </div>
                          {service.discount > 0 && (
                            <div className="text-sm text-slate-400 line-through">
                              ${price}
                            </div>
                          )}
                        </div>
                      </div>

                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 capitalize ${catColors.light}`}
                      >
                        {service.category}
                      </span>

                      <h3 className="font-bold text-xl mb-2 text-slate-900">
                        {service.name}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Timer size={14} />
                          <span>{service.duration || 60} min</span>
                        </div>
                        <button
                          onClick={() => openBookingModal(service)}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold text-sm
                                   hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center gap-2
                                   shadow-md shadow-amber-500/30 hover:shadow-lg group-hover:scale-105"
                        >
                          Book Now
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {regularServices.map((service) => {
              const IconComponent = iconMap[service.icon] || Wrench;
              const catColors =
                categoryColors[service.category] || categoryColors.maintenance;
              const price =
                typeof service.price === "number"
                  ? service.price
                  : parseFloat(service.price) || 0;
              const finalPrice =
                service.discount > 0
                  ? (price * (1 - service.discount / 100)).toFixed(0)
                  : price;

              return (
                <div
                  key={service._id || service.id}
                  className="glass-card p-6 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative"
                >
                  {service.discount > 0 && (
                    <div className="absolute -top-3 right-4 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                      -{service.discount}% OFF
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 bg-gradient-to-br ${catColors.bg} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold gradient-text">
                        ${finalPrice}
                      </div>
                      {service.discount > 0 && (
                        <div className="text-sm text-slate-400 line-through">
                          ${price}
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 capitalize ${catColors.light}`}
                  >
                    {service.category}
                  </span>

                  <h3 className="font-bold text-xl mb-2 text-slate-900">
                    {service.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Timer size={14} />
                      <span>{service.duration || 60} min</span>
                    </div>
                    <button
                      onClick={() => openBookingModal(service)}
                      className="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg font-semibold text-sm
                               hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 flex items-center gap-2
                               shadow-md shadow-sky-500/30 hover:shadow-lg group-hover:scale-105"
                    >
                      Book Now
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass-card p-8 bg-gradient-to-r from-sky-50/80 via-cyan-50/80 to-teal-50/80">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              Not sure which service you need?
            </h2>
            <p className="text-slate-600 mb-6">
              Our expert technicians can assess your vehicle and recommend the
              best service package. Contact us for a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary">Schedule Consultation</button>
              <button className="btn-outline">
                Call Us: +1 (555) 123-4567
              </button>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  question: "How long does a typical service take?",
                  answer:
                    "Most services take between 30 minutes to 2 hours depending on the type of service.",
                },
                {
                  question: "Do you offer warranty on services?",
                  answer:
                    "Yes, we provide warranty on all parts and labor for 30 days from the service date.",
                },
                {
                  question: "Can I cancel or reschedule my booking?",
                  answer:
                    "You can cancel or reschedule up to 24 hours before your appointment without any charges.",
                },
                {
                  question: "Do you use genuine parts?",
                  answer:
                    "Absolutely! We only use genuine and high-quality parts to ensure the best performance.",
                },
              ].map((item, idx) => (
                <div key={idx} className="glass-card p-5">
                  <h3 className="font-bold text-lg mb-2 text-slate-900">
                    {item.question}
                  </h3>
                  <p className="text-slate-600 text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {showModal && selectedService && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Book Service
                </h2>
                <p className="text-sm text-slate-500">{selectedService.name}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {step < 4 && (
              <div className="px-6 pt-4">
                <div className="flex items-center justify-between mb-6">
                  {["Schedule", "Details", "Confirm"].map((label, idx) => (
                    <div key={label} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          step > idx + 1
                            ? "bg-emerald-500 text-white"
                            : step === idx + 1
                              ? "bg-sky-500 text-white"
                              : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {step > idx + 1 ? <CheckCircle size={16} /> : idx + 1}
                      </div>
                      {idx < 2 && (
                        <div
                          className={`w-16 h-1 mx-2 rounded ${
                            step > idx + 1 ? "bg-emerald-500" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 pt-2">
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="form-label flex items-center gap-2">
                      <Calendar size={16} className="text-sky-500" />
                      Select Date
                    </label>

                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-2">
                      {quickDates.map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, date: d.value })
                          }
                          className={`p-3 rounded-xl text-center transition-all ${
                            formData.date === d.value
                              ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                        >
                          <div className="text-xs font-medium">{d.day}</div>
                          <div className="text-lg font-bold">{d.date}</div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-slate-500 mb-2">
                        Or pick any date:
                      </p>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="input-field cursor-pointer"
                      />
                    </div>

                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label flex items-center gap-2">
                      <Clock size={16} className="text-sky-500" />
                      Select Time
                    </label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setFormData({ ...formData, time })}
                          className={`p-3 rounded-xl font-medium transition-all ${
                            formData.time === time
                              ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    {errors.time && (
                      <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="form-label flex items-center gap-2">
                      <Car size={16} className="text-sky-500" />
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleNo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicleNo: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="e.g., ABC 1234"
                      className="input-field"
                    />
                    {errors.vehicleNo && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.vehicleNo}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Vehicle Model</label>
                    <input
                      type="text"
                      value={formData.vehicleModel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicleModel: e.target.value,
                        })
                      }
                      placeholder="e.g., Toyota Camry 2022"
                      className="input-field"
                    />
                    {errors.vehicleModel && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.vehicleModel}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <label className="form-label flex items-center gap-2 mb-3">
                      <CreditCard size={16} className="text-sky-500" />
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, paymentMethod: "cash" })
                        }
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          formData.paymentMethod === "cash"
                            ? "border-sky-500 bg-sky-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <Banknote
                          size={24}
                          className={
                            formData.paymentMethod === "cash"
                              ? "text-sky-500"
                              : "text-slate-400"
                          }
                        />
                        <span
                          className={`font-medium ${formData.paymentMethod === "cash" ? "text-sky-700" : "text-slate-600"}`}
                        >
                          Cash
                        </span>
                        <span className="text-xs text-slate-500">
                          Pay at pickup
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, paymentMethod: "card" })
                        }
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          formData.paymentMethod === "card"
                            ? "border-sky-500 bg-sky-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <CreditCard
                          size={24}
                          className={
                            formData.paymentMethod === "card"
                              ? "text-sky-500"
                              : "text-slate-400"
                          }
                        />
                        <span
                          className={`font-medium ${formData.paymentMethod === "card" ? "text-sky-700" : "text-slate-600"}`}
                        >
                          Card
                        </span>
                        <span className="text-xs text-slate-500">
                          Save card details
                        </span>
                      </button>
                    </div>
                    {errors.paymentMethod && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.paymentMethod}
                      </p>
                    )}
                  </div>

                  {formData.paymentMethod === "card" && (
                    <div className="space-y-3 mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                        <Lock size={14} />
                        <span>Secure card details</span>
                      </div>
                      <div>
                        <label className="form-label text-sm">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 16);
                            const formatted = value
                              .replace(/(\d{4})/g, "$1 ")
                              .trim();
                            setFormData({ ...formData, cardNumber: formatted });
                          }}
                          placeholder="1234 5678 9012 3456"
                          className="input-field"
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="form-label text-sm">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={formData.cardExpiry}
                            onChange={(e) => {
                              let value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4);
                              if (value.length > 2)
                                value =
                                  value.slice(0, 2) + "/" + value.slice(2);
                              setFormData({ ...formData, cardExpiry: value });
                            }}
                            placeholder="MM/YY"
                            className="input-field"
                          />
                          {errors.cardExpiry && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.cardExpiry}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="form-label text-sm">CVV</label>
                          <input
                            type="text"
                            value={formData.cardCvv}
                            onChange={(e) => {
                              const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4);
                              setFormData({ ...formData, cardCvv: value });
                            }}
                            placeholder="123"
                            className="input-field"
                          />
                          {errors.cardCvv && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.cardCvv}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="form-label text-sm">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={formData.cardName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cardName: e.target.value,
                            })
                          }
                          placeholder="John Doe"
                          className="input-field"
                        />
                        {errors.cardName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.cardName}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {!isUserLoggedIn && (
                    <>
                      <div className="border-t border-slate-200 pt-4 mt-4">
                        <p className="text-sm text-slate-500 mb-4">
                          Contact Information
                        </p>
                      </div>
                      <div>
                        <label className="form-label flex items-center gap-2">
                          <User size={16} className="text-sky-500" />
                          Your Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="John Doe"
                          className="input-field"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="form-label flex items-center gap-2">
                          <Phone size={16} className="text-sky-500" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="1234567890"
                          className="input-field"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="animate-fade-in">
                  <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl p-5 mb-4">
                    <h3 className="font-bold text-lg text-slate-900 mb-4">
                      Booking Summary
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Service</span>
                        <span className="font-semibold text-slate-900">
                          {selectedService.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Price</span>
                        <span className="font-bold text-sky-600">
                          {selectedService.price}
                        </span>
                      </div>
                      <div className="border-t border-slate-200 pt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Date</span>
                          <span className="font-semibold">
                            {new Date(formData.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Time</span>
                        <span className="font-semibold">{formData.time}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Vehicle</span>
                          <span className="font-semibold">
                            {formData.vehicleNo}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Model</span>
                        <span className="font-semibold">
                          {formData.vehicleModel}
                        </span>
                      </div>
                      <div className="border-t border-slate-200 pt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Name</span>
                          <span className="font-semibold">
                            {isUserLoggedIn ? user.name : formData.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Phone</span>
                        <span className="font-semibold">
                          {isUserLoggedIn ? user.phone : formData.phone}
                        </span>
                      </div>
                      <div className="border-t border-slate-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Payment Method</span>
                          <span className="font-semibold flex items-center gap-2">
                            {formData.paymentMethod === "card" ? (
                              <>
                                <CreditCard
                                  size={16}
                                  className="text-sky-500"
                                />
                                Card ****{formData.cardNumber.slice(-4)}
                              </>
                            ) : (
                              <>
                                <Banknote
                                  size={16}
                                  className="text-emerald-500"
                                />
                                Cash on Pickup
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-6 animate-scale-in">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={40} className="text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Booking Confirmed!
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Your service has been booked successfully. We'll contact you
                    shortly.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => navigate("/my-bookings")}
                      className="btn-outline"
                    >
                      View My Bookings
                    </button>
                    <button onClick={closeModal} className="btn-primary">
                      Done
                    </button>
                  </div>
                </div>
              )}

              {step < 4 && (
                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="btn-secondary flex-1"
                    >
                      Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button onClick={handleNext} className="btn-primary flex-1">
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Sparkles size={18} />
                          Confirm Booking
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
