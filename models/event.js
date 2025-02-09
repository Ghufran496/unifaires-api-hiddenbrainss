"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");

const { User, Business } = require("./");
class Event extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
}
Event.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    businessId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    courseId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    freqencyTime: {
      type: DataTypes.INTEGER,
    },

    frequencyDay: {
      type: DataTypes.ENUM("once", "daily", "monthly", "yearly"),
      allowNull: false,
    },

    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    reminder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    endDate: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "event",
  }
);

Event.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Event.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

Event.addHook("beforeValidate", (Event, options) => {
  if (!Event.userId && !Event.businessId) {
    throw new Error("Either userId or businessId must be provided.");
  }
  if (Event.userId && Event.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = Event;
