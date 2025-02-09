const Joi = require("joi");
const { utils, useAsync } = require("../../core");
const { JParser } = utils;
const skillsServices = require("../../services/skills.services");

exports.add_skills = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_sub_skills = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      parentId: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.update_skills = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "validation failed",
        error: error.details,
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

exports.add_bulk_skills = async (req, res, next) => {
  try {
    const schema = Joi.object({
      skills: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
        })
      ),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "validation failed",
        error: error.details,
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

// skills array validation
exports.validate_bulk_skills = useAsync(async (req, res, next) => {
  try {
    // check skills
    if (!req.body.skills) {
      next();
    }

    const skillsArray = req.body.skills;
    const invalidSkills = [];

    for (const skill of skillsArray) {
      const isSkill = await skillsServices.findOne(skill);
      if (!isSkill) {
        invalidSkills.push(skill);
      }
    }

    if (invalidSkills.length > 0) {
      return res
        .status(400)
        .json(
          JParser(`Invalid skills: ${invalidSkills.join(",")}`, false, null)
        );
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

exports.validate_update_bulk_skills = useAsync(async (req, res, next) => {
  try {
    // check skills

    if (req.body.skills) {
      const skillsArray = req.body.skills;
      const invalidSkills = [];

      for (const skill of skillsArray) {
        const isSkill = await skillsServices.findOne(skill);

        if (!isSkill) {
          invalidSkills.push(skill);
        }
      }

      if (invalidSkills.length > 0) {
        return res
          .status(400)
          .json(JParser(`Invalid skills: ${invalidSkills}`, false, null));
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});
