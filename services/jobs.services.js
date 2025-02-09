const {
  Jobs,
  JobEnrol,
  User,
  JobCategory,
  Skills,
  UsersSkills,
} = require("../models");
const { Op, Sequelize } = require("sequelize");
const sequelize = require("sequelize");
const { USER_ROLES } = require("../helpers/user.helper");

class JobsServices {
  generateInclude() {
    return [{ model: JobCategory }, { model: Skills, as: "skills" }];
  }
  generateFilterValue(query) {
    let filterValue = {};
    const allowedKeys = [
      "salary",
      "minSalary",
      "maxSalary",
      "experienceLevel",
      "levelOfEducation",
      "organizationName",
      "workingStyle",
      "employmentBenefits",
      "city",
      "country",
      "state",
      "language",
      "type",
      "appDeadlineType",
      "status",
      "title",
    ];

    for (let key in query) {
      if (
        key !== "offset" &&
        key !== "limit" &&
        key !== "jobcategoryId" &&
        allowedKeys.includes(key)
      ) {
        // Exclude jobcategoryId and limit to allowed keys
        if (key === "salary" && query.salary) {
          filterValue.salary = { [Op.eq]: query.salary };
        } else if ((key === "minSalary" || key === "maxSalary") && query[key]) {
          const salaryRange = filterValue.salary || {};
          if (key === "minSalary") {
            salaryRange[Op.gte] = query.minSalary;
          } else if (key === "maxSalary") {
            salaryRange[Op.lte] = query.maxSalary;
          }
          filterValue.salary = salaryRange;
        } else if (key === "experienceLevel" && query.experienceLevel) {
          // Apply exact match for experienceLevel
          filterValue.experienceLevel = { [Op.eq]: query.experienceLevel };
        } else if (key === "employmentBenefits" || key === "language") {
          // Handle JSON fields with JSON_CONTAINS for MySQL
          if (Array.isArray(query[key])) {
            filterValue[Op.or] = query[key].map((value) =>
              Sequelize.literal(`JSON_CONTAINS(${key}, '"${value}"')`)
            );
          } else {
            filterValue[Op.and] = Sequelize.literal(
              `JSON_CONTAINS(${key}, '"${query[key]}"')`
            );
          }
        } else if (!!Jobs.getAttributes()[key]) {
          if (Array.isArray(query[key])) {
            filterValue[key] = {
              [Op.or]: query[key].map((value) => ({
                [Op.like]: `%${value}%`,
              })),
            };
          } else {
            filterValue[key] = {
              [Op.like]: `%${query[key]}%`,
            };
          }
        }
      }
    }
    return filterValue;
  }

