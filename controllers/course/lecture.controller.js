const { useAsync } = require("../../core");
const { JParser } = require("../../core/core.utils");
const lectureServices = require("../../services/course/lecture.services");
const sectionServices = require("../../services/course/section.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const lectures = await lectureServices.all();

    if (lectures) {
      return res
        .status(200)
        .json(JParser("lectures fetch successfully", true, lectures));
    } else {
      return res.status(400).json(JParser("something went wrong", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    // validatte the section id

    // check if the same title already exist on the same sections
    const { title, sectionId } = req.body;

    const section = await sectionServices.findOne(sectionId);

    if (!section) {
      return res.status(400).json(JParser("invalid section ", true, null));
    } else {
      const isTitle = await lectureServices.findBy({ title, sectionId });

      if (!isTitle) {
        // store the lecture
        const lecture = await lectureServices.store(req);

        if (lecture) {
          return res
            .status(201)
            .json(JParser("lectures added successfully", true, lecture));
        }
      } else {
        return res
          .status(400)
          .json(
            JParser(
              "section of same title already exist on this course",
              false,
              null
            )
          );
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const lecture = await lectureServices.findOne(id);

    if (lecture) {
      return res
        .status(200)
        .json(JParser("lecture fetch successfully", true, lecture));
    } else {
      return res
        .status(404)
        .json(JParser("lecture does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check lecture available
    const isLecture = await lectureServices.findOne(id);

    if (isLecture) {
      // update lecture

      const updateLecture = await lectureServices.update(id, req);

      if (updateLecture) {
        const lecture = await lectureServices.findOne(id);
        return res
          .status(200)
          .json(JParser("lectures updated successfully", true, lecture));
      } else {
        return res
          .status(400)
          .json(JParser("something went wrong", true, null));
      }
    } else {
      return res
        .status(404)
        .json(JParser("lecture does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteLecture = await lectureServices.destroy(id);

    if (deleteLecture) {
      return res
        .status(204)
        .json(JParser("lecture deleted successfully", true, null));
    } else {
      return res.status(400).json(JParser("something went wrong", false, null));
    }
  } catch (error) {
    next(error);
  }
});

// content routes
