import Service from '../models/Service.js';

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Admin)
export const createService = async (req, res) => {
  try {
    const { name, description, price, icon } = req.body;

    const serviceExists = await Service.findOne({ name });
    if (serviceExists) {
      return res.status(400).json({ message: 'Service already exists' });
    }

    const service = await Service.create({
      name,
      description,
      price,
      icon,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin)
export const updateService = async (req, res) => {
  try {
    const { name, description, price, icon } = req.body;

    const service = await Service.findById(req.params.id);

    if (service) {
      service.name = name || service.name;
      service.description = description || service.description;
      service.price = price || service.price;
      service.icon = icon || service.icon;

      const updatedService = await service.save();
      res.json(updatedService);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      await service.deleteOne();
      res.json({ message: 'Service removed' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
