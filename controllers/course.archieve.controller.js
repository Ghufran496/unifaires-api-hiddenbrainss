const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const { calculatePagination } = require("../helpers/paginate.helper");

const courseArchieveServices = require("../services/course.archieve.services");
const courseServices = require("../services/course/course.services");
const enrolServices = require("../services/course/enrol.courses.services");
const sequelize = require("../database");

exports.index = useAsync(async (req, res, next) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 20;
    const offset = req.query.page ? +req.query.page : 0;

    let { count, rows } = await courseArchieveServices.all(req, offset, limit);

    return res.status(200).send(
      JParser("fetch successfully", true, {
        archieves: rows,
        current_page: offset + 1,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    // check if course
    const { courseId } = req.body;

    const isCourse = await courseServices.findOne(courseId);
    // check if course has already been added by the user

    if (!isCourse) {
      return res.status(404).json(JParser("course not found", false, null));
    }

    let idField = null;

    if (req.user) {
      idField = req.user.id;
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business.id;

      idField = req.business.id;
    }

    if (idField) {
      const columnToUse = req.user ? "userId" : "businessId";

      const query = { [columnToUse]: idField };

      const isArchieved = await courseArchieveServices.getUserArchieved(
        query,
        courseId
      );

      if (!isArchieved) {
        const create = await courseArchieveServices.store(req);

        if (create) {
          return res
            .status(201)
            .json(JParser("archieve created successfully", true, create));
        }
      } else {
        return res
          .status(400)
          .json(JParser("archieve already exist", false, null));
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.enrol_store = useAsync(async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    // check if course
    const { courseId } = req.body;
    const { id: userId } = req.user;

    const isCourse = await courseServices.findOne(courseId);
    // check if course has already been added by the user

    if (!isCourse) {
      await t.rollback();

      return res.status(404).json(JParser("course not found", false, null));
    }

    // check if user enrol for this course
    const isEnrol = await enrolServices.findBy({ userId, courseId });

    if (!isEnrol) {
      await t.rollback();

      return res.status(404).json(JParser("not enrol course", false, null));
    }

    const find = await courseArchieveServices.findBy({
      userId,
      courseId,
    });

    if (find) {
      await t.rollback();

      return res.status(409).json(JParser("already exist", false, null));
    }

    req.body.userId = userId;

    const create = await courseArchieveServices.store(req, { transaction: t });

    if (create) {
      // remove the course from enrol tables

      const update = await enrolServices.update(
        isEnrol.id,
        {
          body: { status: false, userId },
        },
        { transaction: t }
      );

      await t.commit();
      return res.status(201).json(JParser("ok-response", true, create));
    }

    await t.rollback();
  } catch (error) {
    await t.rollback();
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await courseArchieveServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await courseArchieveServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const update = await courseArchieveServices.update(id, req);

    if (update) {
      const find = await courseArchieveServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.enrol_destroy = useAsync(async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    const find = await courseArchieveServices.findOne(id);

    if (!find) {
      await t.rollback();
      return res.status(404).json(JParser("not found", false, null));
    }

    const destroy = await courseArchieveServices.destroy(id, {
      transaction: t,
    });

    if (destroy) {
      // find the enrol of this user where the course id if the find id
      const enrol = await enrolServices.findBy({
        userId: req.user.id,
        courseId: find.courseId,
      });

      if (enrol) {
        await enrolServices.update(
          enrol.id,
          {
            body: { status: true, userId: req.user.id },
          },
          { transaction: t }
        );
      }

      await t.commit();
      return res.status(204).json(JParser("ok-response", true, null));
    }

    await t.rollback();
  } catch (error) {
    await t.rollback();
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await courseArchieveServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const destroy = await courseArchieveServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_archieve = useAsync(async (req, res, next) => {
  try {
    let idField = null;

    if (req.user) {
      idField = req.user.id;
    } else if (req.business) {
      idField = req.business.id;
    }

    if (idField) {
      const columnToUse = req.user ? "userId" : "businessId";

      const query = { [columnToUse]: idField };

      const { limit, page, offset } = calculatePagination(req);

      let { count, rows } = await courseArchieveServices.getUserAchieves(
        req,
        offset,
        limit,
        query
      );

      if (rows) {
        return res.status(200).send(
          JParser("fetch successfully", true, {
            archieves: rows,
            current_page: page,
            limit,
            count,
            pages: Math.ceil(count / limit),
          })
        );
      } else {
        return res.status(200).send(JParser("no archieve found", true, null));
      }
    }
  } catch (error) {
    next(error);
  }
});
