import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Heart,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white mt-auto">
      <div className="h-1 bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center mb-5 group">
              <span className="text-2xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Vehicle
                </span>
                <span className="text-white">Care</span>
              </span>
              <span className="ml-1 w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 group-hover:scale-125 transition-transform" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Professional vehicle service booking made simple and accessible.
              Your trusted partner for all vehicle maintenance needs.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, color: "hover:bg-blue-600" },
                { icon: Twitter, color: "hover:bg-sky-500" },
                { icon: Linkedin, color: "hover:bg-blue-700" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  className={`w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center ${social.color} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-lg">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/services", label: "Services" },
                { to: "/track", label: "Track Booking" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-lg">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {[
                {
                  icon: Phone,
                  text: "071 231 2031",
                  color: "text-emerald-400",
                },
                {
                  icon: Mail,
                  text: "info@vehiclecare.com",
                  color: "text-sky-400",
                },
                {
                  icon: MapPin,
                  text: "123 Auto Street, Tech City",
                  color: "text-amber-400",
                },
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-slate-400 group hover:text-white transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                    <item.icon size={16} className={item.color} />
                  </div>
                  <span className="text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-lg">
              Working Hours
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Mon - Fri</span>
                <span className="text-white font-medium">
                  8:00 AM - 6:00 PM
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Saturday</span>
                <span className="text-white font-medium">
                  9:00 AM - 4:00 PM
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Sunday</span>
                <span className="text-amber-400 font-medium">Closed</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 rounded-xl border border-sky-500/20">
              <p className="text-sm text-sky-400 font-medium">
                Emergency Service
              </p>
              <p className="text-xs text-slate-400 mt-1">
                24/7 roadside assistance available
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            2026 VehicleCare. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" />{" "}
            for vehicle enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}
