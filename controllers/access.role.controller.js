const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const acessRoleServices = require("../services/access.role.services");

exports.index = useAsync(async function (req, res, next) {
  try {
    let roles = await acessRoleServices.all();

    return res.status(200).send(JParser("ok-response", true, roles));
  } catch (error) {
    next(error);
  }
});

exports.user_role = useAsync(async function (req, res, next) {
  try {
    let roles = await acessRoleServices.findAllBy({ userLevel: "user" });

    return res.status(200).send(JParser("ok-response", true, roles));
  } catch (error) {
    next(error);
  }
});

exports.business_role = useAsync(async function (req, res, next) {
  try {
    let roles = await acessRoleServices.findAllBy({ userLevel: "business" });

    return res.status(200).send(JParser("ok-response", true, roles));
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
    let find = await acessRoleServices.findBy({ title });

    if (!find) {
      const create = await acessRoleServices.store(req);

      if (create) {
        return res
          .status(201)
          .send(JParser("access role created successfully", true, create));
      } else {
        return res
          .status(400)
          .send(JParser("something went wrong", true, null));
      }
    } else {
      return res.status(400).send(JParser("access already exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async function (req, res, next) {
  try {
    const { id } = req.params;

    const isRole = await acessRoleServices.findOne(id);

    if (isRole) {
      // check if role already exist
      let update = await acessRoleServices.update(id, req);

      if (update) {
        const role = await acessRoleServices.findOne(id);

        return res
          .status(200)
          .send(JParser("role updated successfully", true, role));
      }
    } else {
      return res
        .status(400)
        .send(JParser("role does not exist on the system", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async function (req, res, next) {
  try {
    const { id } = req.params;

    const role = await acessRoleServices.findOne(id);

    if (role) {
      const deleteRole = await acessRoleServices.destroy(id);

      if (deleteRole) {
        return res
          .status(204)
          .send(JParser("role deleted successfully", true, null));
      } else {
        return res
          .status(400)
          .json(JParser("something went wrong", false, null));
      }
    } else {
      return res.status(400).send(JParser("role does not exist"));
    }
  } catch (error) {
    next(error);
  }
});

exports.role_by_id = useAsync(async function (req, res, next) {
  try {
    let { id } = req.params;
    const role = await acessRoleServices.findOne(id);

    if (role) {
      return res
        .status(200)
        .send(JParser("role fetch successfully", true, role));
    } else {
      return res.status(400).send(JParser("role does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.role_by_title = useAsync(async function (req, res, next) {
  try {
    let { title } = req.params;
    const role = await acessRoleServices.findBy({ title });

    if (role) {
      return res
        .status(200)
        .send(JParser("role fetch successfully", true, role));
    } else {
      return res.status(400).send({
        success: true,
        message: "Roles does not exit",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
});
