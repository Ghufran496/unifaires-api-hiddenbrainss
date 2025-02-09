const sectionServices = require("../../services/course/section.services");
const courseServices = require("../../services/course/course.services");
const { useAsync } = require("../../core");
const { JParser } = require("../../core/core.utils");

exports.index = useAsync(async (req, res, next) => {
  try {
    const section = await sectionServices.getAllSection();

    if (section) {
      return res.status(200).json(JParser("fetch", true, section));
    } else {
      return res.status(200).json(JParser("no section", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const isCourse = await courseServices.findOne(courseId);

    if (isCourse) {
      // store the course
      const section = await sectionServices.storeSection(req);

      if (section) {
        return res.status(201).json(JParser("section created", true, section));
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

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const section = await sectionServices.getAllSectionById(id);

    if (section) {
      return res.status(200).json(JParser("fetch successfully", true, section));
    } else {
      return res.status(404).json(JParser("course does not exist"));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isSection = await sectionServices.getAllSectionById(id);

    if (isSection) {
      const updateSection = await sectionServices.updateSection(id, req);

      if (updateSection) {
        const section = await sectionServices.getAllSectionById(id);

        return res.status(200).json(JParser("section updated", true, section));
      }
    } else {
      return res.status(404).json(JParser("course does not exist"));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteSection = await sectionServices.deleteSection(id);

    if (deleteSection) {
      return res
        .status(204)
        .json(JParser("section deleted successfully", true, null));
    } else {
      return res.status(404).json(JParser("course does not exist"));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_course_id = useAsync(async (req, res, next) => {
  try {
    // check the course id
    const { courseId: id } = req.params;

    const isCourse = await courseServices.findOne(id);

    console.log(isCourse, "is course");
    if (isCourse) {
      // get all the section under ther course

      const sections = await sectionServices.getAllCourseSection(id);

      if (sections) {
        return res
          .status(200)
          .json(JParser("section fetch successfully", true, sections));
      } else {
        return res.status(400).json(JParser("something went wrong"));
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
