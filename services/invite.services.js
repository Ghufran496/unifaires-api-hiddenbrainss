const {
  Invite,
  AccessRole,
  AccessPermission,
  User,
  Business,
  AccessRolePermission,
} = require("../models");
const accessRolePermissionServices = require("../services/access.role.permission.services");

const { Op } = require("sequelize");

function generateUserFilterValue(query) {
  let filterValue = [];

  for (let key in query) {
    if (["offset", "limit"].includes(key)) {
      continue;
    }
    if (User.getAttributes()[key] !== undefined) {
      if (Array.isArray(query[key])) {
        // If the query parameter is an array, use Op.or to filter for any of the values
        filterValue = [
          ...filterValue,
          {
            [`$user.${key}$`]: {
              [Op.or]: query[key].map((value) => ({
                [Op.like]: `%{value}%`,
              })),
            },
          },
        ];
      } else {
        // If the query parameter is a single value, filter normally
        filterValue = [
          ...filterValue,
          {
            [`$user.${key}$`]: {
              [Op.like]: `%${query[key]}%`,
            },
          },
        ];
      }
    }
  }

  // If the Op.or array is empty, remove it to avoid unnecessary filtering
  if (Object.keys(filterValue).length === 0) {
    filterValue = [];
  }

  return filterValue;
}

function generateBusinessFilterValue(query) {
  let filterValue = [];

  for (let key in query) {
    if (["offset", "limit"].includes(key)) {
      continue;
    }
    if (Business.getAttributes()[key] !== undefined) {
      if (Array.isArray(query[key])) {
        // If the query parameter is an array, use Op.or to filter for any of the values
        filterValue = [
          ...filterValue,
          {
            [`$business.${key}$`]: {
              [Op.or]: query[key].map((value) => ({
                [Op.like]: `%{value}%`,
              })),
            },
          },
        ];
      } else {
        // If the query parameter is a single value, filter normally
        filterValue = [
          ...filterValue,
          {
            [`$business.${key}$`]: {
              [Op.like]: `%${query[key]}%`,
            },
          },
        ];
      }
    }
  }

  // If the Op.or array is empty, remove it to avoid unnecessary filtering
  if (Object.keys(filterValue).length === 0) {
    filterValue = [];
  }

  return filterValue;
}

