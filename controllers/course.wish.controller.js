const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const { calculatePagination } = require("../helpers/paginate.helper");

const courseWishServices = require("../services/course.wish.services");
const courseServices = require("../services/course/course.services");

const courseEnrolServices = require("../services/course/enrol.courses.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const { limit, offset, page } = calculatePagination(req);
    let { count, rows } = await courseWishServices.all(req, offset, limit);

    return res.status(200).send(
      JParser("ok-response", true, {
        wishes: rows,
        current_page: page,
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
    const { courseId } = req.body;
    const { id: userId } = req.user;

    const isCourse = await courseServices.findOne(courseId);

    if (!isCourse) {
      return res.status(404).json(JParser("course not found", false, null));
    }

    const isEnrol = await courseEnrolServices.findBy({ userId, courseId });

    if (isEnrol) {
      return res
        .status(409)
        .json(JParser("already enrolled for course", false, null));
    }

    const isWished = await courseWishServices.findBy({ courseId, userId });

    if (isWished) {
      return res.status(409).json(JParser("wish already exist", false, null));
    }

    req.body.userId = userId;
    // Add the course to the wishlist
    const create = await courseWishServices.store(req);
    if (create) {
      return res.status(201).json(JParser("ok-response", true, create));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await courseWishServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    return res.status(200).json(JParser("wish fetch successfully", true, find));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const isWish = await courseWishServices.findOne(id);

    if (isWish) {
      const update = await courseWishServices.update(id, req);

      if (update) {
        const wish = await courseWishServices.findOne(id);
        return res
          .status(200)
          .json(JParser("wish updated successfully", true, wish));
      }
    } else {
      return res.status(404).json(JParser("wish does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const isWish = await courseWishServices.findOne(id);

    if (isWish) {
      const destroy = await courseWishServices.destroy(id);

      if (destroy) {
        return res
          .status(200)
          .json(JParser("wish deleted  successfully", true, null));
      }
    } else {
      return res.status(404).json(JParser("wish does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_wish = useAsync(async (req, res, next) => {
  try {
    const { limit, offset, page } = calculatePagination(req);

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

      let { count, rows } = await courseWishServices.getUsersWishes(
        req,
        offset,
        limit,
        query
      );

      return res.status(200).send(
        JParser("fetch successfully", true, {
          wishes: rows,
          current_page: page,
          limit,
          count,
          pages: Math.ceil(count / limit),
        })
      );
    }
  } catch (error) {
    next(error);
  }
});
