// services
const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const courseAnnouncementServices = require("../services/course.announcement.services");

const courseServices = require("../services/course/course.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await courseAnnouncementServices.all();

    return res.status(200).json(JParser("ok-response", true, all));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    // validate course

    const { courseId } = req.body;

    const isCourse = await courseServices.findOne(courseId);

    if (!isCourse) {
      return res.status(404).json(JParser("course not found", false, null));
    }

    const create = await courseAnnouncementServices.store(req);

    if (create) {
      return res.status(201).json(JParser("ok-response", true, create));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_course_announcements = useAsync(async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const isCourse = await courseServices.findOne(courseId);

    if (!isCourse) {
      return res.status(404).json(JParser("course not found", false, null));
    }

    const find = await courseAnnouncementServices.findAllBy({
      courseId,
    });

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});
exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAnnouncement = await courseAnnouncementServices.findOne(id);

    if (!isAnnouncement) {
      return res.status(404).json(JParser("invalid annoucement", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, isAnnouncement));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAnnouncement = await courseAnnouncementServices.findOne(id);

    if (!isAnnouncement) {
      return res.status(404).json(JParser("invalid annoucement", false, null));
    }

    const update = await courseAnnouncementServices.update(id, req);

    if (update) {
      const find = await courseAnnouncementServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAnnouncement = await courseAnnouncementServices.findOne(id);

    if (!isAnnouncement) {
      return res.status(404).json(JParser("invalid annoucement", false, null));
    }

    const destroy = await courseAnnouncementServices.destroy(id, req);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});
