const sequelize = require("./../database");

const { DataTypes, Model } = require("sequelize");

const { User, Business, JobCategory } = require("./");
const Skills = require("./skills");
const JobsPaymentType = require("./jobs.payment.type");
const JobsSkills = require("./job.skills");

const slugify = require("slugify");
const ndigit = require("n-digit-token");

class Jobs extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */
}

Jobs.init(
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
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    referenceNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salary: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },

    organizationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aboutOrganization: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mediaUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isUnifaires: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    contact: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    externalUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    externalEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    experienceLevel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employmentBenefits: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    workingStyle: {
      type: DataTypes.ENUM("Remote", "Onsite", "Hybrid"),
      allowNull: true,
    },
    appDeadlineType: {
      type: DataTypes.ENUM("Anytime", "Fixed"),
      allowNull: true,
    },

    levelOfEducation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    language: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    deadlineEnd: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
    deadline: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "opened",
        "archive",
        "deactivate",
        "interviewing",
        "hired",
        "closed",
        "pending"
      ),
      defaultValue: "pending",
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
    modelName: "jobs",
  }
);

Jobs.belongsTo(JobCategory, {
  foreignKey: "jobcategoryId",
  allowNull: false,
});

JobCategory.hasMany(Jobs);

JobsPaymentType.hasMany(Jobs, {
  foreignKey: {
    allowNull: true,
  },
});
Jobs.belongsTo(JobsPaymentType);

Jobs.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Jobs.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

Jobs.belongsToMany(Skills, {
  through: JobsSkills,
  foreignKey: "jobId",
  otherKey: "skillId",
  as: "skills",
});

Skills.belongsToMany(Jobs, {
  through: JobsSkills,
  foreignKey: "skillId",
  otherKey: "jobId",
  as: "jobs",
});

Jobs.addHook("beforeValidate", async (job, options) => {
  if (job.title) {
    let slug = slugify(job.title, { lower: true });

    // Check if slug already exists
    const token = ndigit.gen(6);

    while (true) {
      const isSlug = await Jobs.findOne({ where: { slug } });
      if (!isSlug) break;

      slug = `${slug}-${token}`;
    }

    job.slug = slug;
  }

  // if (!job.userId && !job.businessId) {
  //   throw new Error("Either userId or businessId must be provided.");
  // }
  // if (job.userId && job.businessId) {
  //   throw new Error(
  //     "Both userId and businessId cannot be provided at the same time."
  //   );
  // }
});

module.exports = Jobs;
