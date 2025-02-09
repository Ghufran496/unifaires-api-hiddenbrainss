"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");

const User = require("./user");
const Business = require("./business");
const Course = require("./course");

class Cart extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */
}

Cart.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "cart",
    tableName: "carts",
  }
);

Cart.belongsTo(User);
User.hasMany(Cart);

Cart.belongsTo(Course);
Course.hasMany(Cart);

module.exports = Cart;
