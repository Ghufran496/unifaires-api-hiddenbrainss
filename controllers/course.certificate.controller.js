const { useAsync } = require("../core");
const courseCertificateServices = require("../services/course.certificate.services");
const courseServices = require("../services/course/course.services");

const { JParser } = require("../core").utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await courseCertificateServices.all();

    return res.status(200).json(JParser("ok-response", true, all));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { courseId } = req.body;

    // check if course is valid

    const isCourse = await courseServices.findOne(courseId);

    if (!isCourse) {
      return res.status(404).json(JParser("invalid course", false, null));
    }

    const create = await courseCertificateServices.store(req);

    return res.status(201).json(JParser("ok-response", true, create));
  } catch (error) {
    next(error);
  }
});

exports.get_course_certificate = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isCertificate = await courseCertificateServices.findBy({
      courseId: id,
    });

    return res.status(200).json(JParser("ok-response", true, isCertificate));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check if course is valid

    const isCourse = await courseCertificateServices.findOne(id);

    if (!isCourse) {
      return res.status(404).json(JParser("invalid course", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, isCourse));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check if course is valid

    const isCertificate = await courseCertificateServices.findOne(id);

    if (!isCertificate) {
      return res.status(404).json(JParser("invalid id", false, null));
    }

    const update = await courseCertificateServices.update(
      isCertificate.id,
      req
    );

    if (update) {
      const find = await courseCertificateServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check if course is valid

    const isCertificate = await courseCertificateServices.findOne(id);

    if (!isCertificate) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const destroy = await courseCertificateServices.destroy(isCertificate.id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});
