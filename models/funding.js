const sequelize = require("./../database");

const { DataTypes, Model } = require("sequelize");

const { User, Business, FundingCategory } = require("./");

const FundingPaymentType = require("./funding.payment.type");

const slugify = require("slugify");
const ndigit = require("n-digit-token");

class Fundings extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of DataTypes lifecycle.
   * The `models/index` file will call this method automatically.
   *
   */
}

Fundings.init(
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
    size: {
      type: DataTypes.DECIMAL(10, 2),
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

    language: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    organizationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    aboutOrganization: {
      type: DataTypes.TEXT,
    },

    mediaUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
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
      allowNull: true,
    },
    externalUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fundingPurpose: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "active",
        "archive",
        "deactivate",
        "interviewing",
        "awarded",
        "closed",
        "pending"
      ),
      defaultValue: "pending",
    },
    fundingcategoryId: {
      type: DataTypes.UUID,
      allowNull: false,
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
    modelName: "fundings",
    tableName: "fundings",
  }
);

Fundings.belongsTo(FundingCategory, {
  foreignKey: "fundingcategoryId",
  targetKey: "id",
  allowNull: false,
  as: "fundingCategory",
});

FundingCategory.hasMany(Fundings, {
  foreignKey: "fundingcategoryId",
});

FundingPaymentType.hasMany(Fundings, {
  foreignKey: {
    allowNull: true,
  },
});
Fundings.belongsTo(FundingPaymentType);

Fundings.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Fundings.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

Fundings.addHook("beforeValidate", async (funding, options) => {
  if (funding.title) {
    let slug = slugify(funding.title, { lower: true });

    // Check if slug already exists
    const token = ndigit.gen(6);

    while (true) {
      const isSlug = await Fundings.findOne({ where: { slug } });
      if (!isSlug) break;

      slug = `${slug}-${token}`;
    }

    funding.slug = slug;
  }

  // if (!funding.userId && !funding.businessId) {
  //   throw new Error("Either userId or businessId must be provided.");
  // }
  // if (funding.userId && funding.businessId) {
  //   throw new Error(
  //     "Both userId and businessId cannot be provided at the same time."
  //   );
  // }
});

module.exports = Fundings;
