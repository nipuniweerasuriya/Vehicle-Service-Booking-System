import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Send,
  MessageSquare,
  User,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import { reviewsAPI } from "../api";

export default function Reviews() {
  const { user, isUserLoggedIn } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [serviceType, setServiceType] = useState("");

  const services = [
    "Regular Maintenance",
    "Oil Change",
    "Brake Check",
    "Tire Rotation",
    "Battery Service",
    "AC Service",
    "General",
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getAll();
      setReviews(response.data);
    } catch (err) {
      console.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      setError("Please provide a rating and comment");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await reviewsAPI.create({
        rating,
        comment: comment.trim(),
        serviceType: serviceType || "General",
      });
      setSuccess(true);
      setRating(0);
      setComment("");
      setServiceType("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (value, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
            className={
              interactive ? "transition-transform hover:scale-110" : ""
            }
            disabled={!interactive}
          >
            <Star
              size={interactive ? 28 : 18}
              className={
                star <= (interactive ? hoverRating || rating : value)
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300"
              }
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <>
      <Header />

      <main className="min-h-screen py-10 px-4 bg-gradient-mesh relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Page Header */}
          <div className="text-center mb-10 animate-slide-down">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4 shadow-lg shadow-amber-500/30">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Customer Reviews
            </h1>
            <p className="text-slate-600">
              See what our customers say about our services
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="glass-card p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                <span className="text-4xl font-bold text-slate-900">
                  {averageRating}
                </span>
              </div>
              <p className="text-slate-600">Average Rating</p>
            </div>
            <div className="glass-card p-6 text-center">
              <p className="text-4xl font-bold text-slate-900 mb-2">
                {reviews.length}
              </p>
              <p className="text-slate-600">Total Reviews</p>
            </div>
          </div>

          {/* Submit Review Form */}
          {isUserLoggedIn ? (
            <div className="glass-card p-8 mb-10 animate-slide-up">
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Share Your Experience
              </h2>

              {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700">
                  <CheckCircle className="w-5 h-5" />
                  <p>
                    Thank you! Your review has been submitted and is pending
                    approval.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Rating
                  </label>
                  {renderStars(rating, true)}
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Service Used
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select a service (optional)</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with our service..."
                    rows={4}
                    className="input-field resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !rating}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Review
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-card p-8 mb-10 text-center animate-slide-up">
              <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Want to share your experience?
              </h3>
              <p className="text-slate-600 mb-4">
                Sign in to leave a review about our services.
              </p>
              <Link to="/signin" className="btn-primary inline-flex">
                Sign In to Review
              </Link>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              What Our Customers Say
            </h2>

            {loading ? (
              <div className="glass-card p-12 text-center">
                <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <div
                  key={review._id}
                  className="glass-card p-6 hover:shadow-lg transition-shadow animate-slide-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {review.userName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-medium text-slate-900">
                            {review.userName || "Anonymous"}
                          </h4>
                          {review.serviceType && (
                            <p className="text-sm text-sky-600">
                              {review.serviceType}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {renderStars(review.rating)}
                          <span className="text-sm text-slate-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card p-12 text-center">
                <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No reviews yet
                </h3>
                <p className="text-slate-600">
                  Be the first to share your experience!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
