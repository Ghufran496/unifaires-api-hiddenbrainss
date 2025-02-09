const testServices = require("../../services/course/test.services");
const courseServices = require("../../services/course/course.services");
const { useAsync } = require("../../core");
const { JParser } = require("../../core/core.utils");

exports.index = useAsync(async (req, res, next) => {
  try {
    const test = await testServices.getAllTest();

    if (test) {
      return res.status(200).json(JParser("test fetch", true, test));
    } else {
      return res.status(200).json(JParser("something went wrong", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { courseId } = req.body;

    const isCourse = await courseServices.getCourseById(courseId);

    if (isCourse) {
      // add test to course
      const test = await testServices.storeTest(req);

      if (test) {
        return res.status(201).json(JParser("test created", true, test));
      } else {
        return res
          .status(200)
          .json(JParser("something went wrong", false, null));
      }
    } else {
      return res.status(404).json(JParser("invalid course id", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const test = await testServices.getAllTestById(id);

    if (test) {
      return res.status(200).json(JParser("test fetch", true, test));
    } else {
      return res.status(200).json(JParser("no test", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const updateTest = await testServices.updateTest(id, req);

    if (updateTest) {
      return res.status(200).json(JParser("test updated", true, updateTest));
    } else {
      return res.status(200).json(JParser("something went wrong"));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteTest = await testServices.deleteTest(id);

    if (deleteTest) {
      return res.status(204).json(JParser("test deleted", true, null));
    } else {
      return res.status(400).json(JParser("something went wrong", false, null));
    }
  } catch (error) {
    next(error);
  }
});
