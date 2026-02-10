import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "General Maintenance",
      subtitle: "Regular checkups and preventive care for your vehicle",
      description:
        "Keep your car running smoothly with our comprehensive maintenance services",
      image: "/src/assets/Main Slide.jpg",
    },
    {
      title: "Engine Service",
      subtitle: "Expert engine diagnostics and repair",
      description:
        "Professional technicians ensure your engine performs at peak efficiency",
      image: "/src/assets/maintenance.jpg",
    },
    {
      title: "Electrical Systems",
      subtitle: "Battery and electrical issue solutions",
      description:
        "Advanced diagnostics and quality repairs for all electrical components",
      image: "/src/assets/electrical.jpg",
    },
    {
      title: "Fluid Services",
      subtitle: "Oil, coolant, and transmission fluids",
      description:
        "Essential fluid maintenance to extend your vehicle's lifespan",
      image: "/src/assets/tires.jpg",
    },
  ];

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <>
      <Header />

      <main>
        {/* Full-Page Carousel Hero Section */}
        <section className="relative w-full h-screen overflow-hidden">
          {/* Carousel slides */}
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
                idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              style={{
                backgroundImage: `url('${slide.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/40"></div>

              <div className="max-w-6xl mx-auto px-4 relative z-10 w-full h-full flex items-center">
                <div className="w-full">
                  {/* Content */}
                  <div className="animate-fade-in text-white max-w-2xl">
                    <div className="mb-6 inline-block">
                      <span className="bg-white/20 px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-md">
                        ⚡ Premium Service
                      </span>
                    </div>
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight drop-shadow-lg">
                      {slide.title}
                    </h1>
                    <h2 className="text-2xl md:text-3xl text-white/95 mb-6 font-semibold drop-shadow-md">
                      {slide.subtitle}
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed drop-shadow-md">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to="/book"
                        className="btn-primary flex items-center justify-center space-x-2 text-lg py-4 w-fit"
                      >
                        <span>Book Service Now</span>
                        <ArrowRight size={24} />
                      </Link>
                      <Link
                        to="/services"
                        className="btn-outline text-white border-white hover:bg-white hover:text-blue-600 flex items-center justify-center space-x-2 text-lg py-4 w-fit"
                      >
                        <span>Learn More</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-800 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-800 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
          >
            <ChevronRight size={32} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full backdrop-blur-sm ${
                  idx === currentSlide
                    ? "bg-white w-10 h-4 shadow-lg"
                    : "bg-white/50 w-4 h-4 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Quick Stats Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-8 shadow-lg text-white">
                <p className="text-5xl font-bold mb-2">500+</p>
                <p className="text-lg text-blue-200">Happy Customers</p>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 shadow-lg text-white">
                <p className="text-5xl font-bold mb-2">98%</p>
                <p className="text-lg text-gray-300">Satisfaction Rate</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-lg text-white">
                <p className="text-5xl font-bold mb-2">24/7</p>
                <p className="text-lg text-gray-300">Customer Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="section-title text-center mb-4">
              Why Choose VehicleCare?
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
              We provide comprehensive vehicle maintenance services with the
              highest quality standards.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Clock,
                  title: "Quick Booking",
                  description:
                    "Reserve your slot in just 2 minutes. Easy online booking process.",
                  color: "from-blue-900 to-blue-800",
                },
                {
                  icon: Shield,
                  title: "Expert Technicians",
                  description:
                    "Certified professionals with years of experience in vehicle maintenance.",
                  color: "from-slate-700 to-slate-900",
                },
                {
                  icon: MapPin,
                  title: "Multiple Locations",
                  description:
                    "Service centers conveniently located across the city.",
                  color: "from-gray-800 to-gray-900",
                },
                {
                  icon: CheckCircle,
                  title: "Quality Guaranteed",
                  description:
                    "We use genuine parts and provide warranty on all services.",
                  color: "from-slate-700 to-slate-800",
                },
              ].map((feature, idx) => (
                <div key={idx} className="card group border-0 shadow-medium">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-4 group-hover:shadow-glow transition-all duration-300`}
                  >
                    <feature.icon size={32} className="text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Services Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="section-title mb-4">Our Popular Services</h2>
            <p className="text-gray-600 mb-16 text-lg">
              Comprehensive vehicle maintenance and repair solutions
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  emoji: "🔧",
                  name: "Regular Maintenance",
                  price: "$99",
                  color: "from-blue-900 to-blue-800",
                },
                {
                  emoji: "💧",
                  name: "Oil Change",
                  price: "$49",
                  color: "from-slate-700 to-slate-900",
                },
                {
                  emoji: "⚡",
                  name: "Brake Check",
                  price: "$79",
                  color: "from-gray-800 to-gray-900",
                },
              ].map((service, idx) => (
                <div
                  key={idx}
                  className="card-interactive group border-gray-300 overflow-hidden"
                >
                  <div
                    className={`h-24 bg-gradient-to-br ${service.color} flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    {service.emoji}
                  </div>
                  <h3 className="font-bold text-lg mb-2 mt-4">
                    {service.name}
                  </h3>
                  <p className="text-blue-900 font-bold text-2xl">
                    {service.price}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/services"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>View All Services</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-black text-white py-24 px-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl font-bold mb-6">
              Ready to Book Your Service?
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              Get your vehicle serviced by experts. Quick, reliable, and
              affordable.
            </p>
            <Link
              to="/book"
              className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition inline-block transform hover:scale-105 duration-300 shadow-lg hover:shadow-2xl"
            >
              Book Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
