const Joi = require("joi");
const { utils, useAsync } = require("../../core");
const { JParser } = utils;
const industryServices = require("../../services/industry.services");

exports.add_industry = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_subindustry = async (req, res, next) => {
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

exports.update_industry = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.add_bulk_industry = async (req, res, next) => {
  try {
    const schema = Joi.object({
      categories: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
        })
      ),
    });

    utils.validate(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.filter_industry = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string(),
      id: Joi.string(),
    });

    utils.validateQuery(schema)(req, res, next);
  } catch (error) {
    next(error);
  }
};

// industries array validation
exports.validate_bulk_industries = useAsync(async (req, res, next) => {
  try {
    // check industries
    if (!req.body.industriesId) {
      next();
    }

    const { industriesId } = req.body;
    const invalidIndustries = [];

    for (const industry of industriesId) {
      const isIndustry = await industryServices.findOne(industry);
      if (!isIndustry) {
        invalidIndustries.push(industry);
      }
    }

    if (invalidIndustries.length > 0) {
      return res
        .status(400)
        .json(
          JParser(
            `Invalid industries: ${invalidIndustries.join(",")}`,
            false,
            null
          )
        );
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

exports.validate_update_bulk_industries = useAsync(async (req, res, next) => {
  try {
    // check industries

    if (req.body.industriesId) {
      const { industriesId } = req.body;
      const invalidIndustrys = [];

      for (const industry of industriesId) {
        const isIndustry = await industryServices.findOne(industry);

        if (!isIndustry) {
          invalidIndustrys.push(industry);
        }
      }

      if (invalidIndustrys.length > 0) {
        return res
          .status(400)
          .json(
            JParser(`Invalid industries: ${invalidIndustrys}`, false, null)
          );
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