class InviteServices {
  async all() {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        if (!!Invite.getAttributes()[key]) {
          filterValue[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }

    const invites = await Invite.findAll({
      where: { ...filterValue },
      include: [
        {
          model: User,
          as: "user",
          required: false,
        },
        {
          model: Business,
          as: "business",
          required: false,
        },
      ],
    });

    const processedInvites = await Promise.all(
      invites.map(async (invite) => {
        if (invite.roleIds) {
          const roleArray = JSON.parse(invite.roleIds);
          const roles = await Promise.all(
            roleArray.map((roleId) => AccessRole.findByPk(roleId))
          );
          invite.dataValues.roles = roles.filter((role) => role !== null);
        }

        if (invite.permissionIds) {
          const permissionArray = JSON.parse(invite.permissionIds);

          const permissions = await Promise.all(
            permissionArray.map((permissionId) =>
              AccessPermission.findByPk(permissionId)
            )
          );

          invite.dataValues.permissions = permissions.filter(
            (permission) => permission !== null
          );
        }

        if (invite.ownerType === "user") {
          const user = await User.findOne({ id: invite.ownersId });

          invite.dataValues.ownerDetails = user;
        } else if (invite.ownerType === "business") {
          const business = await Business.findOne({ id: invite.ownersId });

          invite.dataValues.ownerDetails = business ? business : null;
        }
        return invite;
      })
    );

    return processedInvites;
  }

  async findOne(id, options = {}) {
    const invite = await Invite.findOne({
      where: { id },
      ...options,
      include: [
        {
          model: User,
          as: "user",
          required: false,
        },
        {
          model: Business,
          as: "business",
          required: false,
        },
      ],
    });

    if (!invite) {
      return null;
    }

    const rolesPromise = invite.roleIds
      ? this.getRoles(JSON.parse(invite.roleIds))
      : Promise.resolve([]);

    const permissionsPromise = invite.permissionIds
      ? this.getPermissions(JSON.parse(invite.permissionIds))
      : Promise.resolve([]);

    const [roles, permissions] = await Promise.all([
      rolesPromise,
      permissionsPromise,
    ]);

    if (invite.ownerType === "user") {
      const user = await User.findOne({ id: invite.ownersId });

      invite.dataValues.ownerDetails = user;
    } else if (invite.ownerType === "business") {
      const business = await Business.findOne({ id: invite.ownersId });

      invite.dataValues.ownerDetails = business ? business : null;
    }

    invite.dataValues.roles = roles;
    invite.dataValues.permissions = permissions;

    return invite;
  }

  async getRoles(roleArray) {
    const roles = await Promise.all(
      roleArray.map((roleId) =>
        accessRolePermissionServices.findAllByRole({ id: roleId })
      )
    );

    return roles.filter((role) => role !== null);
  }

  async getPermissions(permissionArray) {
    const permissions = await Promise.all(
      permissionArray.map((permissionId) =>
        AccessPermission.findByPk(permissionId)
      )
    );
    return permissions.filter((permission) => permission !== null);
  }

  async findBy(by, options = {}) {
    const invite = await Invite.findOne({
      where: by,
      ...options,
      include: [
        {
          model: User,
          as: "user",
          required: false,
        },
        {
          model: Business,
          as: "business",
          required: false,
        },
      ],
    });

    if (!invite) {
      return null;
    }

    // Handle roles
    if (invite.roleIds) {
      const roleArray = JSON.parse(invite.roleIds);

      const roles = await Promise.all(
        roleArray.map((roleId) =>
          AccessRole.findAll({
            where: { id: roleId },
            include: [
              {
                model: AccessRolePermission,
                include: [
                  {
                    model: AccessPermission,
                  },
                ],
              },
            ],
          })
        )
      );
      invite.dataValues.roles = roles.flat().filter((role) => role !== null);
    }

    // Handle permissions
    if (invite.permissionIds) {
      const permissionArray = JSON.parse(invite.permissionIds);

      const permissions = await Promise.all(
        permissionArray.map((permissionId) =>
          AccessPermission.findByPk(permissionId)
        )
      );
      invite.dataValues.permissions = permissions.filter(
        (permission) => permission !== null
      );
    }

    // Handle owner details
    if (invite.ownerType === "user") {
      const user = await User.findOne({ where: { id: invite.ownersId } });
      invite.dataValues.ownerDetails = user;
    } else if (invite.ownerType === "business") {
      const business = await Business.findOne({
        where: { id: invite.ownersId },
      });
      invite.dataValues.ownerDetails = business;
    }

    return invite;
  }

  async findAllBy(by, options = {}) {
    const invites = await Invite.findAll({
      where: by,
      ...options,
      include: [
        {
          model: User,
          as: "user",
          required: false,
        },
        {
          model: Business,
          as: "business",
          required: false,
        },
      ],
    });

    const processedInvites = await Promise.all(
      invites.map(async (invite) => {
        // Handle roles
        if (invite.roleIds) {
          const roleArray = JSON.parse(invite.roleIds);
          const roles = await this.getRoles(roleArray);
          invite.dataValues.roles = roles;
        }

        // Handle permissions
        if (invite.permissionIds) {
          const permissionArray = JSON.parse(invite.permissionIds);

          const permissions = await Promise.all(
            permissionArray.map((permissionId) =>
              AccessPermission.findByPk(permissionId)
            )
          );

          invite.dataValues.permissions = permissions.filter(
            (permission) => permission !== null
          );
        }

        // Handle owner details
        if (invite.ownerType === "user") {
          const user = await User.findOne({ where: { id: invite.ownersId } });
          invite.dataValues.ownerDetails = user;
        } else if (invite.ownerType === "business") {
          const business = await Business.findOne({
            where: { id: invite.ownersId },
          });
          invite.dataValues.ownerDetails = business;
        }

        return invite;
      })
    );

    return processedInvites;
  }

  async findUserInvites(req, by, offset, limit, options = {}) {
    const userFilterValue = generateUserFilterValue(req.query);
    const businessFilterValue = generateBusinessFilterValue(req.query);

    let filterValue = {};

    for (let key in req.query) {
      if (["offset", "limit"].includes(key)) {
        continue;
      }
      if (Invite.getAttributes()[key] !== undefined) {
        filterValue = {
          ...filterValue,
          [key]: {
            [Op.like]: `%${req.query[key]}%`,
          },
        };
      } else if (key === "inviteStatus") {
        filterValue = {
          ...filterValue,
          ["status"]: {
            [Op.like]: `%${req.query[key]}%`,
          },
        };
      }
    }

    let whereCond = { ...by, ...filterValue };
    let whereOrCondition = [];

    if (userFilterValue.length > 0) {
      whereOrCondition = [...whereOrCondition, ...userFilterValue];
    }
    if (businessFilterValue.length > 0) {
      whereOrCondition = [...whereOrCondition, ...businessFilterValue];
    }
    if (whereOrCondition.length > 0) {
      whereCond = { ...whereCond, [Op.or]: whereOrCondition };
    }

    const { count, rows: invites } = await Invite.findAndCountAll({
      distinct: true,
      where: whereCond,
      ...options,
      include: [
        {
          model: User,
          as: "user",
          required: false,
        },
        {
          model: Business,
          as: "business",
          required: false,
        },
      ],
      offset,
      limit,
    });

    const processedInvites = await Promise.all(
      invites.map(async (invite) => {
        // Handle roles
        if (invite.roleIds) {
          const roleArray = JSON.parse(invite.roleIds);
          const roles = await this.getRoles(roleArray);
          invite.dataValues.roles = roles;
        }

        // Handle permissions
        if (invite.permissionIds) {
          const permissionArray = JSON.parse(invite.permissionIds);

          const permissions = await Promise.all(
            permissionArray.map((permissionId) =>
              AccessPermission.findByPk(permissionId)
            )
          );

          invite.dataValues.permissions = permissions.filter(
            (permission) => permission !== null
          );
        }

        // Handle owner details
        if (invite.ownerType === "user") {
          const user = await User.findOne({ where: { id: invite.ownersId } });
          invite.dataValues.ownerDetails = user;
        } else if (invite.ownerType === "business") {
          const business = await Business.findOne({
            where: { id: invite.ownersId },
          });
          invite.dataValues.ownerDetails = business;
        }

        return invite;
      })
    );

    return { count, rows: processedInvites };
  }

  async store(req) {
    const data = req.body;
    return await Invite.create({ ...data });
  }

  async update(id, req, options = {}) {
    return await Invite.update(req.body, { where: { id }, ...options });
  }

  async destroy(id, options = {}) {
    return await Invite.destroy({ where: { id }, ...options });
  }
}

module.exports = new InviteServices();
