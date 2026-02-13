import { useState, useContext, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Check,
  X,
  ChevronDown,
  MoreHorizontal,
  Calendar,
  SortAsc,
  SortDesc,
  Activity,
  RefreshCw,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BookingContext } from "../context/BookingContext";
import { bookingsAPI } from "../api";

const progressStages = [
  { value: "Waiting", label: "Waiting", progress: 0 },
  { value: "Received", label: "Vehicle Received", progress: 20 },
  { value: "Inspection", label: "Under Inspection", progress: 40 },
  { value: "InProgress", label: "Work In Progress", progress: 60 },
  { value: "QualityCheck", label: "Quality Check", progress: 80 },
  { value: "Completed", label: "Completed", progress: 100 },
];

export default function ManageBookings() {
  const { bookings, updateBookingStatus, fetchBookings } =
    useContext(BookingContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [progressModal, setProgressModal] = useState(null);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  const handleProgressUpdate = async (bookingId, stage) => {
    setUpdatingProgress(true);
    try {
      const stageInfo = progressStages.find((s) => s.value === stage);
      await bookingsAPI.updateProgress(bookingId, stageInfo.progress, stage);

      // If completed, also update status
      if (stage === "Completed") {
        await bookingsAPI.updateStatus(bookingId, "Completed");
      }

      fetchBookings();
      setProgressModal(null);
    } catch (error) {
      console.error("Failed to update progress:", error);
      alert("Failed to update progress");
    } finally {
      setUpdatingProgress(false);
    }
  };

  // Smart filtering and sorting
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.id?.toLowerCase().includes(term) ||
          b.name?.toLowerCase().includes(term) ||
          b.phone?.includes(term) ||
          b.vehicleNo?.toLowerCase().includes(term) ||
          b.service?.toLowerCase().includes(term),
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter((b) => b.status === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case "date":
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
        case "name":
          aVal = a.name?.toLowerCase() || "";
          bVal = b.name?.toLowerCase() || "";
          break;
        case "status":
          const statusOrder = {
            Pending: 0,
            Approved: 1,
            Completed: 2,
            Rejected: 3,
          };
          aVal = statusOrder[a.status] || 0;
          bVal = statusOrder[b.status] || 0;
          break;
        default:
          aVal = a[sortField];
          bVal = b[sortField];
      }
      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [bookings, searchTerm, filterStatus, sortField, sortOrder]);

  const handleStatusChange = (bookingId, newStatus) => {
    updateBookingStatus(bookingId, newStatus);
    setSelectedBooking(null);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const statusCounts = useMemo(
    () => ({
      all: bookings.length,
      Pending: bookings.filter((b) => b.status === "Pending").length,
      Approved: bookings.filter((b) => b.status === "Approved").length,
      Completed: bookings.filter((b) => b.status === "Completed").length,
      Rejected: bookings.filter((b) => b.status === "Rejected").length,
    }),
    [bookings],
  );

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? <SortAsc size={14} /> : <SortDesc size={14} />;
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900 mb-1">
              Manage Bookings
            </h1>
            <p className="text-slate-600 text-sm">
              View and manage all service bookings
            </p>
          </div>

          {/* Search and Filters */}
          <div className="card mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by ID, name, phone, vehicle, or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-secondary flex items-center gap-2 ${showFilters ? "bg-sky-50 border-sky-200 text-sky-700" : ""}`}
              >
                <Filter size={16} />
                Filters
                {filterStatus !== "all" && (
                  <span className="w-5 h-5 bg-sky-600 text-white text-xs rounded-full flex items-center justify-center">
                    1
                  </span>
                )}
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-100 animate-slide-down">
                <p className="text-sm font-medium text-slate-700 mb-3">
                  Filter by Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {["all", "Pending", "Approved", "Completed", "Rejected"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filterStatus === status
                            ? "bg-sky-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {status === "all" ? "All" : status}
                        <span className="ml-1.5 opacity-70">
                          ({statusCounts[status]})
                        </span>
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-medium text-slate-900">
                {filteredBookings.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-900">
                {bookings.length}
              </span>{" "}
              bookings
            </p>
          </div>

          {/* Bookings Table */}
          <div className="card overflow-hidden">
            {filteredBookings.length > 0 ? (
              <div className="overflow-x-auto -m-6">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="table-header">
                        <button
                          onClick={() => toggleSort("id")}
                          className="flex items-center gap-1 hover:text-slate-900"
                        >
                          Booking ID <SortIcon field="id" />
                        </button>
                      </th>
                      <th className="table-header">
                        <button
                          onClick={() => toggleSort("name")}
                          className="flex items-center gap-1 hover:text-slate-900"
                        >
                          Customer <SortIcon field="name" />
                        </button>
                      </th>
                      <th className="table-header">Vehicle</th>
                      <th className="table-header">Service</th>
                      <th className="table-header">
                        <button
                          onClick={() => toggleSort("date")}
                          className="flex items-center gap-1 hover:text-slate-900"
                        >
                          Date & Time <SortIcon field="date" />
                        </button>
                      </th>
                      <th className="table-header">
                        <button
                          onClick={() => toggleSort("status")}
                          className="flex items-center gap-1 hover:text-slate-900"
                        >
                          Status <SortIcon field="status" />
                        </button>
                      </th>
                      <th className="table-header text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="table-row group">
                        <td className="table-cell">
                          <span className="font-mono font-medium text-sky-600">
                            {booking.id}
                          </span>
                        </td>
                        <td className="table-cell">
                          <p className="font-medium text-slate-900">
                            {booking.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {booking.phone}
                          </p>
                        </td>
                        <td className="table-cell">
                          <p className="font-medium text-slate-700">
                            {booking.vehicleNo}
                          </p>
                        </td>
                        <td className="table-cell text-slate-700">
                          {booking.service}
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400" />
                            <div>
                              <p className="text-slate-700">{booking.date}</p>
                              <p className="text-xs text-slate-500">
                                {booking.time}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span
                            className={`badge ${
                              booking.status === "Pending"
                                ? "badge-pending"
                                : booking.status === "Approved"
                                  ? "badge-approved"
                                  : booking.status === "Completed"
                                    ? "badge-completed"
                                    : "badge-rejected"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center justify-end gap-1">
                            {/* Quick Actions */}
                            {booking.status === "Pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusChange(booking.id, "Approved")
                                  }
                                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  title="Approve"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusChange(booking.id, "Rejected")
                                  }
                                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                  title="Reject"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
                            {booking.status === "Approved" && (
                              <>
                                <button
                                  onClick={() => setProgressModal(booking.id)}
                                  className="px-2 py-1 rounded text-xs font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 transition-colors flex items-center gap-1"
                                  title="Update Progress"
                                >
                                  <Activity size={12} />
                                  Progress
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusChange(booking.id, "Completed")
                                  }
                                  className="px-2 py-1 rounded text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                                >
                                  Complete
                                </button>
                              </>
                            )}
                            {/* Dropdown for all options */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setSelectedBooking(
                                    selectedBooking === booking.id
                                      ? null
                                      : booking.id,
                                  )
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                              >
                                <MoreHorizontal size={16} />
                              </button>
                              {selectedBooking === booking.id && (
                                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 animate-scale-in">
                                  {booking.status !== "Pending" && (
                                    <button
                                      onClick={() =>
                                        handleStatusChange(
                                          booking.id,
                                          "Pending",
                                        )
                                      }
                                      className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                      Set Pending
                                    </button>
                                  )}
                                  {booking.status !== "Approved" && (
                                    <button
                                      onClick={() =>
                                        handleStatusChange(
                                          booking.id,
                                          "Approved",
                                        )
                                      }
                                      className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                      Set Approved
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
                                      className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                      Set Completed
                                    </button>
                                  )}
                                  {booking.status !== "Rejected" && (
                                    <button
                                      onClick={() =>
                                        handleStatusChange(
                                          booking.id,
                                          "Rejected",
                                        )
                                      }
                                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                    >
                                      Set Rejected
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No bookings found
                </h3>
                <p className="text-slate-500">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Bookings will appear here once customers start booking"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Progress Update Modal */}
      {progressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-600" />
                Update Progress
              </h3>
              <button
                onClick={() => setProgressModal(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              Select the current stage for booking{" "}
              <span className="font-mono font-medium text-sky-600">
                {progressModal}
              </span>
            </p>

            <div className="space-y-2">
              {progressStages.map((stage) => (
                <button
                  key={stage.value}
                  onClick={() =>
                    handleProgressUpdate(progressModal, stage.value)
                  }
                  disabled={updatingProgress}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 group-hover:bg-sky-100 rounded-lg flex items-center justify-center transition-colors">
                      <span className="text-sm font-bold text-slate-600 group-hover:text-sky-600">
                        {stage.progress}%
                      </span>
                    </div>
                    <span className="font-medium text-slate-700 group-hover:text-sky-700">
                      {stage.label}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className="text-slate-400 group-hover:text-sky-500 -rotate-90"
                  />
                </button>
              ))}
            </div>

            {updatingProgress && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sky-600">
                <RefreshCw size={16} className="animate-spin" />
                <span className="text-sm">Updating...</span>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
