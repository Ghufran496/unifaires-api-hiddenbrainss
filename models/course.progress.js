const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const Course = require("./course");
const Section = require("./section");
const Lecture = require("./lecture");
const Quiz = require("./quiz");
const LectureContent = require("./lecture.content");
const LectureArticle = require("./lecture.article");
const LectureQuiz = require("./lecture.quiz");
const QuizQuestion = require("./quiz.question");
const User = require("./user");

class CourseProgress extends Model {}

CourseProgress.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    sectionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    lectureId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    quizId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    lectureContentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    lectureResourceId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    lectureArticleId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    lectureQuizId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    quizQuestionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    progress: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "courseprogress",
    tableName: "courseprogress",
  }
);

User.hasMany(CourseProgress);
CourseProgress.belongsTo(User, { foreignKey: "userId" });

Course.hasMany(CourseProgress, { as: "courseProgress" });
CourseProgress.belongsTo(Course, { foreignKey: "courseId" });

Section.hasMany(CourseProgress, { as: "sectionProgress" });
CourseProgress.belongsTo(Section, { foreignKey: "sectionId" });

Lecture.hasMany(CourseProgress, { as: "lectureProgress" });
CourseProgress.belongsTo(Lecture, { foreignKey: "lectureId" });

Quiz.hasMany(CourseProgress, { as: "quizProgress" });
CourseProgress.belongsTo(Quiz, { foreignKey: "quizId" });

LectureContent.hasMany(CourseProgress, { as: "lectureContentProgress" });
CourseProgress.belongsTo(LectureContent, { foreignKey: "lectureContentId" });

LectureArticle.hasMany(CourseProgress, { as: "lectureArticleProgress" });
CourseProgress.belongsTo(LectureArticle, { foreignKey: "lectureArticleId" });

LectureQuiz.hasMany(CourseProgress, { as: "lectureQuizProgress" });
CourseProgress.belongsTo(LectureQuiz, { foreignKey: "lectureQuizId" });

QuizQuestion.hasMany(CourseProgress, { as: "quizQuestionProgress" });
CourseProgress.belongsTo(QuizQuestion, { foreignKey: "quizQuestionId" });

module.exports = CourseProgress;
