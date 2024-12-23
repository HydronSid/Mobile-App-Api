const catchAsync = require("../utils/catchAsync");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
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
  });
