let { User, Business } = require("../models");
const roleServices = require("../services/role.service");
const inviteServices = require("../services/invite.services");
const accessRoleServices = require("../services/access.role.services");
const accessPermissionServices = require("../services/access.permissions.services");
const accessRolePermissionServices = require("../services/access.role.permission.services");
const { errorHandle, useAsync } = require("../core");
const usersServices = require("../services/users.services");
const businessServices = require("../services/business.services");

exports.bodyParser = (req, res, next) => {
  if (!Object.keys(req.body).length > 0)
    throw new errorHandle("the document body is empty", 202);
  else next();
};

// dynamics auth
exports.authorize = (authRoles) => {
  return useAsync(async (req, res, next) => {
    const xToken = req.headers["x-token"];

    if (typeof xToken === "undefined") {
      throw new errorHandle(
        "Unauthorized Access, Use a valid token and try again",
        401
      );
    }

    let isBusiness = null;
    let isValid = await findUserByToken(xToken);

    if (!isValid) {
      throw new errorHandle(
        "Invalid x-token code or token, Use a valid token and try again",
        401
      );
    }
    
    const role = await roleServices.findOne(isValid.roleId);

    if (authRoles.includes(role.title)) {
      if (isBusiness) {
        req.business = isValid;
        if (Array.isArray(req.body)) {
          req.body = req.body.map((body) => ({
            ...body,
            businessId: req.business.id,
          }));
        }
      } else {
        req.user = isValid;
        if (Array.isArray(req.body)) {
          req.body = req.body.map((body) => ({ ...body, userId: req.user.id }));
        }
      }

      next();
    } else {
      throw new errorHandle(
        "x-token is valid but is not authorized for this route, Use a valid token and try again",
        403
      );
    }

    async function findUserByToken(token) {
      const businessRoleIncluded = authRoles.includes("business");

      if (businessRoleIncluded) {
        // check if the user

        const businessUser = await Business.findOne({ where: { token } });
        if (businessUser) {
          isBusiness = true;
          return businessUser;
        }
      }

      return await User.findOne({ where: { token } });
    }
  });
};

// dynamic role and permission auth
exports.manageAccountAuth = ({ roles = [], permissions = [] }) => {
  return useAsync(async (req, res, next) => {
    const ownersId = req.headers["owners-id"];
    const ownerType = req.headers["owner-type"];

    if (typeof ownersId === "undefined") {
      throw new errorHandle("owners-id is required as part of header", 401);
    }

    if (typeof ownerType === "undefined") {
      throw new errorHandle("owner-type is required as part of header", 401);
    }

    if (
      (!roles || roles.length === 0) &&
      (!permissions || permissions.length === 0)
    ) {
      throw new errorHandle(
        "Either roles or permissions must be provided and not empty.",
        400
      );
    }

    // validate the owners id

    let ownerData = null;

    if (ownerType === "user") {
      // replace the user data with the ownere id record

      ownerData = await usersServices.findOne(ownersId);

      if (!ownerData) {
        throw new errorHandle("invalid owner's id passed", 400);
      }
    } else if (ownerType === "business") {
      ownerData = await businessServices.findOne(ownersId);

      if (!ownerData) {
        throw new errorHandle("invalid owner's id passed", 400);
      }
    }

    let invite;

    if (req.user) {
      invite = await inviteServices.findBy({
        ownersId,
        ownerType,
        userId: req.user.id,
      });
    } else if (req.business) {
      invite = await inviteServices.findBy({
        ownersId,
        ownerType,
        businessId: req.business.id,
      });
    }

    if (!invite) {
      throw new errorHandle(
        "Unauthorized Access, you don't have permissons for this operation",
        401
      );
    } else if (
      typeof invite?.dataValues?.roles?.[0]?.title === "string" &&
      invite.dataValues.roles[0].title.trim() !== ""
    ) {
      ownerData.roleName = invite.dataValues.roles[0].title
        .toLowerCase()
        .trim();
    }

    const userPermissionsIds = JSON.parse(invite.permissionIds);
    const userRoleIds = JSON.parse(invite.roleIds)
      ? JSON.parse(invite.roleIds)
      : [];

    const rolePromises = userRoleIds.map((id) =>
      accessRolePermissionServices.findAllBy({ id })
    );

    const userRoles = await Promise.all(rolePromises);

    let rolePermissionIds = [];
    userRoles.forEach((roles) => {
      if (roles[0] && roles[0].accessrolepermissions) {
        if (roles[0].accessrolepermissions) {
          const accessPermissions = roles[0].accessrolepermissions;

          if (accessPermissions) {
            accessPermissions.forEach((access) => {
              if (!rolePermissionIds.includes(access.accesspermission.id)) {
                rolePermissionIds.push(access.accesspermission.id);
              }
            });
          }
        }
      }
    });

    rolePermissionIds.forEach((permission) => {
      if (!userPermissionsIds.includes(permission)) {
        userPermissionsIds.push(permission);
      }
    });

    // Fetch all permissions and roles
    const permissionPromises = userPermissionsIds.map((id) =>
      accessPermissionServices.findOne(id)
    );

    const userPermissions = await Promise.all(permissionPromises);

    let hasRequiredRoles = false;

    // Check if user has all required roles
    if (roles.length !== 0) {
      hasRequiredRoles = roles.every((requiredRole) =>
        userRoles.some(
          (role) => role && role[0].dataValues.title === requiredRole
        )
      );
    }

    // Check if user has all required permissions
    let hasRequiredPermissions = false;

    if (permissions.length !== 0) {
      hasRequiredPermissions = permissions.every((requiredPermission) =>
        userPermissions.some(
          (permission) => permission && permission.title === requiredPermission
        )
      );
    }

    if (hasRequiredRoles === false && hasRequiredPermissions === false) {
      throw new errorHandle("Access denied: insufficient permissions", 403);
    }

    if (ownerType === "user") {
      req.business = null;
      req.user.roleName = ownerData.roleName;
    } else if (ownerType === "business") {
      req.user = null;
      req.business.roleName = ownerData.roleName;
    }

    next();
  });
};

// non authorize middleware
exports.nonStrictlyAuthorize = (authRoles) => {
  return useAsync(async (req, res, next) => {
    const xToken = req.headers["x-token"];

    if (typeof xToken === "undefined") {
      return next(); // Allow the request to pass through if x-token is not provided
    }

    const { user, type } = await findUserByToken(xToken);

    if (user) {
      const role = await roleServices.findOne(user.roleId);

      if (authRoles.includes(role.title)) {
        if (type === "business") {
          req.business = user;
          if (Array.isArray(req.body)) {
            req.body = req.body.map((body) => ({
              ...body,
              businessId: req.business.id,
            }));
          }
        } else {
          req.user = user;
          if (Array.isArray(req.body)) {
            req.body = req.body.map((body) => ({
              ...body,
              userId: req.user.id,
            }));
          }
        }
      } else {
        throw new errorHandle(
          "x-token is valid but is not authorized for this route, Use a valid token and try again",
          403
        );
      }
    }

    // Proceed to the next middleware or route handler
    next();

    async function findUserByToken(token) {
      const businessRoleIncluded = authRoles.includes("business");

      if (businessRoleIncluded) {
        // Check if the token belongs to a business user
        const businessUser = await Business.findOne({ where: { token } });
        if (businessUser) {
          return { user: businessUser, type: "business" };
        }
      }

      // Check if the token belongs to a normal user
      const user = await User.findOne({ where: { token } });
      if (user) {
        return { user, type: "user" };
      }

      // Return null if no user or business user is found
      return { user: null, type: null };
    }
  });
};
