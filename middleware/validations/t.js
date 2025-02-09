exports.store = useAsync(async (req, res, next) => {
  const { Sequelize } = require("../config/db"); // Ensure this path matches your actual config
  require("sequelize-hierarchy-next")(Sequelize);

  const sequelizeInstance = new Sequelize();

  try {
    const transaction = await sequelizeInstance.transaction();
    const results = [];

    for (const invite of req.body.invites) {
      const { email, invitedUserType, roleIds, permissionIds } = invite;

      if (
        !(await validateRoles(roleIds, transaction)) ||
        !(await validatePermissions(permissionIds, transaction))
      ) {
        await transaction.rollback();
        return res
          .status(404)
          .json(JParser("Invalid role or permission passed", false, null));
      }

      const invitedEntityType =
        invitedUserType === "user"
          ? {
              service: userServices,
              roleTitle: "user",
              idFieldName: "userId",
            }
          : {
              service: businessServices,
              roleTitle: "business",
              idFieldName: "businessId",
            };

      const existingEntity = await invitedEntityType.service.findBy(
        { email },
        { transaction }
      );

      let entityData = {};
      if (existingEntity) {
        entityData = await handleExistingEntity(
          req,
          existingEntity,
          invitedEntityType.service,
          invitedEntityType.idFieldName,
          transaction
        );
      } else {
        entityData = await handleNewEntity(
          email,
          invitedEntityType,
          transaction
        );
      }

      if (entityData.response) {
        await transaction.rollback();
        return res.status(entityData.status).json(entityData.response);
      }

      req.body[`${invitedUserType}Id`] = entityData.id;
      req.body.token = ndigit.gen(32);
      setOwnerInfo(req);

      const creationResult = await inviteService.store(req, { transaction });

      if (!creationResult) {
        await transaction.rollback();
        return res
          .status(500)
          .json(JParser("Something went wrong", true, creationResult));
      }

      results.push(creationResult);
    }

    await transaction.commit();
    return res
      .status(201)
      .json(JParser("Invites created successfully", true, results));
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

async function validateRoles(roleIds, transaction) {
  const roles = await Promise.all(
    roleIds.map((roleId) => accessRoleServices.findOne(roleId, { transaction }))
  );
  return roles.every((role) => role);
}

async function validatePermissions(permissionIds, transaction) {
  const permissions = await Promise.all(
    permissionIds.map((permissionId) =>
      accessPermissionServices.findOne(permissionId, { transaction })
    )
  );
  return permissions.every((permission) => permission);
}

async function handleExistingEntity(
  req,
  entity,
  service,
  idFieldName,
  transaction
) {
  const invitationCheck = {
    [idFieldName]: entity.id,
    ownerType: req.user ? "user" : "business",
    ownersId: req.user ? req.user.id : req.business.id,
  };

  if (await inviteService.findBy(invitationCheck, { transaction })) {
    return {
      status: 409,
      response: JParser(
        `Invites already exist for ${entity.email}`,
        false,
        null
      ),
    };
  }

  return { id: entity.id };
}

async function handleNewEntity(email, { service, roleTitle }, transaction) {
  const username = generateUsername(
    email,
    roleTitle.startsWith("user") ? "" : "b-"
  );
  const role = await roleServices.findBy({ title: roleTitle }, { transaction });
  const entityValue = constructNewEntity(email, username, role.id, roleTitle);

  const [entity, created] = await service.findOrCreate(
    { email, entityValue },
    { transaction }
  );

  if (!created) {
    return {
      status: 500,
      response: JParser("Failed to create a new entity", false, null),
    };
  }

  return { id: entity.id };
}

function setOwnerInfo(req) {
  if (req.user) {
    return { ownerType: "user", ownersId: req.user.id };
  } else if (req.business) {
    return { ownerType: "business", ownersId: req.business.id };
  }
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
