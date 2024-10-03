const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reason: { type: String },
  type: { type: String },
  division: { type: String },
  category: { type: String },
  priority: { type: String },
  dept: { type: String },
  location: { type: String },
  status: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
});

module.exports = mongoose.model('Project', ProjectSchema);
