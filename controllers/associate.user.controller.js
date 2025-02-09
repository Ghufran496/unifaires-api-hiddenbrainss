const { useAsync } = require("../core");
const { JParser } = require("../core").utils;

const associateUserServices = require("../services/associate.user.services");
const { voucher } = require("../helpers/voucher");
exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await associateUserServices.all();

    if (all) {
      return res
        .status(200)
        .json(JParser("associate user fetch successfully", true, all));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const create = await associateUserServices.store(req);

    if (create) {
      return res
        .status(201)
        .json(JParser("associate user saved successfully", true, create));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await associateUserServices.findOne(id);

    if (user) {
      return res
        .status(200)
        .json(JParser("associate user fetch successfully", true, user));
    } else {
      return res
        .status(404)
        .json(JParser("associate user not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await associateUserServices.findOne(id);

    if (user) {
      const update = await associateUserServices.update(id, req);

      if (update) {
        const user = await associateUserServices.findOne(id);

        return res
          .status(200)
          .json(JParser("associate user updated successfully", true, user));
      }
    } else {
      return res
        .status(404)
        .json(JParser("associate user not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await associateUserServices.findOne(id);

    if (user) {
      const destroy = await associateUserServices.destroy(id);

      if (destroy) {
        return res
          .status(204)
          .json(JParser("associate user deleted successfully", true, null));
      }
    } else {
      return res
        .status(404)
        .json(JParser("associate user not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.associate_users = useAsync(async (req, res, next) => {
  try {
    let idField = null;

    if (req.user) {
      idField = req.user.id;
    } else if (req.business) {
      idField = req.business.id;
    }

    if (idField) {
      const columnToUse = req.user ? "userId" : "businessId";

      const query = { [columnToUse]: idField };

      associates = await associateUserServices.findBy(query);
    }

    if (associates)
      return res.status(200).json(JParser("success", true, associates));
  } catch (error) {
    next(error);
  }
});
