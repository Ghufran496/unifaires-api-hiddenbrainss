const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../database");

// const { User, Business } = require("./index");

const User = require("./user");
const Business = require("./business");
const Category = require("./category");
const Skills = require("./skills");
const CourseSkills = require("./course.skills");

const slugify = require("slugify");
const ndigit = require("n-digit-token");

class Course extends Model {}

Course.init(
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
    meta: {
      type: DataTypes.TEXT,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    image: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
    video: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
    organizationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    aboutOrganization: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    requirement: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    target: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    welcomeMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    congratulationMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "archive", "deactivate", "pending"),
      defaultValue: "active",
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    businessId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    subtitleLanguage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    programStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    applicationFees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    isAssociateFree: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    programType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    studyPace: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    studyMode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    programRanking: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    applicationDeadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    levelsOfEducation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    qualificationType: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    externalUrl: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },

    isExternal: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    scholarshipUrl: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
    isScholarship: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    approveUserId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "course",
  }
);

Course.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  allowNull: true,
});

Course.belongsTo(Category);
Category.hasMany(Course);

Course.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
  allowNull: true,
});

Course.belongsToMany(Skills, {
  through: CourseSkills,
  foreignKey: "courseId",
  otherKey: "skillId",
  as: "skills",
});

Skills.belongsToMany(Course, {
  through: CourseSkills,
  foreignKey: "skillId",
  otherKey: "courseId",
  as: "courses",
});

Course.addHook("beforeValidate", async (course, options) => {
  if (course.title) {
    let slug = slugify(course.title, { lower: true });

    // Check if slug already exists
    const token = ndigit.gen(6);

    while (true) {
      const isCourse = await Course.findOne({ where: { slug } });
      if (!isCourse) break;

      slug = `${slug}-${token}`;
    }

    course.slug = slug;
  }

  // if (!course.userId && !course.businessId) {
  //   throw new Error("Either userId or businessId must be provided.");
  // }

  if (course.userId && course.businessId) {
    throw new Error(
      "Both userId and businessId cannot be provided at the same time."
    );
  }
});

module.exports = Course;
