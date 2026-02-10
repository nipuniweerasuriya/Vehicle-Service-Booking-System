import { useState, useContext } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BookingContext } from "../context/BookingContext";

export default function ServiceManagement() {
  const { services, addService } = useContext(BookingContext);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    icon: "Wrench",
  });
  const [editingId, setEditingId] = useState(null);

  const iconOptions = ["Wrench", "Droplet", "Zap", "Disc3", "Battery", "Wind"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.name && formData.description && formData.price) {
      if (editingId) {
        // In a real app, would update existing service
        setEditingId(null);
      } else {
        addService(formData);
      }

      setFormData({
        name: "",
        description: "",
        price: "",
        icon: "Wrench",
      });
      setShowForm(false);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      icon: service.icon,
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      icon: "Wrench",
    });
  };

  const getEmojiForIcon = (icon) => {
    const emojiMap = {
      Wrench: "🔧",
      Droplet: "💧",
      Zap: "⚡",
      Disc3: "🔄",
      Battery: "🔋",
      Wind: "💨",
    };
    return emojiMap[icon] || "🔧";
  };

  return (
    <>
      <Header />

      <main className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent mb-2">
                Service Management
              </h1>
              <p className="text-gray-600">
                Add, edit, or remove services from your catalog
              </p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Service</span>
              </button>
            )}
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="card shadow-medium mb-8 animate-slide-down bg-white/80 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? "Edit Service" : "Add New Service"}
                </h2>
                <button
                  onClick={handleCancel}
                  className="p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Service Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Regular Maintenance"
                      className="input-field"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g., $99"
                      className="input-field"
                      required
                    />
                  </div>

                  {/* Icon Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      name="icon"
                      value={formData.icon}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {getEmojiForIcon(icon)} {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the service in detail..."
                    rows="4"
                    className="input-field resize-none"
                    required
                  ></textarea>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <button type="submit" className="btn-primary flex-1">
                    {editingId ? "Update Service" : "Add Service"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const gradients = [
                "from-blue-400 via-cyan-400 to-teal-400",
                "from-cyan-400 to-emerald-400",
                "from-emerald-400 to-green-400",
                "from-purple-400 to-pink-400",
                "from-orange-400 to-red-400",
                "from-yellow-400 to-orange-400",
              ];
              const gradient = gradients[index % gradients.length];

              return (
                <div
                  key={service.id}
                  className="card shadow-medium bg-white/80 backdrop-blur hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`text-4xl w-16 h-16 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}
                    >
                      {getEmojiForIcon(service.icon)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 hover:bg-cyan-50 text-cyan-600 rounded-lg transition"
                        title="Edit service"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                        title="Delete service"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-2 text-gray-900">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {service.description}
                  </p>

                  <div className="pt-4 border-t border-cyan-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Price</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                        {service.price}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {services.length === 0 && !showForm && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Services Added
              </h3>
              <p className="text-gray-600 mb-6">
                Start by adding your first service
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Your First Service</span>
              </button>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Services added here will be available in
              the booking form for customers. Make sure to provide clear
              descriptions and accurate pricing.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
