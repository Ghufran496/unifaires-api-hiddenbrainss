const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./user");
const Course = require("./course");

class Question extends Model {}

Question.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "question",
  }
);

// Associations
User.hasMany(Question);
Question.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Course.hasMany(Question);
Question.belongsTo(Course, {
  foreignKey: "courseId",
  as: "course",
});

class Answer extends Model {}

Answer.init(
  {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "answer",
  }
);

User.hasMany(Answer);
Answer.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Question.hasMany(Answer);
Answer.belongsTo(Question);

// You can add additional methods or hooks as needed

module.exports = { Question, Answer };
