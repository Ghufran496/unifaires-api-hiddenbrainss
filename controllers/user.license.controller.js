const userLicenseServices = require("../services/user.licence.services");

const { utils, useAsync } = require("../core");

const { JParser } = utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await userLicenseServices.all();

    return res.status(200).json(JParser("ok-response", true, all));
  } catch (error) {
    next(error);
  }
});

exports.user_license = useAsync(async (req, res, next) => {
  try {
    req.body.userId = req.user.id;

    const userLicense = await userLicenseServices.findAllBy({
      userId: req.user.id,
    });

    if (!userLicense) {
      return res
        .status(404)
        .json(JParser("No user license found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, userLicense));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const userLicenses = req.body;

    const licenseData = userLicenses.map((license) => {
      return { ...license, userId };
    });

    const results = await Promise.all(
      licenseData.map(async (social) => {
        // Create a new record
        const createLicense = await userLicenseServices.store({ body: social });
        return {
          status: true,
          message: "Social created successfully",
          data: createLicense,
        };
      })
    );

    return res.status(201).json(JParser("ok-response", true, results));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await userLicenseServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    req.body.userId = req.user.id;

    const find = await userLicenseServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const update = await userLicenseServices.update(id, req);

    if (update) {
      const find = await userLicenseServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await userLicenseServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const destroy = await userLicenseServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});
