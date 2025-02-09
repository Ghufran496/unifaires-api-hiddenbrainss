const { User, Role } = require("../../models");
const courseService = require("../../services/course/course.services");
const categoryServices = require("../../services/category.services");
const { useAsync } = require("../../core");
const { JParser } = require("../../core/core.utils");
const { calculatePagination } = require("../../helpers/paginate.helper");
const courseSkillsServices = require("../../services/course.skills.services");
const assocaiteServices = require("../../services/associate.user.services");
const sequelize = require("../../database");
const { USER_ROLES } = require("../../helpers/user.helper");
const sendgridServices = require("../../services/sendgrid.services");
const usersServices = require("../../services/users.services");

exports.index = useAsync(async function (req, res, next) {
  try {
    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await courseService.all(req, offset, limit);

    return res.status(200).send(
      JParser("ok-response", true, {
        courses: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.all = useAsync(async function (req, res, next) {
  try {
    // check for filter

    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await courseService.adminAll(req, offset, limit);

    return res.status(200).send(
      JParser("ok-response", true, {
        courses: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async function (req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { skills } = req.body;
    let roleName = "";
    if (
      typeof req?.user?.roleName === "string" &&
      req.user.roleName.trim() !== ""
    ) {
      roleName = req.user.roleName.toLowerCase().trim();
    } else if (
      typeof req?.business?.roleName === "string" &&
      req.business.roleName.trim() !== ""
    ) {
      roleName = req.business.roleName.toLowerCase().trim();
    }
    if (req?.user?.id) {
      req.body.userId = req.user.id;
    } else if (req?.business?.id) {
      req.body.businessId = req.business.id;
    }

    // check for category exist
    const isCategory = await categoryServices.findOne(req.body.categoryId);

    if (!isCategory) {
      return res
        .status(400)
        .json(JParser("category does not exist", false, null));
    }

    if (roleName === USER_ROLES.contributor) {
      req.body.status = "pending";
    }

    let create = await courseService.store(req, t);

    if (create) {
      // update the skills to the course skills table

      const bulkSkillsData = skills.map((skill) => {
        return {
          skillId: skill,
          courseId: create.id,
        };
      });

      const createCourseSkills = await courseSkillsServices.bulkStore(
        bulkSkillsData,
        t
      );

      if (createCourseSkills) {
        await t.commit();

        const find = await courseService.findOne(create.id);

        return res.status(201).send(JParser("ok-response", true, find));
      }
    }
  } catch (error) {
    await t.rollback();

    next(error);
  }
});

exports.update = useAsync(async function (req, res, next) {
  try {
    const { id } = req.params;
    const { skills } = req.body;
    let isApproveItem = false;

    if (req?.user?.id) {
      req.body.userId = req.user.id;
    } else if (req?.business?.id) {
      req.body.businessId = req.business.id;
    }

    const find = await courseService.findBy({ id });

    if (!find) {
      return res.status(404).json(JParser("course not found", false, null));
    }

    if ((Array.isArray(skills) ? skills : []).length > 0) {
      // remove the skills on this course
      await courseSkillsServices.destroyBy({
        courseId: find?.id,
      });
      // add this one to it

      const bulkSkillsData = skills.map((skill) => {
        return {
          skillId: skill,
          courseId: find?.id,
        };
      });

      await courseSkillsServices.bulkStore(bulkSkillsData);
    }
    if (
      typeof req?.body?.status === "string" &&
      req.body.status.toLowerCase().trim() === "approve"
    ) {
      req.body.status = "active";
      req.body.approveUserId = req.body.userId;
      req.body.approvedAt = new Date();
      isApproveItem = true;
    }

    delete req.body.userId;
    const update = await courseService.update(id, req);

    if (update) {
      const find = await courseService.findBy({ id });
      if (isApproveItem) {
        const userObj = await usersServices.findBy({
          id: find?.userId,
        });
        sendgridServices.sendApproveCourseEmail({
          courseObj: find,
          userObj: userObj?.dataValues,
        });
      }

      return res.status(200).send(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async function (req, res, next) {
  try {
    const { id } = req.params;

    const find = await courseService.findBy({ id });

    if (!find) {
      return res.status(404).json(JParser("course not found", false, null));
    }

    const destroy = await courseService.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (err) {
    next(err);
  }
});

exports.get_by_id = useAsync(async function (req, res, next) {
  try {
    const { id } = req.params;

    const course = await courseService.findOne(id);

    if (!course) {
      return res.status(404).json(JParser("not found", true, course));
    }

    return res.status(200).json(JParser("ok-response", true, course));
  } catch (error) {
    next(error);
  }
});

exports.get_by_slug = useAsync(async function (req, res, next) {
  try {
    const { slug } = req.params;

    const course = await courseService.findBy({ slug });
    if (course) {
      return res.status(200).json(JParser("course ok-response", true, course));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_courses = useAsync(async function (req, res, next) {
  try {
    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await courseService.findAllCourseBy(
      req,
      { userId: req.user.id },
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        courses: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.business_courses = useAsync(async function (req, res, next) {
  try {
    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await courseService.findAllCourseBy(
      req,
      { businessId: req.business.id },
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        courses: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});

// get course enrol
exports.get_course_enrol = useAsync(async function (req, res, next) {
  try {
    const { id } = req.params;

    // get the enrol where course id is :id
    const course = await courseService.findOne(id);

    if (course) {
      return res.status(200).json(JParser("course ok-response", true, course));
    }
  } catch (error) {
    next(error);
  }
});

/* skills gap */
exports.skills_courses = useAsync(async function (req, res, next) {
  try {
    const { skills } = req.body;
    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await courseService.skillsCourses(
      req,
      skills,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        courses: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.free_associate_course = useAsync(async (req, res, next) => {
  try {
    const { limit, offset, page } = calculatePagination(req);

    // Get the user id
    const { id: userId } = req.user;

    const associates = await assocaiteServices.findAllBy({
      associateId: userId,
    });

    // Get the business they are associated with
    const businessIds = associates
      .map((associate) => {
        if (associate.business && associate.business !== null) {
          return associate.business.id;
        }
      })
      .filter((id) => id !== undefined);

    const userIds = associates
      .map((associate) => {
        if (associate.invitedUser && associate.invitedUser !== null) {
          return associate.invitedUser.id;
        }
      })
      .filter((id) => id !== undefined);

    const adminIds = await User.findAll({
      include: [
        {
          model: Role,
          where: {
            title: "admin",
          },
        },
      ],
    });

    const newAdminIds = adminIds.map((admin) => admin.id);

    // Combine userIds and newAdminIds
    const combinedUserIds = [...userIds, ...newAdminIds];

    // Get all the courses created by the business or users
    let { count, rows } = await courseService.associateFreeCourses(
      combinedUserIds,
      businessIds
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        courses: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});

// course education level distinct
exports.get_level_course_of_education = useAsync(async (req, res, next) => {
  try {
    const find = await courseService.courseLevelOfEducationDistinct();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

// program start date
exports.program_start_date = useAsync(async (req, res, next) => {
  try {
    const find = await courseService.programStartDate();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

// program start date
exports.qualification_type = useAsync(async (req, res, next) => {
  try {
    const find = await courseService.qualificationType();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

// course level
exports.course_level = useAsync(async (req, res, next) => {
  try {
    const find = await courseService.courseLevel();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

// study pace
exports.study_pace = useAsync(async (req, res, next) => {
  try {
    const find = await courseService.courseStudyPace();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

// study mode
exports.study_mode = useAsync(async (req, res, next) => {
  try {
    const find = await courseService.courseStudyMode();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

// course lang
exports.course_lang = useAsync(async (req, res, next) => {
  try {
    const find = await courseService.courseLang();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

// course sub title
exports.course_subtitle = useAsync(async (req, res, next) => {
  try {
    const find = await courseService.courseSubTitle();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

// course program type
exports.course_program_type = useAsync(async (req, res, next) => {
  try {
    const find = await courseService.courseProgramType();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

// course program ranking
exports.course_program_ranking = useAsync(async (req, res, next) => {
  try {
    const find = await courseService.courseProgramRanking();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

// course filter combo
exports.course_attributes_filter = useAsync(async (req, res, next) => {
  try {
    console.log("here you are ");
    const find = await courseService.getAllDistinctAttributes();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});
