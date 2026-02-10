import { useContext } from "react";
import {
  Clipboard,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StatCard from "../components/StatCard";
import { BookingContext } from "../context/BookingContext";

export default function AdminDashboard() {
  const { bookings } = useContext(BookingContext);

  // Calculate statistics
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "Pending").length;
  const approvedBookings = bookings.filter(
    (b) => b.status === "Approved",
  ).length;
  const completedBookings = bookings.filter(
    (b) => b.status === "Completed",
  ).length;

  // Calculate completion rate
  const completionRate =
    totalBookings > 0
      ? Math.round((completedBookings / totalBookings) * 100)
      : 0;

  // Recent bookings
  const recentBookings = [...bookings].reverse().slice(0, 5);

  return (
    <>
      <Header />

      <main className="min-h-screen py-12 px-4 bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="section-title mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 text-lg">
              Overview of your vehicle service booking system
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Clipboard}
              label="Total Bookings"
              value={totalBookings}
              color="blue"
            />
            <StatCard
              icon={Clock}
              label="Pending"
              value={pendingBookings}
              color="yellow"
            />
            <StatCard
              icon={TrendingUp}
              label="Approved"
              value={approvedBookings}
              color="purple"
            />
            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={completedBookings}
              color="green"
            />
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Completion Rate */}
            <div className="card shadow-medium">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Completion Rate</h3>
                <div className="text-3xl font-bold text-green-600">
                  {completionRate}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                {completedBookings} out of {totalBookings} bookings completed
              </p>
            </div>

            {/* Quick Stats */}
            <div className="card shadow-medium">
              <h3 className="font-bold text-lg mb-4">Key Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700">Avg. Rating</span>
                  <span className="font-semibold">4.8 / 5.0</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700">Customer Satisfaction</span>
                  <span className="font-semibold">98%</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-700">This Week Bookings</span>
                  <span className="font-semibold">
                    {
                      bookings.filter((b) => {
                        const bookingDate = new Date(b.date);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return bookingDate >= weekAgo;
                      }).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="card shadow-medium">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Recent Bookings</h3>
              <a
                href="/admin/bookings"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Booking ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
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
                        <td className="px-4 py-3 text-gray-700">
                          {booking.service}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {booking.date}
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-8 text-center text-gray-600"
                      >
                        No bookings yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <a href="/admin/bookings" className="card-interactive">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-bold text-lg mb-2">Manage Bookings</h3>
              <p className="text-gray-600 text-sm">
                View, approve, and manage all bookings
              </p>
            </a>
            <a href="/admin/services" className="card-interactive">
              <div className="text-3xl mb-3">⚙️</div>
              <h3 className="font-bold text-lg mb-2">Service Management</h3>
              <p className="text-gray-600 text-sm">
                Add, edit, or remove services
              </p>
            </a>
            <div className="card-interactive">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-lg mb-2">Reports</h3>
              <p className="text-gray-600 text-sm">
                Generate booking and revenue reports
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
