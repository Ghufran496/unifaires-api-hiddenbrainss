"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const Section = require("./section");
class SectionResource extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
SectionResource.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    lectureId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    mediaUri: {
      type: DataTypes.TEXT,
    },
    meta: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "sectionresource",
  }
);

Section.hasMany(SectionResource, {
  foreignKey: {
    allowNull: false,
  },
});
SectionResource.belongsTo(Section);

module.exports = SectionResource;
