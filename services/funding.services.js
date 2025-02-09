const { Funding, User, FundingCategory, FundingEnrol } = require("../models");
const { Op, Sequelize } = require("sequelize");
const { USER_ROLES } = require("../helpers/user.helper");

// Helper function to generate filter values from query parameters
function generateFilterValue(query) {
  let filterValue = {};
  for (let key in query) {
    if (key !== "offset" && key !== "limit") {
      if (!!Funding.getAttributes()[key]) {
        if (Array.isArray(query[key])) {
          // If the query parameter is an array, use Op.or to filter for any of the values
          filterValue[key] = {
            [Op.or]: query[key].map((value) => ({
              [Op.like]: `%${value}%`,
            })),
          };
        } else {
          // If the query parameter is a single value, filter normally
          filterValue[key] = {
            [Op.like]: `%${query[key]}%`,
          };
        }
      }
    }
  }
  return filterValue;
}

function generateEnrolFilter(query) {
  let filterValue = {
    [Op.or]: [],
  };

  for (let key in query) {
    if (key !== "offset" && key !== "limit") {
      if (FundingEnrol.getAttributes()[key] !== undefined) {
        if (Array.isArray(query[key])) {
          // If the query parameter is an array, use Op.or to filter for any of the values
          filterValue[Op.or].push({
            [key]: {
              [Op.or]: query[key].map((value) => ({
                [Op.like]: `%{value}%`,
              })),
            },
          });
        } else {
          // If the query parameter is a single value, filter normally
          filterValue[Op.or].push({
            [key]: {
              [Op.like]: `%${query[key]}%`,
            },
          });
        }
      }
    }
  }

  // Add the logic to combine firstname and lastname filters
  let nameFilters = [];
  if (query.firstname) {
    nameFilters.push({
      firstname: {
        [Op.like]: `%${query.firstname}%`,
      },
    });
  }
  if (query.lastname) {
    nameFilters.push({
      lastname: {
        [Op.like]: `%${query.lastname}%`,
      },
    });
  }
  if (nameFilters.length > 0) {
    filterValue[Op.or].push(...nameFilters);
  }

  // If the Op.or array is empty, remove it to avoid unnecessary filtering
  if (filterValue[Op.or].length === 0) {
    delete filterValue[Op.or];
  }

  return filterValue;
}
// Helper function to generate common includes
function generateCommonIncludes() {
  return [
    {
      model: FundingCategory,
      as: "fundingCategory",
    },
  ];
}

function generateUserFundingEnrolFilter(query) {
  let filterValue = {
    [Op.or]: [],
  };

  const allowedKeys = ["experienceLevel", "country"];

  for (let key in query) {
    if (allowedKeys.includes(key)) {
      if (User.getAttributes()[key] !== undefined) {
        if (Array.isArray(query[key])) {
          // If the query parameter is an array, use Op.or to filter for any of the values
          filterValue[Op.or].push({
            [key]: {
              [Op.or]: query[key].map((value) => ({
                [Op.like]: `%${value}%`,
              })),
            },
          });
        } else {
          // If the query parameter is a single value, filter normally
          filterValue[Op.or].push({
            [key]: {
              [Op.like]: `%${query[key]}%`,
            },
          });
        }
      }
    }
  }

  // If the Op.or array is empty, remove it to avoid unnecessary filtering
  if (filterValue[Op.or].length === 0) {
    delete filterValue[Op.or];
  }

  return filterValue;
}
class FundingServices {
  async all(req, offset, limit) {
    let filterValue = generateFilterValue(req.query);

    let { count, rows } = await Funding.findAndCountAll({
      distinct: true,
      where: { ...filterValue, status: "active" },
      limit,
      offset,
      include: generateCommonIncludes(),
    });

    return { count, rows };
  }

  async adminAll(req, offset, limit) {
    let filterValue = generateFilterValue(req.query);

    let { count, rows } = await Funding.findAndCountAll({
      distinct: true,
      where: { ...filterValue },
      limit,
      offset,
      include: generateCommonIncludes(),
    });

    return { count, rows };
  }

  async findAllBy(by) {
    let funding = await Funding.findOne({
      where: by,
      include: generateCommonIncludes(),
    });

    if (!funding) {
      return null;
    }

    return funding;
  }

  async findOne(id) {
    let funding = await Funding.findOne({
      where: { id },
      include: generateCommonIncludes(),
    });

    if (!funding) {
      return null;
    }

    return funding;
  }

  async findBy(by) {
    let funding = await Funding.findOne({
      where: by,
      include: generateCommonIncludes(),
    });

    if (!funding) {
      return null;
    }

    return funding;
  }

  async findAllBy(by) {
    let fundings = await Funding.findAll({
      where: by,
      include: generateCommonIncludes(),
    });

    return fundings;
  }

  async store(req) {
    return await Funding.create(req.body);
  }

  async update(id, req) {
    return await Funding.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Funding.destroy({ where: { id } });
  }

  async getAllUserFunding(req, offset, limit) {
    let conditionObj = undefined;
    if (
      typeof req?.user?.roleName === "string" &&
      typeof req?.user?.id === "string" &&
      req.user.id.trim() !== "" &&
      req.user.roleName.trim() === USER_ROLES.contributor
    ) {
      conditionObj = { userId: req.user.id };
    } else if (
      typeof req?.business?.roleName === "string" &&
      typeof req?.business?.id === "string" &&
      req.business.id.trim() !== "" &&
      req.business.roleName.trim() === USER_ROLES.contributor
    ) {
      conditionObj = { businessId: req.business.id };
    }

    let filterValue = generateFilterValue(req.query);

    return await Funding.findAndCountAll({
      distinct: true,
      where: { ...conditionObj, ...filterValue },
      limit,
      offset,
      include: generateCommonIncludes(),
    });
  }

  async getAllBusinessFunding(req, offset, limit) {
    const { id: businessId } = req.business;

    let filterValue = generateFilterValue(req.query);

    return await Funding.findAndCountAll({
      distinct: true,
      where: { businessId, ...filterValue },
      limit,
      offset,
      include: generateCommonIncludes(),
    });
  }

  async getAllUserApplicants(req, offset, limit) {
    const { fundingId } = req.params;

    let filterValue = generateEnrolFilter(req.query);
    let filterUserValue = generateUserFundingEnrolFilter(req.query);

    return await FundingEnrol.findAndCountAll({
      distinct: true,
      where: { ...filterValue, fundingId },
      include: [
        {
          model: User,
          as: "user",
          where: { ...filterUserValue },
        },
      ],
      limit,
      offset,
    });
  }

  async getAllBusinessApplicants(req, offset, limit) {
    const { fundingId } = req.params;

    let filterValue = generateEnrolFilter(req.query);
    let filterUserValue = generateUserFundingEnrolFilter(req.query);

    return await FundingEnrol.findAndCountAll({
      distinct: true,
      where: { ...filterValue, fundingId },

      include: [
        {
          model: User,
          as: "user",
          where: { ...filterUserValue },
        },
      ],
      limit,
      offset,
    });
  }

  // all attributes
  async getAllDistinctAttributes() {
    const attributes = [
      "fundingPurpose",
      "organizationName",
      "organizationName",
    ];

    const results = {};

    for (const attribute of attributes) {
      results[attribute] = await Funding.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col(attribute)), attribute],
          [Sequelize.fn("COUNT", Sequelize.col("*")), "fundingCount"],
        ],
        where: {
          [attribute]: {
            [Sequelize.Op.not]: null,
          },
        },
        group: [attribute],
      });
    }

    return results;
  }
}

module.exports = new FundingServices();
