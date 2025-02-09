const { JParser } = require("../core/core.utils");

const inviteService = require("../services/invite.services");

const roleServices = require("../services/role.service");
const accessRoleServices = require("../services/access.role.services");
const accessPermissionServices = require("../services/access.permissions.services");
const ndigit = require("n-digit-token");
const sha1 = require("sha1");

async function validateRoles(roleIds) {
  if (roleIds) {
    const roles = await Promise.all(
      roleIds.map((roleId) => accessRoleServices.findOne(roleId, {}))
    );

    return roles.every((role) => role);
  } else {
    return [];
  }
}

async function validatePermissions(permissionIds) {
  if (permissionIds) {
    const permissions = await Promise.all(
      permissionIds.map((permissionId) =>
        accessPermissionServices.findOne(permissionId, {})
      )
    );

    return permissions.every((permission) => permission);
  } else {
    return [];
  }
}

async function handleExistingEntity(res, req, entity, service, idFieldName) {
  const invitationCheck = {
    [idFieldName]: entity.id,
    ownerType: req.user ? "user" : "business",
    ownersId: req.user ? req.user.id : req.business.id,
  };

  const isInviteExist = await inviteService.findBy(invitationCheck);
  if (isInviteExist?.status === "accepted") {
    return {
      status: 409,
      response: `Invites already exist for ${entity.email}`,
    };
  }
  if (typeof isInviteExist?.id === "string") {
    await inviteService.destroy(isInviteExist?.id);
  }

  return { id: entity.id };
}

async function handleNewEntity(res, email, { service, roleTitle }) {
  const username = generateUsername(
    email,
    roleTitle.startsWith("user") ? "" : "b-"
  );
  const role = await roleServices.findBy({ title: roleTitle }, {});
  const entityValue = constructNewEntity(email, username, role.id, roleTitle);

  const [entity, created] = await service.findOrCreate(email, entityValue);

  if (!created) {
    return res
      .status(500)
      .json(JParser("Failed to create a new entity", false, null));
  }

  return { id: entity.id };
}

function generateUsername(email, prefix = "") {
  let username = `${prefix}-${ndigit.gen(6)}${email}`
    .toLowerCase()
    .replace(/[^\w-]/g, "")
    .replace(/\s+/g, "-");
  if (/^[0-9]/.test(username)) {
    username = username.replace(/^\d+/, "");
  }
  return username;
}

function constructNewEntity(email, username, roleId, entityType) {
  const defaults = {
    user: {
      apiKey: sha1(email + new Date().toISOString() + "user"),
      token: sha1(email + new Date().toISOString() + "user"),
      password: "default",
    },
    business: {
      apiKey: sha1(email + new Date().toISOString() + "business"),
      token: sha1(email + new Date().toISOString() + "business"),
      password: "default",
    },
  };

  return {
    firstname: "-",
    lastname: "-",
    email,
    username,
    roleId,
    ...defaults[entityType],
  };
}

function setOwnerInfo(req) {
  if (req.user) {
    req.body.ownerType = "user";
    req.body.ownersId = req.user.id;
  } else if (req.business) {
    req.body.ownerType = "business";
    req.body.ownersId = req.business.id;
  }
}

module.exports = {
  setOwnerInfo,
  constructNewEntity,
  generateUsername,
  handleNewEntity,
  handleExistingEntity,
  validatePermissions,
  validateRoles,
};
