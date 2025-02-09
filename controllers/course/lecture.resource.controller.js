const { useAsync } = require("../../core");
const { JParser } = require("../../core/core.utils");
const lectureResourceServices = require("../../services/course/lecture.resource.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const lectureResource = await lectureResourceServices.all();

    if (lectureResource) {
      return res
        .status(200)
        .json(
          JParser("lecture resources fetch successfully", true, lectureResource)
        );
    } else {
      return res.status(404).json(JParser("lecture not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const addResource = await lectureResourceServices.store(req);

    if (addResource) {
      if (req.body.meta) {
        req.body.meta = JSON.stringify(req.body.meta);
      }
      return res
        .status(201)
        .json(
          JParser("lecture resource created successfully", true, addResource)
        );
    } else {
      return res.status(400).json(JParser("something went wrong", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const lectureResource = await lectureResourceServices.findOne(id);

    if (lectureResource) {
      return res
        .status(200)
        .json(
          JParser("lecture resources fetch successfully", true, lectureResource)
        );
    } else {
      return res
        .status(404)
        .json(JParser("lecture does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check if resource exists
    const lectureResource = await lectureResourceServices.findOne(id);

    if (lectureResource) {
      const updateResource = await lectureResourceServices.update(id, req);

      if (updateResource) {
        return res
          .status(200)
          .json(JParser("lecture updated successfully", true, updateResource));
      } else {
        return res.status(400).json(JParser("something went wrong"));
      }
    } else {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteResource = await lectureResourceServices.destroy(id);

    if (deleteResource) {
      return res.status(204).json(JParser("deleted", true, null));
    } else {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});
