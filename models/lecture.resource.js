const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const Lecture = require("./lecture");

class LectureResource extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
LectureResource.init(
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
    mediaUri: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
    meta: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "lectureresource",
  }
);

Lecture.hasMany(LectureResource, {
  foreignKey: {
    allowNull: false,
  },
});
LectureResource.belongsTo(Lecture);

module.exports = LectureResource;
