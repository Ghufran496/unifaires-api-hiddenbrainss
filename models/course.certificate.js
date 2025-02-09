const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");

const Course = require("./course");

class CourseCertificate extends Model {}

CourseCertificate.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    certificateType: {
      type: DataTypes.ENUM("recommendation", "certificate"),
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    congratulationText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "coursecertificates",
    tableName: "coursecertificates",
  }
);
Course.hasOne(CourseCertificate);
CourseCertificate.belongsTo(Course);

module.exports = CourseCertificate;
