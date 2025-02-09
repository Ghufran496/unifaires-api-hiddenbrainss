const User = require("./user");
const Business = require("./business");
const Course = require("./course");

const sequelize = require("./../database");
const { DataTypes, Model } = require("sequelize");

class CoursesReviews extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

CoursesReviews.init(
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
    courseId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    review: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
    rating: {
      type: DataTypes.ENUM,
      values: [1, 2, 3, 4, 5],
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "coursesreviews",
    tableName: "coursesreviews",
  }
);

CoursesReviews.belongsTo(Course, { allowNull: true });
Course.hasMany(CoursesReviews);

CoursesReviews.belongsTo(User, { allowNull: true });
User.hasMany(CoursesReviews);

CoursesReviews.belongsTo(Business, { allowNull: true });

CoursesReviews.addHook("beforeValidate", (coursesreviews, options) => {
  // only on a new
  if (
    !coursesreviews.courseId &&
    !coursesreviews.businessId &&
    !coursesreviews.userId
  ) {
    throw new Error(
      "At least one identifier (courseId, businessId, or userId) must be provided."
    );
  }
});

module.exports = CoursesReviews;
