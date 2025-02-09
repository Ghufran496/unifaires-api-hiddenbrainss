const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");

const drivingLicenseServices = require("../services/driving.license.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await drivingLicenseServices.all();

    if (all) {
      return res
        .status(201)
        .json(JParser("driving license fetched successfully", true, all));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    // check if user already register driving lincense

    const { id: userId } = req.user;

    req.body = req.body.map((body) => {
      return { ...body, userId };
    });

    const create = await drivingLicenseServices.store(req);

    if (create)
      return res
        .status(201)
        .json(JParser("driving license created successfully", true, create));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await drivingLicenseServices.findOne(id);

    if (find)
      return res
        .status(200)
        .json(JParser("license fetched successfully", true, find));
  } catch (error) {
    next(error);
  }
});

exports.user_license = useAsync(async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const find = await drivingLicenseServices.findAllBy({ userId });

    if (find)
      return res
        .status(200)
        .json(JParser("license fetched successfully", true, find));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await drivingLicenseServices.findOne(id);

    if (find) {
      const update = await drivingLicenseServices.update(id, req);

      if (update) {
        return res
          .status(200)
          .json(JParser("driving license updated successfully", true, update));
      }
    } else {
      return res
        .status(404)
        .json(JParser("license does not exist", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await drivingLicenseServices.findOne(id);

    if (find) {
      const destroy = await drivingLicenseServices.destroy(id);

      if (destroy) {
        return res
          .status(204)
          .json(JParser("driving license deleted successfully", true, null));
      }
    } else {
      return res
        .status(404)
        .json(JParser("license does not exist", true, find));
    }
  } catch (error) {
    next(error);
  }
});
