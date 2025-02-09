const workExperienceServices = require("../services/workexperience.services");

const { utils, useAsync } = require("../core");

const { JParser } = utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await workExperienceServices.all();

    if (all) {
      return res
        .status(200)
        .json(JParser("work experience fetch successfully", true, all));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_workexperience = useAsync(async (req, res, next) => {
  try {
    let column;
    let value;

    if (req.user) {
      column = "userId";
      value = req.user.id;
    } else if (req.business) {
      column = "businessId";
      value = req.business.id;
    }

    const workExperience = await workExperienceServices.findAllBy({
      [column]: value,
    });

    if (workExperience) {
      return res
        .status(200)
        .json(
          JParser(
            "work experience retrieved successfully",
            true,
            workExperience
          )
        );
    } else {
      return res
        .status(404)
        .json(JParser("No work experience found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const create = await workExperienceServices.store(req);

    console.log(create);

    if (create) {
      return res
        .status(200)
        .json(JParser("work experience added successfully", true, create));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await workExperienceServices.findOne(id);

    if (find) {
      return res
        .status(200)
        .json(JParser("work experience fetch successfully", true, find));
    } else {
      return res
        .status(404)
        .json(JParser("work experience doest not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user) {
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business;
    }

    const find = await workExperienceServices.findOne(id);

    if (find) {
      const update = await workExperienceServices.update(id, req);

      if (update) {
        const find = await workExperienceServices.findOne(id);

        return res
          .status(200)
          .json(JParser("work experience fetch successfully", true, find));
      }
    } else {
      return res
        .status(404)
        .json(JParser("work experience doest not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await workExperienceServices.findOne(id);

    if (find) {
      const destroy = await workExperienceServices.destroy(id);

      if (destroy) {
        return res
          .status(204)
          .json(JParser("work experience deleted successfully", true, null));
      }
    } else {
      return res
        .status(404)
        .json(JParser("work experience doest not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});
