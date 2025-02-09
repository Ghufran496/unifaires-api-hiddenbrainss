const courseService = require("../../services/course/course.services");
const categoryServices = require("../../services/category.services");
const skillsServices = require("../../services/skills.services");
const { useAsync } = require("../../core");
const { JParser } = require("../../core/core.utils");
const { calculatePagination } = require("../../helpers/paginate.helper");
const { USER_ROLES } = require("../../helpers/user.helper");

exports.store = useAsync(async function (req, res, next) {
  try {
    if (req.user) {
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business.id;
    }

    // check for category exist
    const isCategory = await categoryServices.findOne(req.body.categoryId);

    if (!isCategory) {
      return res
        .status(400)
        .json(JParser("category does not exist", false, null));
    }

    let create = await courseService.store(req);

    if (create) {
      return res.status(201).send(JParser("ok-response", true, create));
    } else {
      return res.status(400).send(JParser("something went wrong", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async function (req, res, next) {
  try {
    // check if course exists
    const { id } = req.params;

    if (req.user) {
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business.id;
    }

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
      }
    }

    const find = await courseService.findBy({ id });

    if (find) {
      const update = await courseService.update(id, req);

      if (update) {
        const find = await courseService.findBy({ id });

        return res.status(200).send(JParser("ok-response", true, find));
      } else {
        return res
          .status(400)
          .send(JParser("something went wrong", false, null));
      }
    } else {
      return res
        .status(404)
        .json(JParser("course does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async function (req, res, next) {
  try {
    const { id } = req.params;
    const destroy = await courseService.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    } else {
      return res.status(400).json(JParser("something went wrong"));
    }
  } catch (err) {
    next(err);
  }
});

exports.owner_course = useAsync(async function (req, res, next) {
  try {
    let conditionObj = undefined;
    if (
      typeof req?.user?.roleName === "string" &&
      typeof req?.user?.id === "string" &&
      req.user.id.trim() !== "" &&
      req.user.roleName.trim() === USER_ROLES.contributor
    ) {
      conditionObj = { userId: req.user.id };
    } else if (
      typeof req?.business?.roleName === "string" &&
      typeof req?.business?.id === "string" &&
      req.business.id.trim() !== "" &&
      req.business.roleName.trim() === USER_ROLES.contributor
    ) {
      conditionObj = { businessId: req.business.id };
    }

    const { limit, offset, page } = calculatePagination(req);

    const result = await courseService.findAllCourseBy(
      req,
      {
        ...conditionObj,
      },
      offset,
      limit
    );
    const courseArr = Array.isArray(result?.rows) ? result.rows : [];
    const resultCount = !Number.isNaN(parseInt(result?.count))
      ? parseInt(result.count)
      : 0;

    return res.status(200).send(
      JParser("ok-response", true, {
        courses: courseArr,
        currentPage: page,
        limit,
        count: resultCount,
        pages: Math.ceil(resultCount / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});
