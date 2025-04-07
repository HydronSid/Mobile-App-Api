const mongoose = require("mongoose");

exports.deleteOne = (Model) => async (req, res) => {
  try {
    const id = req.params.id;

    // Validate ObjectId before query
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        response: false,
        error: "Invalid ID format.",
      });
    }
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({
        response: false,
        error: "No record found.",
      });
    }

    res.status(204).json({
      status: "Deleted Successfully",
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

exports.updateOne = (Model) => async (req, res) => {
  try {
    const id = req.params.id;

    // Validate ObjectId before query
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        response: false,
        error: "Invalid ID format.",
      });
    }

    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return res.status(404).json({
        response: false,
        error: "No document found with Id.",
      });
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

exports.createOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.create(req.body);
    res.status(201).json({
      response: true,
      data: {
        data: doc,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};

exports.getOne = (Model, popOptions) => async (req, res) => {
  try {
    const id = req.params.id;

    // Validate ObjectId before query
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        response: false,
        error: "Invalid ID format.",
      });
    }
    let query = Model.findById(req.params.id);
    if (popOptions) query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      res.status(404).json({
        response: true,
        message: "No document found with Id",
      });
    }

    res.status(200).json({
      response: true,
      data: doc,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      response: false,
      error: error.message,
    });
  }
};
