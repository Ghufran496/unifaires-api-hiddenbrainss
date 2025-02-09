const instructorServices = require("../../services/course/instructor.services");
const courseServices = require("../../services/course/course.services");
const { useAsync } = require("./../../core");
const { JParser } = require("../../core/core.utils");

exports.index = useAsync(async (req, res, next) => {
  try {
    const instructor = await instructorServices.all();

    return res.status(200).json(JParser("ok-respnose", true, instructor));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    // check the course exisitense
    const { courseId: id } = req.body;

    const isCourse = await courseServices.findOne(id);

    if (!isCourse) {
      return res.status(400).json(JParser("course not found", false, null));
    }

    const create = await instructorServices.store(req);

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
    const instructor = await instructorServices.findOne(id);

    if (!instructor) {
      return res.status(400).json(JParser("not found ", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, instructor));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // verify the instructors

    const find = await instructorServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const update = await instructorServices.update(id, req);

    if (update) {
      return res.status(200).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await instructorServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const destroy = await instructorServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.course_instructor = useAsync(async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const instructor = await instructorServices.getCourseInstructor(courseId);

    if (instructor) {
      return res.status(200).json(JParser("ok-response", true, instructor));
    }
  } catch (error) {
    next(error);
  }
});
