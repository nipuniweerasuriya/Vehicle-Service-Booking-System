import { useState, useContext } from "react";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BookingContext } from "../context/BookingContext";

export default function TrackBooking() {
  const { bookings } = useContext(BookingContext);
  const [searchType, setSearchType] = useState("id"); // 'id' or 'phone'
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setError("");
    setSearched(true);

    if (!searchValue.trim()) {
      setError("Please enter a search value");
      return;
    }

    let result = null;

    if (searchType === "id") {
      result = bookings.find(
        (b) => b.id.toUpperCase() === searchValue.trim().toUpperCase(),
      );
      if (!result) {
        setError("No booking found with this ID");
      }
    } else {
      const phoneDigits = searchValue.replace(/\D/g, "");
      result = bookings.find(
        (b) => b.phone === phoneDigits || b.phone.endsWith(phoneDigits),
      );
      if (!result) {
        setError("No booking found with this phone number");
      }
    }

    setSearchResult(result);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "badge-pending";
      case "Approved":
        return "badge-approved";
      case "Completed":
        return "badge-completed";
      default:
        return "badge-pending";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-700";
      case "Approved":
        return "text-blue-700";
      case "Completed":
        return "text-green-700";
      default:
        return "text-gray-700";
    }
  };

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", options);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen py-16 px-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-12 text-center animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent mb-4">
              Track Your Booking
            </h1>
            <p className="text-gray-600 text-lg">
              Enter your booking ID or phone number to check the status
            </p>
          </div>

          {/* Search Section */}
          <div className="card shadow-medium mb-8 bg-white/80 backdrop-blur">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Search Type Selector */}
              <div className="flex gap-4 border-b-2 border-cyan-200 pb-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    value="id"
                    checked={searchType === "id"}
                    onChange={(e) => {
                      setSearchType(e.target.value);
                      setSearchResult(null);
                      setError("");
                      setSearched(false);
                    }}
                    className="w-4 h-4 accent-cyan-600"
                  />
                  <span className="text-gray-700 font-medium">
                    Search by Booking ID
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    value="phone"
                    checked={searchType === "phone"}
                    onChange={(e) => {
                      setSearchType(e.target.value);
                      setSearchResult(null);
                      setError("");
                      setSearched(false);
                    }}
                    className="w-4 h-4 accent-cyan-600"
                  />
                  <span className="text-gray-700 font-medium">
                    Search by Phone Number
                  </span>
                </label>
              </div>

              {/* Search Input */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  {searchType === "id" ? "Booking ID" : "Phone Number"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      setError("");
                    }}
                    placeholder={
                      searchType === "id" ? "e.g., BK001" : "e.g., 9876543210"
                    }
                    className="input-field flex-1"
                  />
                  <button
                    type="submit"
                    className="btn-primary flex items-center space-x-2 px-8"
                  >
                    <Search size={20} />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && searched && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle
                    className="text-red-600 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <p className="text-red-800">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Search Result */}
          {searchResult && (
            <div className="animate-slide-down">
              <div className="card shadow-medium mb-8">
                {/* Booking ID and Status */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-8 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Booking ID</p>
                      <p className="text-3xl font-bold text-blue-700 font-mono">
                        {searchResult.id}
                      </p>
                    </div>
                    <div
                      className={`${getStatusBadgeClass(searchResult.status)} text-lg`}
                    >
                      {searchResult.status}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Booked on: {formatDate(searchResult.createdAt)}
                  </p>
                </div>

                {/* Booking Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-4">
                      Booking Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                          Customer Name
                        </p>
                        <p className="text-lg text-gray-900">
                          {searchResult.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                          Phone Number
                        </p>
                        <p className="text-lg text-gray-900">
                          {searchResult.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                          Vehicle Number
                        </p>
                        <p className="text-lg text-gray-900">
                          {searchResult.vehicleNo}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                          Service Type
                        </p>
                        <p className="text-lg text-gray-900">
                          {searchResult.service}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-bold text-lg mb-4">
                      Appointment Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="text-blue-600" size={18} />
                          <p className="text-sm text-gray-600 font-semibold">
                            Date
                          </p>
                        </div>
                        <p className="text-lg text-gray-900">
                          {formatDate(searchResult.date)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="text-blue-600" size={18} />
                          <p className="text-sm text-gray-600 font-semibold">
                            Time
                          </p>
                        </div>
                        <p className="text-lg text-gray-900">
                          {searchResult.time}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-bold text-lg mb-4">Status Timeline</h3>
                    <div className="space-y-4">
                      {[
                        {
                          step: "Booking Confirmed",
                          completed: true,
                          current: searchResult.status === "Pending",
                        },
                        {
                          step: "Approved",
                          completed: ["Approved", "Completed"].includes(
                            searchResult.status,
                          ),
                          current: searchResult.status === "Approved",
                        },
                        {
                          step: "Service Completed",
                          completed: searchResult.status === "Completed",
                          current: false,
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                item.completed
                                  ? "bg-green-500"
                                  : item.current
                                    ? "bg-blue-500"
                                    : "bg-gray-300"
                              }`}
                            >
                              {item.completed && (
                                <CheckCircle className="text-white" size={20} />
                              )}
                              {item.current && !item.completed && (
                                <Clock
                                  className="text-white animate-spin"
                                  size={20}
                                />
                              )}
                            </div>
                            {idx < 2 && (
                              <div
                                className={`w-0.5 h-12 ${item.completed || item.current ? "bg-green-500" : "bg-gray-300"}`}
                              ></div>
                            )}
                          </div>
                          <div className="pt-1">
                            <p
                              className={`font-semibold ${
                                item.completed
                                  ? "text-green-700"
                                  : item.current
                                    ? "text-blue-700"
                                    : "text-gray-700"
                              }`}
                            >
                              {item.step}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Our team will contact you soon. If
                    you have any questions, please call us at +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Bookings (Demo Data) */}
          {!searchResult && (
            <div className="card shadow-medium">
              <h3 className="font-bold text-lg mb-6">Need Help?</h3>
              <div className="space-y-4">
                <p className="text-gray-700">
                  <strong>Example Search:</strong> Try searching with one of
                  these booking IDs to see how tracking works:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <button
                      key={booking.id}
                      onClick={() => {
                        setSearchType("id");
                        setSearchValue(booking.id);
                      }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-left"
                    >
                      <p className="text-sm text-gray-600">Booking ID</p>
                      <p className="font-mono font-bold text-blue-600">
                        {booking.id}
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        {booking.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