  generateFilterValueOLD(query) {
    let filterValue = {};
    for (let key in query) {
      if (key !== "offset" && key !== "limit") {
        if (key === "salary" && query.salary) {
          filterValue.salary = { [Op.eq]: query.salary };
        } else if ((key === "minSalary" || key === "maxSalary") && query[key]) {
          const salaryRange = filterValue.salary || {};
          if (key === "minSalary") {
            salaryRange[Op.gte] = query.minSalary;
          } else if (key === "maxSalary") {
            salaryRange[Op.lte] = query.maxSalary;
          }
          filterValue.salary = salaryRange;
        } else if (!!Jobs.getAttributes()[key]) {
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

  generateEnrolFilter(query) {
    let filterValue = {
      [Op.or]: [],
    };

    for (let key in query) {
      if (key !== "offset" && key !== "limit") {
        if (JobEnrol.getAttributes()[key] !== undefined) {
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

  generateUserJobEnrolFilter(query) {
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

  async generateCategoryFilterValue(query) {
    let filterValue = {};

    if (query.jobcategoryId) {
      const requestedId = query.jobcategoryId;

      // Fetch the root category
      const rootCategory = await JobCategory.findOne({
        where: { id: requestedId },
      });

      if (rootCategory) {
        let categoryIds = [requestedId]; // Start with the requested ID

        if (rootCategory.hierarchyLevel === 1) {
          // Fetch level 2 categories
          const level2Categories = await JobCategory.findAll({
            where: {
              parentId: requestedId,
              hierarchyLevel: 2,
              totalJobCount: { [Op.gt]: 0 },
            },
            attributes: ["id"],
          });

          const level2Ids = level2Categories.map((cat) => cat.id);

          // Fetch level 3 categories
          const level3Categories = await JobCategory.findAll({
            where: {
              parentId: { [Op.in]: level2Ids },
              hierarchyLevel: 3,
              totalJobCount: { [Op.gt]: 0 },
            },
            attributes: ["id"],
          });

          const level3Ids = level3Categories.map((cat) => cat.id);

          // Fetch level 4 categories
          const level4Categories = await JobCategory.findAll({
            where: {
              parentId: { [Op.in]: level3Ids },
              hierarchyLevel: 4,
              totalJobCount: { [Op.gt]: 0 },
            },
            attributes: ["id"],
          });

          // Collect all IDs (level 2, 3, and 4)
          categoryIds = categoryIds.concat(
            level2Ids,
            level3Ids,
            level4Categories.map((cat) => cat.id)
          );
        } else if (rootCategory.hierarchyLevel === 2) {
          // Include self and all level 3 and 4 children
          const level3Categories = await JobCategory.findAll({
            where: {
              parentId: requestedId,
              hierarchyLevel: 3,
              totalJobCount: { [Op.gt]: 0 },
            },
            attributes: ["id"],
          });

          const level3Ids = level3Categories.map((cat) => cat.id);

          // Fetch level 4 categories
          const level4Categories = await JobCategory.findAll({
            where: {
              parentId: { [Op.in]: level3Ids },
              hierarchyLevel: 4,
              totalJobCount: { [Op.gt]: 0 },
            },
            attributes: ["id"],
          });

          // Collect IDs (self, level 3, and level 4)
          categoryIds = categoryIds.concat(
            level3Ids,
            level4Categories.map((cat) => cat.id)
          );
        } else if (rootCategory.hierarchyLevel === 3) {
          // Include self and all level 4 children
          const level4Categories = await JobCategory.findAll({
            where: {
              parentId: requestedId,
              hierarchyLevel: 4,
              totalJobCount: { [Op.gt]: 0 },
            },
            attributes: ["id"],
          });

          // Collect IDs (self and level 4)
          categoryIds = categoryIds.concat(
            level4Categories.map((cat) => cat.id)
          );
        } else if (rootCategory.hierarchyLevel === 4) {
          // For level 4, include only the self-category
          categoryIds = [requestedId];
        }

        filterValue["id"] = {
          [Op.in]: categoryIds,
        };
      }
    }

    return filterValue;
  }

  // generate the skills filter
  generateSkillsFilterValue(query) {
    let filterValue = {};

    for (let key in query) {
      if (key !== "offset" && key !== "limit") {
        if (key === "skills") {
          if (Array.isArray(query[key])) {
            filterValue["name"] = {
              [Op.or]: query[key].map((value) => ({
                [Op.like]: `%${value}%`,
              })),
            };
          } else {
            filterValue["name"] = {
              [Op.like]: `%${query[key]}%`,
            };
          }
        }
      }
    }

    return filterValue;
  }

  generateJobEnrolSkillsFilterValue(query) {
    let filterConditions = [];

    for (let key in query) {
      if (key === "skills") {
        if (Array.isArray(query?.[key]) && query[key].length > 0) {
          filterConditions.push({
            name: {
              [Op.or]: query[key].map((value) => ({
                [Op.like]: `%${value}%`,
              })),
            },
          });
        } else if (
          typeof query?.[key] === "string" &&
          query[key].trim() !== ""
        ) {
          filterConditions.push({
            name: {
              [Op.like]: `%${query[key]}%`,
            },
          });
        }
      }
    }

    return filterConditions;
  }

  async all(req, offset, limit) {
    const filterValue = this.generateFilterValue(req.query); // Excludes jobcategoryId
    const filterJobCategory = await this.generateCategoryFilterValue(req.query); // Handles jobcategoryId
    const skillsFilterValue = this.generateSkillsFilterValue(req.query);

    // Remove "order" from req.query to avoid validation errors
    const { order, jobcategoryId, ...remainingQuery } = req.query;

    const { count, rows } = await Jobs.findAndCountAll({
      distinct: true,
      where: { status: "opened", ...filterValue }, // Combine generic filters
      limit,
      offset,
      include: [
        { model: JobCategory, where: filterJobCategory }, // Specific category filter
        {
          model: Skills,
          as: "skills",
          where: skillsFilterValue,
        },
      ],
      order: [["createdAt", "desc"]],
    });
    //TODO if count is greater then 1 then i need to add new object new

    return { count, rows };
  }

  async adminAll(req, offset, limit) {
    let filterValue = this.generateFilterValue(req.query);

    let { count, rows } = await Jobs.findAndCountAll({
      distinct: true,
      where: { ...filterValue },
      limit,
      offset,
      include: this.generateInclude(),
      order: [["createdAt", "desc"]],
    });

    return { count, rows };
  }

  async findOne(id) {
    return await Jobs.findOne({
      where: { id },
      include: this.generateInclude(),
    });
  }

  async findBy(by) {
    return await Jobs.findOne({
      where: by,
      include: this.generateInclude(),
    });
  }

  async findAllBy(by) {
    return await Jobs.findAll({
      where: by,
      include: this.generateInclude(),
    });
  }

  async store(req, transaction) {
    return await Jobs.create(
      { ...req.body },
      {
        transaction,
      }
    );
  }

  async update(id, req) {
    return await Jobs.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Jobs.destroy({ where: { id } });
  }

  async getAllUserJobs(req, offset, limit) {
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
    let filterValue = this.generateFilterValue(req.query);

    return await Jobs.findAndCountAll({
      distinct: true,
      where: { ...conditionObj, ...filterValue },
      limit,
      offset,
    });
  }

  async getAllBusinessJobs(req, offset, limit) {
    const { id: businessId } = req.business;
    let filterValue = this.generateFilterValue(req.query);

    return await Jobs.findAndCountAll({
      distinct: true,
      where: { businessId, ...filterValue },
      limit,
      offset,
      include: [{ model: JobEnrol, attributes: [] }],
      attributes: {
        include: [
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM jobenrols WHERE jobenrols.jobId = jobs.id)"
            ),
            "jobEnrolCount",
          ],
        ],
      },
    });
  }

  async getAllUserApplicants(req, offset, limit) {
    let userId = null;
    let businessId = null;

    if (req.user) {
      userId = req.user.id;
    } else if (req.business) {
      businessId = req.business.id;
    }

    const { jobId: id } = req.params;
    let filterValue = this.generateEnrolFilter(req.query);
    let filterUserValue = this.generateUserJobEnrolFilter(req.query);
    let filterSkillsValue = this.generateJobEnrolSkillsFilterValue(req.query);

    // Construct the where clause
    let whereClause = { id };

    if (userId) {
      whereClause.userId = userId;
    }

    if (businessId) {
      whereClause.businessId = businessId;
    }

    return await JobEnrol.findAndCountAll({
      distinct: true,
      include: [
        {
          model: User,
          include: [
            {
              model: Skills,
              as: "skills",
              through: {
                model: UsersSkills,
                as: "userskills",
              },
              where:
                filterSkillsValue.length > 0 ? filterSkillsValue : undefined,
            },
          ],
          where: { ...filterUserValue },
          as: "user",
        },
      ],
      where: { ...filterValue, jobId: id },
      limit,
      offset,
    });
  }

  async getAllBusinessApplicants(req, offset, limit) {
    const { jobId: id } = req.params;
    let filterValue = this.generateEnrolFilter(req.query);
    let filterUserValue = this.generateUserJobEnrolFilter(req.query);
    let filterSkillsValue = this.generateJobEnrolSkillsFilterValue(req.query);

    return await JobEnrol.findAndCountAll({
      distinct: true,
      include: [
        {
          model: User,
          include: [
            {
              model: Skills,
              as: "skills",
              through: {
                model: UsersSkills,
                as: "userskills",
              },
              where:
                filterSkillsValue.length > 0 ? filterSkillsValue : undefined,
            },
          ],
          where: { ...filterUserValue },
          as: "user",
        },
      ],
      where: { ...filterValue, jobId: id },
      limit,
      offset,
    });
  }

  // async getAllBusinessApplicants(req, offset, limit) {
  //   const { jobId: id } = req.params;
  //   let filterValue = this.generateEnrolFilter(req.query);
  //   let filterUserValue = this.generateUserJobEnrolFilter(req.query);
  //   let filterSkillsValue = this.generateSkillsFilterValue(req.query);

  //   // user filter values

  //   // country
  //   // skills
  //   // experienceLevel

  //   return await JobEnrol.findAndCountAll({
  //     distinct: true,
  //     include: [
  //       {
  //         model: User,
  //         include: [
  //           {
  //             model: Skills,
  //             as: "skills",
  //             where: [...filterSkillsValue],
  //           },
  //         ],
  //         where: { ...filterUserValue },
  //         as: "user",
  //       },
  //     ],
  //     where: { ...filterValue, jobId: id },
  //     limit,
  //     offset,
  //   });
  // }

  async skillsJobs(req, skills, offset, limit) {
    let filterValue = this.generateFilterValue(req.query);
    let skillIds = skills || [];

    let { count, rows } = await Jobs.findAndCountAll({
      distinct: true,
      where: { status: "opened", ...filterValue },
      limit,
      offset,
      include: [
        { model: JobCategory },
        {
          model: Skills,
          as: "skills",
          required: true,
          through: {
            model: JobsSkills,
            where:
              skillIds.length > 0
                ? { skillId: { [Op.in]: skillIds } }
                : undefined,
          },
        },
      ],
      group: ["Jobs.id"],
      having:
        skillIds.length > 0
          ? Sequelize.literal(
              `COUNT(DISTINCT \`skills\`.\`id\`) = ${skillIds.length}`
            )
          : undefined,
    });

    return { count, rows };
  }

  // all attributes
  async getAllDistinctAttributes() {
    const attributes = [
      "workingStyle",
      "experienceLevel",
      "levelOfEducation",
      "employmentBenefits",
      "organizationName",
    ];

    const results = {};

    for (const attribute of attributes) {
      results[attribute] = await Jobs.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col(attribute)), attribute],
          [Sequelize.fn("COUNT", Sequelize.col("*")), "jobCounts"],
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

  async getAllJobsById(id) {
    return await Jobs.findOne({
      where: { id },
      include: this.generateInclude(),
    });
  }

  async updateJobs(id, req) {
    return await Jobs.update(req.body, { where: { id } });
  }
}

module.exports = new JobsServices();
