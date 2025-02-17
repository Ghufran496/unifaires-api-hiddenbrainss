const sequelize = require("./../database");
const { DataTypes, Model } = require("sequelize");

const Role = require("./role");
const UsersSkills = require("./users.skills");
const Skills = require("./skills");

const purchasedCourse = require("./PurchasedCourse");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    othername: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      unique: true,
      allowNull: false,
    },

    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },

    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    dateOfBirth: {
      allowNull: true,
      type: DataTypes.DATEONLY,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "us",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    whoIs: {
      type: DataTypes.UUID,
      defaultValue: 0,
    },

    isEmailVerify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    aboutMe: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
    personality: {
      type: DataTypes.TEXT({ length: "long" }),
      allowNull: true,
    },
    estimatedYearlySalary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentProfessionalRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experienceLevel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    yearsOfExperience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ["password", "apiKey"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
      withPassword: {
        attributes: { include: ["apiKey"] },
      },
    },
    sequelize,
    modelName: "user",
  }
);

Role.hasMany(User);
User.belongsTo(Role);

User.associate = (models) => {
  User.hasMany(purchasedCourse, {
    foreignKey: "userId",
    as: "purchasedCourses",
  });
};

// bring the skills here
User.belongsToMany(Skills, {
  through: UsersSkills,
  foreignKey: "userId",
  otherKey: "skillId",
  as: "skills",
});

module.exports = User;
