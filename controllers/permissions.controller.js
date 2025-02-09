const roleService = require("../services/role.service");
const permissionService = require("../services/permission.service");
const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");

exports.index = useAsync(async function (req, res, next) {
  try {
    let permissions = await permissionService.getAllPermission();

    return res
      .status(200)
      .send(JParser("permission fetch successfully", true, permissions));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async function (req, res, next) {
  try {
    // check if permission already exist
    const { roleId } = req.body;
    let isRole = await roleService.findOne(roleId);

    if (!isRole) {
      return res.status(400).json(JParser("invalid role id", false, null));
    } else {
      // check if permission already exist

      const isPermission = await permissionService.getAllPermissionByTitle(
        req.body.title
      );

      if (isPermission) {
        return res
          .status(400)
          .json(
            JParser(`${req.body.title} Permission already exist`, false, null)
          );
      } else {
        // add permission

        let createPermission = await permissionService.storePermission(req);

        if (createPermission) {
          return res
            .status(201)
            .send(
              JParser("permission created successfully", true, createPermission)
            );
        } else {
          return res
            .status(400)
            .json(JParser("something went wrong", true, null));
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async function (req, res) {
  try {
    const { id } = req.params;

    const isPermission = await permissionService.getAllPermissionById(id);

    if (isPermission) {
      const updatePermission = await permissionService.updatePermission(
        id,
        req
      );
      if (updatePermission) {
        const permission = await permissionService.getAllPermissionById(id);

        return res
          .status(200)
          .json(JParser("permission updated successfully", true, permission));
      } else {
        return res
          .status(400)
          .json(JParser("something went wrong", false, null));
      }
    } else {
      return res
        .status(400)
        .json(JParser("permisson does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async function (req, res) {
  try {
    const { id } = req.params;

    const deletePermission = await permissionService.deletePermission(id);

    if (deletePermission) {
      return res
        .status(204)
        .json(JParser("permission deleted successfully", true, null));
    } else {
      return res.status(400).json(JParser("invalid permission", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async function (req, res, next) {
  let { id } = req.params;

  let permission = await permissionService.getAllPermissionById(id);
  if (permission) {
    return res
      .status(200)
      .send(JParser("permission fetch successfully", true, permission));
  } else {
    return res.status(400).send(JParser("permission does not exist"));
  }
});
