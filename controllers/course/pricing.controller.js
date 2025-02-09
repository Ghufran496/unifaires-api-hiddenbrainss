const pricingServices = require("../../services/course/pricing.services");
const courseServices = require("../../services/course/course.services");
const { useAsync } = require("../../core");
const { JParser } = require("../../core/core.utils");

exports.index = useAsync(async (req, res, next) => {
  try {
    const pricing = await pricingServices.all();

    return res.status(200).json(JParser("ok-response", true, pricing));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    // check the courseid first
    const { courseId } = req.body;
    const isCourse = await courseServices.findOne(courseId);

    if (!isCourse) {
      return res.status(404).json(JParser("invalid course id", false, null));
    }

    const find = await pricingServices.getCoursePricingById(courseId);

    if (!find) {
      const pricing = await pricingServices.store(req);

      if (pricing && req.body.type !== "free") {
        // activate the course

        updateCourseStatus = await courseServices.update(isCourse.id, {
          body: {
            status: "active",
          },
        });
      }

      return res.status(201).json(JParser("pricing created", true, pricing));
    } else {
      const update = await pricingServices.update(find.id, req);

      if (update) {
        // get the updated pricing
        const pricing = await pricingServices.findBy({ courseId });

        return res.status(200).json(JParser("pricing updated", true, pricing));
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const pricing = await pricingServices.findOne(id);

    if (!pricing) {
      return res
        .status(404)
        .json(JParser("pricing does not exist", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, pricing));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const pricing = await pricingServices.findOne(id);

    if (!pricing) {
      return res
        .status(404)
        .json(JParser("pricing does not exist", false, null));
    }

    const update = await pricingServices.update(id, req);

    if (update) {
      // get the updated pricing
      const pricing = await pricingServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, pricing));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const pricing = await pricingServices.findOne(id);

    if (!pricing) {
      return res
        .status(404)
        .json(JParser("pricing does not exist", false, null));
    }

    const destroy = await pricingServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});
