const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const courseProgressServices = require("../services/course.progress.services");
const lectureServices = require("../services/course/lecture.services");
const sectionServices = require("../services/course/section.services");
const lectureContentServices = require("../services/course/lecture.content.services");
const { Op } = require("sequelize");

const lectureArticleServices = require("../services/lecture.article.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await courseProgressServices.all();

    return res.status(200).json(JParser("ok-response!", true, all));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const {
      lectureContentId,
      lectureId,
      lectureArticleId,
      lectureQuizId,
      quizQuestionId,
      progress,
    } = req.body;

    const { id: userId } = req.user;
    const whereCondition = { userId };

    if (lectureContentId) {
      // varify if is a valid course id
      const isContent = await lectureContentServices.findOne(lectureContentId);

      if (!isContent) {
        return res
          .status(404)
          .json(JParser("lecture content not found ", false, null));
      }

      whereCondition.lectureContentId = lectureContentId;
    }

    if (lectureArticleId) {
      const isArticle = await lectureArticleServices.findOne(lectureArticleId);

      if (!isArticle) {
        return res
          .status(404)
          .json(JParser("lecture article not found ", false, null));
      }

      whereCondition.lectureArticleId = lectureArticleId;
    }

    if (lectureId) {
      const isLecture = await lectureServices.findOne(lectureId);

      if (!isLecture) {
        return res
          .status(404)
          .json(JParser(" lecture not found ", false, null));
      }

      whereCondition.lectureId = lectureId;
    }

    const existingProgress = await courseProgressServices.findBy(
      whereCondition
    );

    if (existingProgress) {
      await courseProgressServices.update(existingProgress.id, {
        body: { progress },
      });
    } else {
      await courseProgressServices.store({
        body: { ...whereCondition, progress },
      });
    }

    if (lectureContentId) {
      const lectureContent = await lectureContentServices.findOne(
        lectureContentId
      );
      const { lectureId } = lectureContent;

      const lectureProgress = await courseProgressServices.findBy({
        userId,
        lectureId,
      });

      if (lectureProgress) {
        await courseProgressServices.update(lectureProgress.id, {
          body: { progress },
        });
      } else {
        await courseProgressServices.store({
          body: { userId, progress, lectureId },
        });
      }

      const { sectionId } = await lectureServices.findOne(lectureId);

      const lectures = await lectureServices.findAllBy({
        sectionId,
      });

      const lecturesIds = lectures.map((lecture) => lecture.id);

      const lecturesIdsProgress = await courseProgressServices.findAllBy({
        lectureId: { [Op.in]: lecturesIds },
        userId,
      });

      // check if section progress is created

      const totalProgress = lecturesIdsProgress.reduce(
        (sum, progressRecord) => sum + progressRecord.progress,
        0
      );
      const averageProgress = totalProgress / lecturesIds.length;

      const sectionProgress = await courseProgressServices.findBy({
        userId,
        sectionId,
      });

      if (sectionProgress) {
        await courseProgressServices.update(sectionProgress.id, {
          body: { progress: averageProgress },
        });
      } else {
        await courseProgressServices.store({
          body: { userId, progress: averageProgress, sectionId },
        });
      }

      // this is course progress part

      const { courseId } = await sectionServices.findOne(sectionId);

      const sections = await sectionServices.findAllBy({
        courseId,
      });

      const sectionsIds = sections.map((section) => section.id);

      const sectionsIdsProgress = await courseProgressServices.findAllBy({
        sectionId: { [Op.in]: sectionsIds },
        userId,
      });

      // check if section progress is created

      const totalSectionProgress = sectionsIdsProgress.reduce(
        (sum, progressRecord) => sum + progressRecord.progress,
        0
      );
      const averageSectionProgress = totalSectionProgress / lecturesIds.length;

      const courseProgress = await courseProgressServices.findBy({
        userId,
        courseId,
      });

      if (courseProgress) {
        await courseProgressServices.update(courseProgress.id, {
          body: { progress: averageProgress },
        });
      } else {
        await courseProgressServices.store({
          body: { userId, progress: averageSectionProgress, courseId },
        });
      }
      // get all the sections id on the section
      return res.status(200).json(
        JParser("created/updated successfully", true, {
          sectionProgres: averageProgress,
          courseProgress: averageSectionProgress,
        })
      );
    } else if (lectureArticleId) {
      const lectureArticle = await lectureArticleServices.findOne(
        lectureArticleId
      );
      const { lectureId } = lectureArticle;

      const lectureProgress = await courseProgressServices.findBy({
        userId,
        lectureId,
      });

      if (lectureProgress) {
        await courseProgressServices.update(lectureProgress.id, {
          body: { progress },
        });
      } else {
        await courseProgressServices.store({
          body: { userId, progress, lectureId },
        });
      }

      const { sectionId } = await lectureServices.findOne(lectureId);

      const lectures = await lectureServices.findAllBy({
        sectionId,
      });

      const lecturesIds = lectures.map((lecture) => lecture.id);

      const lecturesIdsProgress = await courseProgressServices.findAllBy({
        lectureId: { [Op.in]: lecturesIds },
        userId,
      });

      // check if section progress is created

      const totalProgress = lecturesIdsProgress.reduce(
        (sum, progressRecord) => sum + progressRecord.progress,
        0
      );
      const averageProgress = totalProgress / lecturesIds.length;

      const sectionProgress = await courseProgressServices.findBy({
        userId,
        sectionId,
      });

      if (sectionProgress) {
        await courseProgressServices.update(sectionProgress.id, {
          body: { progress: averageProgress },
        });
      } else {
        await courseProgressServices.store({
          body: { userId, progress: averageProgress, sectionId },
        });
      }

      // this is course progress part

      const { courseId } = await sectionServices.findOne(sectionId);

      const sections = await sectionServices.findAllBy({
        courseId,
      });

      const sectionsIds = sections.map((section) => section.id);

      const sectionsIdsProgress = await courseProgressServices.findAllBy({
        sectionId: { [Op.in]: sectionsIds },
        userId,
      });

      // check if section progress is created

      const totalSectionProgress = sectionsIdsProgress.reduce(
        (sum, progressRecord) => sum + progressRecord.progress,
        0
      );
      const averageSectionProgress = totalSectionProgress / lecturesIds.length;

      const courseProgress = await courseProgressServices.findBy({
        userId,
        courseId,
      });

      if (courseProgress) {
        await courseProgressServices.update(courseProgress.id, {
          body: { progress: averageProgress },
        });
      } else {
        await courseProgressServices.store({
          body: { userId, progress: averageSectionProgress, courseId },
        });
      }
      // get all the sections id on the section
      return res.status(200).json(
        JParser("created/updated successfully", true, {
          sectionProgres: averageProgress,
          courseProgress: averageSectionProgress,
        })
      );
    } else if (lectureId) {
      const lectureProgress = await courseProgressServices.findBy({
        userId,
        lectureId,
      });

      if (lectureProgress) {
        await courseProgressServices.update(lectureProgress.id, {
          body: { progress },
        });
      } else {
        await courseProgressServices.store({
          body: { userId, progress, lectureId },
        });
      }

      const { sectionId } = await lectureServices.findOne(lectureId);

      const lectures = await lectureServices.findAllBy({
        sectionId,
      });

      const lecturesIds = lectures.map((lecture) => lecture.id);

      const lecturesIdsProgress = await courseProgressServices.findAllBy({
        lectureId: { [Op.in]: lecturesIds },
        userId,
      });

      // check if section progress is created

      const totalProgress = lecturesIdsProgress.reduce(
        (sum, progressRecord) => sum + progressRecord.progress,
        0
      );
      const averageProgress = totalProgress / lecturesIds.length;

      const sectionProgress = await courseProgressServices.findBy({
        userId,
        sectionId,
      });

      if (sectionProgress) {
        await courseProgressServices.update(sectionProgress.id, {
          body: { progress: averageProgress },
        });
      } else {
        await courseProgressServices.store({
          body: { userId, progress: averageProgress, sectionId },
        });
      }

      // this is course progress part

      const { courseId } = await sectionServices.findOne(sectionId);

      const sections = await sectionServices.findAllBy({
        courseId,
      });

      const sectionsIds = sections.map((section) => section.id);

      const sectionsIdsProgress = await courseProgressServices.findAllBy({
        sectionId: { [Op.in]: sectionsIds },
        userId,
      });

      // check if section progress is created

      const totalSectionProgress = sectionsIdsProgress.reduce(
        (sum, progressRecord) => sum + progressRecord.progress,
        0
      );
      const averageSectionProgress = totalSectionProgress / lecturesIds.length;

      const courseProgress = await courseProgressServices.findBy({
        userId,
        courseId,
      });

      if (courseProgress) {
        await courseProgressServices.update(courseProgress.id, {
          body: { progress: averageProgress },
        });
      } else {
        await courseProgressServices.store({
          body: { userId, progress: averageSectionProgress, courseId },
        });
      }
      // get all the sections id on the section
      return res.status(200).json(
        JParser("created/updated successfully", true, {
          sectionProgres: averageProgress,
          courseProgress: averageSectionProgress,
        })
      );
    }

    return res
      .status(200)
      .json(JParser("created/updated successfully", true, existingProgress));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id: courseId } = req.params;

    const { id: userId } = req.user;

    const find = await courseProgressServices.findBy({ courseId, userId });

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

    const find = await courseProgressServices.findOne(id);

    if (find) {
      const update = await courseProgressServices.update(id, req);

      if (update) {
        return res
          .status(200)
          .json(JParser("updated successfully", true, find));
      }
    } else {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await courseProgressServices.findOne(id);

    if (find) {
      const destroy = await courseProgressServices.destroy(id);

      if (destroy) {
        return res
          .status(204)
          .json(JParser("deleted successfully", true, null));
      }
    } else {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy_section = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await courseProgressServices.findOne(id);

    if (find) {
      // get all the dependencies of this sections

      const destroy = await courseProgressServices.destroy(id);

      if (destroy) {
        return res.status(204).json(JParser("ok-response", true, null));
      }
    } else {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});
