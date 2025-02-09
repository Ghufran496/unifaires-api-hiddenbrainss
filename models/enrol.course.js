const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const Course = require("./course");
const User = require("./user");
const Business = require("./business");

class EnrolCourse extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
}
EnrolCourse.init(
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

    businessId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    courseId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    paymentId: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    paymentPlatform: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "enrolcourse",
  }
);

Course.hasMany(EnrolCourse, {
  foreignKey: {
    allowNull: false,
  },
});
EnrolCourse.belongsTo(Course);

EnrolCourse.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

EnrolCourse.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

EnrolCourse.addHook("beforeValidate", (EnrolCourse, options) => {
  // this if statment will not work for transactional operation
  if (EnrolCourse.isNewRecord) {
    if (!EnrolCourse.userId && !EnrolCourse.businessId) {
      throw new Error("Either userId or businessId must be provided.");
    }
    if (EnrolCourse.userId && EnrolCourse.businessId) {
      throw new Error(
        "Both userId and businessId cannot be provided at the same time."
      );
    }
  }
});

module.exports = EnrolCourse;
