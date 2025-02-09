const { JParser } = require("../../core/core.utils");
const assignmentServices = require("../../services/course/assignment.services");
const courseServices = require("../../services/course/course.services");
const { useAsync } = require("./../../core");

exports.index = useAsync(async (req, res, next) => {
  try {
    const assignment = await assignmentServices.all();

    return res.status(200).json(JParser("ok-response", true, assignment));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { instructionUri, questions, courseId } = req.body;

    // validate course id
    const isCourse = await courseServices.findOne(courseId);

    if (!isCourse) {
      return res.status(404).json(JParser("course not found", false, null));
    }

    req.body.questions = JSON.stringify(questions);
    req.body.instructionUri = JSON.stringify(instructionUri);

    const addAssignment = await assignmentServices.store(req);

    return res.status(201).json(JParser("ok-response", true, addAssignment));
  } catch (error) {
    next(error);
  }
});

exports.get_course_assignment = useAsync(async (req, res, next) => {
  try {
    const { courseId } = req.params;

    // validate the course

    const isCourse = await courseServices.findBy({ id: courseId });

    if (!isCourse) {
      return res.status(404).json(JParser("course not found", false, null));
    }

    const assignment = await assignmentServices.findAllBy({ courseId });

    return res.status(200).json(JParser("ok-response", true, assignment));
  } catch (error) {
    next(error);
  }
});
exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const assignment = await assignmentServices.findOne(id);

    if (!assignment) {
      return res.status(404).json(JParser("not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, assignment));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAssignment = await assignmentServices.findOne(id);

    if (!isAssignment) {
      // store the assignment
      return res.status(404).json(JParser("not found", false, null));
    }

    const update = await assignmentServices.update(isAssignment.id, req);

    if (update) {
      const assignment = await assignmentServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, assignment));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const destroy = await assignmentServices.destroy(id);

    if (!destroy) {
      return res.status(404).json(JParser("not found"));
    }

    return res.status(204).json(JParser("ok-response", true, null));
  } catch (error) {
    next(error);
  }
});
