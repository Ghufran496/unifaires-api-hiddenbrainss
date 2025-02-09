"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");
const Course = require("./course");

class Pricing extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
Pricing.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.UUID,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: ["free", "paid"],
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "pricing",
  }
);

Course.hasOne(Pricing, {
  foreignKey: {
    allowNull: false,
  },
});
Pricing.belongsTo(Course);

sequelize.sync();

module.exports = Pricing;
