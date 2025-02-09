const coursesReviewsServices = require("../services/course.reviews.services");
const courseServices = require("../services/course/course.services");

const { JParser } = require("../core/core.utils");
const { useAsync } = require("../core");

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await coursesReviewsServices.all();

    return res.status(200).json(JParser("ok-response", true, all));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    if (req.user) {
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business.id;
    }
    const store = await coursesReviewsServices.store(req);

    return res.status(201).json(JParser("ok-response", true, store));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await coursesReviewsServices.findOne(id);

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

    const find = await coursesReviewsServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const update = await coursesReviewsServices.update(id, req);

    if (update) {
      const find = await coursesReviewsServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await coursesReviewsServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const destroy = await coursesReviewsServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.course_review = useAsync(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await courseServices.findOne(courseId);

    if (!course) {
      return res.status(404).json(JParser("invalid course", false, null));
    }

    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const offset = req.query.page ? (parseInt(req.query.page) - 1) * limit : 0;

    const { count, reviews, ratingsCount } =
      await coursesReviewsServices.courseReviews(courseId, req, offset, limit);

    return res.status(200).json(
      JParser("ok-response", true, {
        reviews,
        ratingsCount,
        current_page: offset / limit + 1,
        limit,
        total_reviews: count,
        total_pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});
