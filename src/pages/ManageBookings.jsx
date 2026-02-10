import { useState, useContext } from "react";
import { Search, ChevronDown, Trash2, Check } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BookingContext } from "../context/BookingContext";

export default function ManageBookings() {
  const { bookings, updateBookingStatus } = useContext(BookingContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm) ||
      booking.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (bookingId, newStatus) => {
    updateBookingStatus(bookingId, newStatus);
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-l-4 border-amber-500";
      case "Approved":
        return "bg-cyan-100 text-cyan-800 border-l-4 border-cyan-500";
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-l-4 border-emerald-500";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent mb-2">
              Manage Bookings
            </h1>
            <p className="text-gray-600">
              View and manage all service bookings
            </p>
          </div>

          {/* Filters and Search */}
          <div className="card shadow-medium mb-6 bg-white/80 backdrop-blur">
            <div className="space-y-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Bookings
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-4 top-3.5 text-cyan-500"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by ID, name, phone, or vehicle number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Filter by Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "Pending", "Approved", "Completed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        filterStatus === status
                          ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md hover:shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status === "all" ? "All Bookings" : status}
                      {status !== "all" && (
                        <span className="ml-2">
                          ({bookings.filter((b) => b.status === status).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-600">
                Found{" "}
                <span className="font-semibold text-cyan-600">
                  {filteredBookings.length}
                </span>{" "}
                booking(s)
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="card shadow-medium bg-white/80 backdrop-blur">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 border-b-2 border-cyan-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                      Vehicle
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono font-semibold text-blue-600">
                            {booking.id}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {booking.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {booking.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900">
                            {booking.vehicleNo}
                          </p>
                          {booking.vehicleModel && (
                            <p className="text-sm text-gray-600">
                              {booking.vehicleModel}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {booking.service}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-900">{booking.date}</p>
                          <p className="text-sm text-gray-600">
                            {booking.time}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`badge ${
                              booking.status === "Pending"
                                ? "badge-pending"
                                : booking.status === "Approved"
                                  ? "badge-approved"
                                  : "badge-completed"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            {/* Status Change Dropdown */}
                            <div className="relative group">
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                                <ChevronDown
                                  size={18}
                                  className="text-gray-600"
                                />
                              </button>
                              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block z-10">
                                {booking.status !== "Pending" && (
                                  <button
                                    onClick={() =>
                                      handleStatusChange(booking.id, "Pending")
                                    }
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-yellow-700"
                                  >
                                    Mark Pending
                                  </button>
                                )}
                                {booking.status !== "Approved" && (
                                  <button
                                    onClick={() =>
                                      handleStatusChange(booking.id, "Approved")
                                    }
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-blue-700 border-t border-gray-100"
                                  >
                                    Mark Approved
                                  </button>
                                )}
                                {booking.status !== "Completed" && (
                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        booking.id,
                                        "Completed",
                                      )
                                    }
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-green-700 border-t border-gray-100"
                                  >
                                    Mark Completed
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Delete Button */}
                            <button
                              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                              title="Delete booking"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center text-gray-600"
                      >
                        No bookings found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bulk Actions Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Use the dropdown menu in the Actions column
              to update booking status. You can also delete bookings if needed.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
