const { useAsync } = require('../core');
const { JParser } = require('../core/core.utils');
const roleService = require('../services/role.service');
const usersServices = require('../services/users.services');
const roles_data = require('../data/roles.json');

exports.index = useAsync(async function (req, res, next) {
  try {
    let roles = await roleService.all();

    return res
      .status(200)
      .send(JParser('roles fetch successfully', true, roles));
  } catch (error) {
    next(error);
  }
});

exports.seed_store = useAsync(async (req, res, next) => {
  try {
    for (const role of roles_data) {
      const roleData = await roleService.findBy({ title: role.title });
      if (!roleData) {
        const newRole = await roleService.store({ body: role });
        if (newRole) {
          console.log(`Role '${role.title}' created successfully.`);
        } else {
          console.error(`Failed to create role '${role.title}'.`);
        }
      } else {
        console.log(`Role '${role.title}' already exists.`);
      }
    }
    
    const roles = await roleService.all();

    return res
      .status(200)
      .send(JParser('roles seeded successfully', true, roles));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async function (req, res, next) {
  // Save the values into the database

  try {
    const { title, description } = req.body;

    const data = {
      title: title,
      description: description,
    };

    // check if title already exist
    let titleCheck = await roleService.findBy({ title });

    if (!titleCheck) {
      const create = await roleService.store(req);

      if (create) {
        return res
          .status(201)
          .send(JParser('role created successfully', true, create));
      } else {
        return res
          .status(400)
          .send(JParser('something went wrong', true, null));
      }
    } else {
      return res.status(400).send(JParser('roles already exist', false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async function (req, res, next) {
  try {
    const { id } = req.params;

    const isRole = await roleService.findOne(id);

    if (isRole) {
      // check if role already exist
      let update = await roleService.update(id, req);

      if (update) {
        const role = await roleService.findOne(id);

        return res
          .status(200)
          .send(JParser('role updated successfully', true, role));
      }
    } else {
      return res
        .status(400)
        .send(JParser('role does not exist on the system', false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async function (req, res, next) {
  try {
    const { id } = req.params;

    const role = await roleService.findOne(id);

    if (role) {
      const deleteRole = await roleService.destroy(id);

      if (deleteRole) {
        return res
          .status(204)
          .send(JParser('role deleted successfully', true, null));
      } else {
        return res
          .status(400)
          .json(JParser('something went wrong', false, null));
      }
    } else {
      return res.status(400).send(JParser('role does not exist'));
    }
  } catch (error) {
    next(error);
  }
});

exports.role_by_id = useAsync(async function (req, res, next) {
  try {
    let { id } = req.params;
    const role = await roleService.findOne(id);

    if (role) {
      return res
        .status(200)
        .send(JParser('role fetch successfully', true, role));
    } else {
      return res.status(400).send(JParser('role does not exist', false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.role_by_title = useAsync(async function (req, res, next) {
  try {
    let { title } = req.params;
    const role = await roleService.findBy({ title });

    if (role) {
      return res
        .status(200)
        .send(JParser('role fetch successfully', true, role));
    } else {
      return res.status(400).send({
        success: true,
        message: 'Roles does not exit',
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
});

exports.add_user_role = useAsync(async function (req, res, next) {
  // verify user
  const isUser = await usersServices.findOne(req.body.userId);

  const isRole = await roleService.findOne(req.body.roleId);

  if (isUser && isRole) {
    const role = await roleService.changeUserRole(req);

    if (role) {
      return res
        .status(200)
        .json(JParser('user role updated successfully', true, null));
    } else {
      return res
        .status(400)
        .json(JParser('failed to update user role', true, false));
    }
  } else {
    return res.status(404).json(JParser('user does not exist', false, null));
  }
  // change the users roles
});
