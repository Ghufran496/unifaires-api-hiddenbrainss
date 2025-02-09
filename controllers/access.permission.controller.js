const accessPermissionServices = require("../services/access.permissions.services");
const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");

exports.index = useAsync(async function (req, res, next) {
  try {
    let find = await accessPermissionServices.all();

    return res.status(200).send(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.business_permission = useAsync(async function (req, res, next) {
  try {
    let find = await accessPermissionServices.findAllBy({
      userLevel: "business",
    });

    return res.status(200).send(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async function (req, res, next) {
  try {
    const find = await accessPermissionServices.findBy({
      title: req.body.title,
    });

    if (find) {
      return res
        .status(409)
        .json(
          JParser(`${req.body.title} Permission already exist`, false, null)
        );
    } else {
      // add permission

      let create = await accessPermissionServices.store(req);

      if (create) {
        return res.status(201).send(JParser("ok-response", true, create));
      } else {
        return res
          .status(400)
          .json(JParser("something went wrong", true, null));
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async function (req, res) {
  try {
    const { id } = req.params;

    const find = await accessPermissionServices.findOne(id);

    if (find) {
      const update = await accessPermissionServices.update(id, req);

      if (update) {
        const permission = await accessPermissionServices.findOne(id);

        return res.status(200).json(JParser("ok-response", true, permission));
      } else {
        return res
          .status(400)
          .json(JParser("something went wrong", false, null));
      }
    } else {
      return res
        .status(404)
        .json(JParser("permisson does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async function (req, res) {
  try {
    const { id } = req.params;

    const destroy = await accessPermissionServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    } else {
      return res
        .status(404)
        .json(JParser("access permission not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async function (req, res, next) {
  let { id } = req.params;

  let permission = await accessPermissionServices.findOne(id);
  if (permission) {
    return res.status(200).send(JParser("ok-response", true, permission));
  } else {
    return res.status(404).send(JParser("permission does not exist"));
  }
});
