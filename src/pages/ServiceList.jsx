import { Link } from "react-router-dom";
import {
  Wrench,
  Droplet,
  Zap,
  Disc3,
  Battery,
  Wind,
  ArrowRight,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContext } from "react";
import { BookingContext } from "../context/BookingContext";

export default function ServiceList() {
  const { services } = useContext(BookingContext);

  const iconMap = {
    Wrench: Wrench,
    Droplet: Droplet,
    Zap: Zap,
    Disc3: Disc3,
    Battery: Battery,
    Wind: Wind,
  };

  return (
    <>
      <Header />

      <main className="min-h-screen py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-12 animate-fade-in">
            <div className="mb-4 inline-block">
              <span className="bg-blue-100 px-4 py-2 rounded-full text-sm font-semibold text-blue-700">
                Our Services
              </span>
            </div>
            <h1 className="section-title mb-4">
              Professional Vehicle Services
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Choose from our comprehensive range of professional vehicle
              maintenance and repair services.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((service, idx) => {
              const IconComponent = iconMap[service.icon] || Wrench;
              const gradients = [
                "from-blue-400 to-cyan-400",
                "from-green-400 to-emerald-400",
                "from-purple-400 to-pink-400",
                "from-orange-400 to-red-400",
                "from-yellow-400 to-orange-400",
                "from-indigo-400 to-purple-400",
              ];
              const gradient = gradients[idx % gradients.length];

              return (
                <div
                  key={service.id}
                  className="card-interactive group border-cyan-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 bg-gradient-to-br ${gradient} rounded-xl group-hover:shadow-glow transition-all duration-300`}
                    >
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      {service.price}
                    </div>
                  </div>

                  <h3 className="font-bold text-xl mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-600">
                      Estimated: 30-60 min
                    </span>
                    <Link
                      to="/book"
                      className="text-blue-600 hover:text-cyan-600 font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Book</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 rounded-2xl p-8 border border-cyan-200">
            <h2 className="text-2xl font-bold mb-4">
              Not sure which service you need?
            </h2>
            <p className="text-gray-700 mb-6">
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

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  question: "How long does a typical service take?",
                  answer:
                    "Most services take between 30 minutes to 2 hours depending on the type of service. We'll provide you with an estimated time during booking.",
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
                    "Absolutely! We only use genuine and high-quality parts to ensure the best performance and longevity.",
                },
              ].map((item, idx) => (
                <div key={idx} className="card">
                  <h3 className="font-bold text-lg mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
