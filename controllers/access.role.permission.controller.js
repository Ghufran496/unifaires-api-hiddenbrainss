const { JParser } = require("../core/core.utils");
const { useAsync } = require("./../core");

const accessRolePermissionServices = require("../services/access.role.permission.services");
const accessRoleServices = require("../services/access.role.services");
const accessPermissionServices = require("../services/access.permissions.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await accessRolePermissionServices.all();

    return res.status(200).json(JParser("ok-response", true, all));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { roleId, permissionId } = req.body;

    // check if role and permission exist
    const isRole = await accessRoleServices.findOne(roleId);

    if (!isRole) {
      return res
        .status(404)
        .json(JParser("role id does not exist", false, null));
    }

    const isPermission = await accessPermissionServices.findOne(permissionId);

    if (!isPermission) {
      return res
        .status(404)
        .json(JParser("permission id does not exit", false, null));
    }

    // check if role already have the permission
    const isRolePermissioned = await accessRolePermissionServices.findBy({
      accessRoleId: roleId,
      accessPermissionId: permissionId,
    });

    if (isRolePermissioned) {
      return res
        .status(409)
        .json(JParser("this role, permission already exist", false, null));
    }

    req.body = {
      accessRoleId: req.body.roleId,
      accessPermissionId: req.body.permissionId,
    };

    const create = await accessRolePermissionServices.store(req);

    if (create) {
      return res.status(200).json(JParser("ok-response", true, create));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const find = await accessRolePermissionServices.findOne(id);

    if (find) {
      return res.status(200).json(JParser("ok-response", true, find));
    } else {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { roleId, permissionId } = req.body;
    const { id } = req.params;

    if (roleId) {
      // check if role and permission exist
      const isRole = await accessRoleServices.findOne(roleId);

      if (!isRole) {
        return res
          .status(404)
          .json(JParser("role id does not exist", false, null));
      }
    }

    if (permissionId) {
      const isPermission = await accessPermissionServices.findOne(permissionId);

      if (!isPermission) {
        return res
          .status(404)
          .json(JParser("permission id does not exit", false, null));
      }
    }

    if (roleId && permissionId) {
      // check if role already have the permission
      const isRolePermissioned = await accessRolePermissionServices.findBy({
        roleId,
        permissionId,
      });

      if (isRolePermissioned) {
        return res
          .status(409)
          .json(JParser("this role, permission already exist", false, null));
      }
    }

    const update = await accessRolePermissionServices.update(req, id);

    if (update) {
      return res.status(200).json(JParser("ok-response", true, update));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await accessRolePermissionServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("invalid id", false, null));
    }

    const destroy = await accessRolePermissionServices.destroy(id);

    if (destroy) {
      return res.status(200).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});
