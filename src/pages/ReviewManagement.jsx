import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  Star,
  Search,
  Trash2,
  RefreshCw,
  Check,
  X,
  MessageSquare,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { adminAPI } from "../api";

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const isAdmin = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const response = await adminAPI.getReviews();
      setReviews(response.data);
    } catch (err) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStatusUpdate = async (reviewId, status) => {
    try {
      await adminAPI.updateReviewStatus(reviewId, status);
      setReviews(
        reviews.map((r) => (r._id === reviewId ? { ...r, status } : r)),
      );
    } catch (err) {
      alert("Failed to update review status");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await adminAPI.deleteReview(reviewId);
      setReviews(reviews.filter((r) => r._id !== reviewId));
      setDeleteConfirm(null);
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.serviceType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || review.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="badge badge-pending flex items-center gap-1">
            <Clock size={12} /> Pending
          </span>
        );
      case "approved":
        return (
          <span className="badge badge-approved flex items-center gap-1">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="badge badge-rejected flex items-center gap-1">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (!isAdmin) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  Review Management
                </h1>
                <p className="text-slate-600 text-sm">
                  Manage customer reviews and feedback
                </p>
              </div>
            </div>
            <button
              onClick={() => fetchReviews(true)}
              disabled={refreshing}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* Search and Filter */}
          <div className="card mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by user, comment, or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                <Filter size={14} /> Filter by Status
              </p>
              <div className="flex flex-wrap gap-2">
                {["all", "pending", "approved", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? "bg-amber-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    <span className="ml-1.5 opacity-70">
                      ({statusCounts[status]})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
              <p className="text-2xl font-bold text-amber-600">
                {reviews.length}
              </p>
              <p className="text-sm text-slate-600">Total Reviews</p>
            </div>
            <div className="card bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-100">
              <p className="text-2xl font-bold text-yellow-600">
                {statusCounts.pending}
              </p>
              <p className="text-sm text-slate-600">Pending</p>
            </div>
            <div className="card bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <p className="text-2xl font-bold text-emerald-600">
                {statusCounts.approved}
              </p>
              <p className="text-sm text-slate-600">Approved</p>
            </div>
            <div className="card bg-gradient-to-br from-red-50 to-rose-50 border border-red-100">
              <p className="text-2xl font-bold text-red-600">
                {statusCounts.rejected}
              </p>
              <p className="text-sm text-slate-600">Rejected</p>
            </div>
          </div>

          {/* Reviews List */}
          {loading ? (
            <div className="card text-center py-16">
              <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading reviews...</p>
            </div>
          ) : error ? (
            <div className="card text-center py-16">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => fetchReviews()}
                className="btn-primary mt-4"
              >
                Retry
              </button>
            </div>
          ) : filteredReviews.length > 0 ? (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div
                  key={review._id}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                          {review.userName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {review.userName || "Anonymous"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {review.userEmail}
                          </p>
                        </div>
                        {getStatusBadge(review.status)}
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        {renderStars(review.rating)}
                        <span className="text-sm text-slate-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>

                      {review.serviceType && (
                        <p className="text-sm text-sky-600 mb-2">
                          Service: {review.serviceType}
                        </p>
                      )}

                      <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
                        "{review.comment}"
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2">
                      {review.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(review._id, "approved")
                            }
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(review._id, "rejected")
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X size={20} />
                          </button>
                        </>
                      )}
                      {review.status !== "pending" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(review._id, "pending")
                          }
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Mark as Pending"
                        >
                          <Clock size={20} />
                        </button>
                      )}
                      {deleteConfirm === review._id ? (
                        <div className="flex sm:flex-col gap-1">
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded hover:bg-slate-300"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(review._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-16">
              <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No reviews found
              </h3>
              <p className="text-slate-500">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter"
                  : "Reviews will appear here when users submit them"}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
