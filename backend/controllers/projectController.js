const Project = require('../models/Project');
const moment = require('moment');

exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({
      status: true,
      data: project,
      message: "Project Created Successfully!"
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: err?.message
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortField = 'projectName', sortOrder = 'asc' } = req.query;
    const projects = await Project.find()
      .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    res.json({ status: true,
      data: projects,
      message: "Project fetch Successfully!" 
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: err?.message
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ status: true,
      data: project,
      message: "Project updated Successfully!" 
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: err?.message
    });
  }
};

exports.getCardValues = async (req, res) => {
  try {
    const today = moment().startOf('day');
    const totalProjects = await Project.countDocuments();
    const closedProjects = await Project.countDocuments({ status: 'Closed' });
    const runningProjects = await Project.countDocuments({ status: 'Running' });
    const closureDelayProjects = await Project.countDocuments({
      status: 'Running',
      endDate: { $lt: today.toDate() },
    });
    const cancelledProjects = await Project.countDocuments({ status: 'Cancelled' });

    const openProjects = totalProjects - closedProjects - cancelledProjects;

    const cardValues = {
      total: totalProjects,
      closed: closedProjects,
      running: runningProjects,
      cancelled: cancelledProjects,
      closure: closureDelayProjects,
      open: openProjects,
    };

    res.json({
      status: true,
      data: cardValues,
      message: "Card values fetched successfully!"
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: err?.message
    });
  }
};

exports.getDepartmentSuccessRates = async (req, res) => {
  try {
    const result = await Project.aggregate([
      {
        $group: {
          _id: { department: "$dept" },
          totalProjects: { $sum: 1 },
          closedProjects: { $sum: { $cond: [{ $eq: ["$status", "Closed"] }, 1, 0] } }
        }
      },
      {
        $project: {
          department: "$_id.department",
          totalProjects: 1,
          closedProjects: 1,
          successPercentage: { $multiply: [{ $divide: ["$closedProjects", "$totalProjects"] }, 100] }
        }
      }
    ]);

    res.json({
      status: true,
      data: result,
      message: "Department success rates fetched successfully!"
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: err?.message
    });
  }
};
