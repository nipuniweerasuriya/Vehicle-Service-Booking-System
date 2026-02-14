import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  Users,
  Search,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  UserX,
  Shield,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { adminAPI } from "../api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const isAdmin = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter((u) => u._id !== userId));
      setDeleteConfirm(null);
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm),
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isAdmin) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  User Management
                </h1>
                <p className="text-slate-600 text-sm">
                  Manage registered users
                </p>
              </div>
            </div>
            <button
              onClick={() => fetchUsers(true)}
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

          
          <div className="card mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-500 rounded-lg flex items-center justify-center">
                  <Users size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-violet-600">
                    {users.length}
                  </p>
                  <p className="text-sm text-slate-600">Total Users</p>
                </div>
              </div>
            </div>
          </div>

          
          {loading ? (
            <div className="card text-center py-16">
              <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading users...</p>
            </div>
          ) : error ? (
            <div className="card text-center py-16">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
              <button onClick={() => fetchUsers()} className="btn-primary mt-4">
                Retry
              </button>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto -m-6">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="table-header">User</th>
                      <th className="table-header">Contact</th>
                      <th className="table-header">Joined</th>
                      <th className="table-header text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {user.name || "Unknown"}
                              </p>
                              <p className="text-xs text-slate-500">
                                ID: {user._id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="space-y-1">
                            <p className="flex items-center gap-2 text-sm text-slate-700">
                              <Mail size={14} className="text-slate-400" />
                              {user.email}
                            </p>
                            {user.phone && (
                              <p className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone size={14} className="text-slate-400" />
                                {user.phone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar size={14} className="text-slate-400" />
                            {formatDate(user.createdAt)}
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center justify-end">
                            {deleteConfirm === user._id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(user._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete User"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card text-center py-16">
              <UserX className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No users found
              </h3>
              <p className="text-slate-500">
                {searchTerm
                  ? "Try adjusting your search"
                  : "Users will appear here when they register"}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
