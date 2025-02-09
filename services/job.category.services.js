// Models
const { JobCategory, JobCategoryAncestor, Jobs } = require("../models");
const { Op, Sequelize } = require("sequelize");

class CategoryServices {
  generateFilterValueForCategory(query) {
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
    ];

    for (let key in query) {
      if (
        key !== "offset" &&
        key !== "limit" &&
        key !== "jobcategoryId" &&
        allowedKeys.includes(key)
      ) {
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
          filterValue.experienceLevel = { [Op.eq]: query.experienceLevel };
        } else if (key === "employmentBenefits" || key === "language") {
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

    if (query.hierarchyLevel) {
      // Modify filterValue based on hierarchy level
      if (query.hierarchyLevel >= 1 && query.hierarchyLevel <= 3) {
        // For hierarchy levels 1, 2, and 3, get jobs based on ancestor relationship
        filterValue.jobCategoryId = {
          [Op.in]: Sequelize.literal(
            `(SELECT jobcategoriesId FROM jobcategoriesancestors WHERE ancestorId = '${query.ancestorId}')`
          ),
        };
      } else if (query.hierarchyLevel === 4 && query.jobcategoryId) {
        // For hierarchy level 4, filter directly using the jobCategoryId
        filterValue.jobCategoryId = query.jobcategoryId;
      }
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

  async allCategory() {
    return await JobCategory.findAll({
      hierarchy: true,
      order: [["name", "ASC"]],
    });
  }

  async all(req) {
    let filterValue = {};

    const { query } = req;
    for (let key in query) {
      if (key !== "offset" && key !== "limit") {
        if (!!JobCategory.getAttributes()[key]) {
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

    if (query.action === "header") {
      filterValue[Sequelize.Op.and] = [
        { totalJobCount: { [Op.gt]: 0 } },
        { hierarchyLevel: 1 },
      ];
    }

    const childCondition =
      query.action === "header" ? { totalJobCount: { [Op.gt]: 0 } } : {};

    const categories = await JobCategory.findAll({
      attributes: [
        "id",
        "parentId",
        "name",
        "hierarchyLevel",
        "jobCount",
        "totalJobCount",
        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.literal(
              "(SELECT COUNT(*) FROM jobcategories AS child WHERE child.parentId = jobcategories.id)"
            ),
            0
          ),
          "next_child_count",
        ],
      ],
      where: {
        parentId: null,
        ...filterValue,
      },
      include: [
        {
          model: JobCategory,
          as: "children",
          attributes: [
            "id",
            "parentId",
            "name",
            "hierarchyLevel",
            "jobCount",
            "totalJobCount",
            [
              Sequelize.fn(
                "COALESCE",
                Sequelize.literal(
                  "(SELECT COUNT(*) FROM jobcategories AS child WHERE child.parentId = children.id)"
                ),
                0
              ),
              "next_child_count",
            ],
          ],
          where: childCondition,
          required: false,
          include: [
            {
              model: JobCategory,
              as: "children",
              attributes: [
                "id",
                "parentId",
                "name",
                "hierarchyLevel",
                "jobCount",
                "totalJobCount",
                [
                  Sequelize.fn(
                    "COALESCE",
                    Sequelize.literal(
                      "(SELECT COUNT(*) FROM jobcategories AS child WHERE child.parentId = children.id)"
                    ),
                    0
                  ),
                  "next_child_count",
                ],
              ],
              where: childCondition,
              required: false,
              include: [
                {
                  model: JobCategory,
                  as: "children",
                  attributes: [
                    "id",
                    "parentId",
                    "name",
                    "hierarchyLevel",
                    "jobCount",
                    "totalJobCount",
                    [
                      Sequelize.fn(
                        "COALESCE",
                        Sequelize.literal(
                          "(SELECT COUNT(*) FROM jobcategories AS child WHERE child.parentId = children.id)"
                        ),
                        0
                      ),
                      "next_child_count",
                    ],
                  ],
                  where: childCondition,
                  required: false,
                },
              ],
            },
          ],
        },
      ],
      order: [["name", "ASC"]],
    });

    // Function to calculate total_children_count recursively
    const calculateTotalChildrenCount = (category) => {
      if (!category.children || category.children.length === 0) {
        return 0;
      }

      let totalCount = category.children.length; // immediate children count

      for (const child of category.children) {
        totalCount += calculateTotalChildrenCount(child); // recursive count of all descendants
      }

      return totalCount;
    };

    // Process categories to add total_children_count
    const processedCategories = categories.map((category) => {
      category = category.toJSON(); // Convert Sequelize instance to plain object
      category.total_children_count = calculateTotalChildrenCount(category); // Add total_children_count
      return category;
    });

    return processedCategories;
  }

  async jobCategories(req) {
    let filterValue = {};

    const { query } = req;
    for (let key in query) {
      if (key !== "offset" && key !== "limit") {
        if (!!JobCategory.getAttributes()[key]) {
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

    const categories = await JobCategory.findAll({
      attributes: [
        "id",
        "parentId",
        "name",
        "createdAt",
        "updatedAt",
        "hierarchyLevel",
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM jobs  WHERE jobs.jobcategoryId = jobcategories.id AND jobs.status = 'opened' )"
          ),
          "jobCount",
        ],
      ],
      where: {
        // parentId: null,
        [Sequelize.Op.and]: Sequelize.literal(
          "(SELECT COUNT(*) FROM jobs  WHERE jobs.jobcategoryId = jobcategories.id AND jobs.status = 'opened' ) > 0"
        ),
        ...filterValue,
      },
      include: [
        {
          model: JobCategory,
          as: "children",
          attributes: [
            "id",
            "parentId",
            "name",
            "createdAt",
            "updatedAt",
            "hierarchyLevel",
            [
              Sequelize.literal(
                "(SELECT COUNT(*) FROM jobs  WHERE jobs.jobcategoryId = children.id AND jobs.status = 'opened' )"
              ),
              "jobCount",
            ],
          ],
          required: false,
          where: Sequelize.literal(
            "(SELECT COUNT(*) FROM jobs  WHERE jobs.jobcategoryId = children.id AND jobs.status = 'opened' ) > 0"
          ),
          include: [
            {
              model: JobCategory,
              as: "children",
              attributes: [
                "id",
                "parentId",
                "name",
                "createdAt",
                "updatedAt",
                "hierarchyLevel",
                [
                  Sequelize.literal(
                    "(SELECT COUNT(*) FROM jobs  WHERE jobs.jobcategoryId = children.id AND jobs.status = 'opened' )"
                  ),
                  "jobCount",
                ],
              ],
              required: false,
              where: Sequelize.literal(
                "(SELECT COUNT(*) FROM jobs  WHERE jobs.jobcategoryId = children.id AND jobs.status = 'opened' ) > 0"
              ),
            },
          ],
        },
        {
          model: JobCategory,
          as: "ancestors",
          attributes: [
            "id",
            "parentId",
            "name",
            "createdAt",
            "updatedAt",
            "hierarchyLevel",
            [
              Sequelize.literal(
                "(SELECT COUNT(*) FROM jobs  WHERE jobs.jobcategoryId = ancestors.id AND jobs.status = 'opened' )"
              ),
              "jobCount",
            ],
          ],
          required: false,
          where: Sequelize.literal(
            "(SELECT COUNT(*) FROM jobs  WHERE jobs.jobcategoryId = ancestors.id AND jobs.status = 'opened' ) > 0"
          ),
        },
      ],
      order: [["name", "ASC"]],
    });

    return categories;
  }

  async allParent() {
    return await JobCategory.findAll({
      where: { parentId: null },
      include: {
        model: JobCategory,
        as: "children",
      },
    });
  }

  async getfindJobCatOne(id) {
    const jobCategory = await JobCategory.findOne({
      attributes: [
        "id",
        "parentId",
        "name",
        "createdAt",
        "updatedAt",
        "hierarchyLevel",
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM jobs WHERE jobs.jobcategoryId = jobcategories.id)"
          ),
          "jobCount",
        ],
      ],
      where: {
        id,
      },
      include: [
        {
          model: JobCategory,
          as: "children",
          attributes: [
            "id",
            "parentId",
            "name",
            "createdAt",
            "updatedAt",
            "hierarchyLevel",
            [
              Sequelize.literal(
                "(SELECT COUNT(*) FROM jobs WHERE jobs.jobcategoryId = children.id)"
              ),
              "jobCount",
            ],
          ],
          required: false,
        },
        {
          model: JobCategory,
          as: "ancestors",
          attributes: [
            "id",
            "parentId",
            "name",
            "createdAt",
            "updatedAt",
            "hierarchyLevel",
            [
              Sequelize.literal(
                "(SELECT COUNT(*) FROM jobs WHERE jobs.jobcategoryId = ancestors.id)"
              ),
              "jobCount",
            ],
          ],
          required: false,
        },
      ],
    });

    return jobCategory;
  }

  async findOne(id) {
    const COMMON_ATTRIBUTES = [
      "id",
      "parentId",
      "name",
      "createdAt",
      "updatedAt",
      "hierarchyLevel",
      "jobCount",
      "totalJobCount",
    ];

    const category = await JobCategory.findOne({
      attributes: ["hierarchyLevel"],
      where: { id },
    });
    if (!category) throw new Error("JobCategory not found");

    const { hierarchyLevel } = category;

    const includeChildren = (currentLevel) => {
      if (currentLevel < 4) {
        return [
          {
            model: JobCategory,
            as: "children",
            attributes: COMMON_ATTRIBUTES,
            required: false,
            where: {
              totalJobCount: { [Sequelize.Op.gt]: 0 },
              hierarchyLevel: currentLevel + 1,
            },
            include: includeChildren(currentLevel + 1),
          },
        ];
      }
      return [];
    };

    const includeAncestors =
      hierarchyLevel > 1
        ? [
            {
              model: JobCategory,
              as: "ancestors",
              attributes: COMMON_ATTRIBUTES,
              required: false,
              where: {
                totalJobCount: { [Sequelize.Op.gt]: 0 },
                hierarchyLevel: { [Sequelize.Op.lt]: hierarchyLevel },
              },
              include: [
                {
                  model: JobCategory,
                  as: "ancestors",
                  attributes: COMMON_ATTRIBUTES,
                  required: false,
                  include: [
                    {
                      model: JobCategory,
                      as: "ancestors",
                      attributes: COMMON_ATTRIBUTES,
                      required: false,
                    },
                  ],
                },
              ],
            },
          ]
        : [];

    let jobCategory = await JobCategory.findOne({
      attributes: COMMON_ATTRIBUTES,
      where: { id },
      include: [...includeAncestors, ...includeChildren(hierarchyLevel)],
    });
    if (!jobCategory) throw new Error("JobCategory not found.");

    let categoryData = jobCategory.toJSON();

    const formatAncestors = (ancestorArray) => {
      if (!ancestorArray || ancestorArray.length === 0) return null;
      const [currentAncestor, ...restAncestors] = ancestorArray;
      return {
        ...currentAncestor,
        ancestors: formatAncestors(restAncestors),
      };
    };

    if (hierarchyLevel > 1 && categoryData.ancestors) {
      categoryData.ancestors = formatAncestors(categoryData.ancestors);
    }

    const ensureChildrenArray = (category) => {
      if (!category.children) {
        category.children = [];
      } else {
        category.children = category.children.map((child) =>
          ensureChildrenArray(child)
        );
      }
      return category;
    };

    categoryData = ensureChildrenArray(categoryData);

    let filters = [
      { title: "salary", option: [] },
      { title: "levelOfEducation", option: [] },
      { title: "experienceLevel", option: [] },
      { title: "organizationName", option: [] },
      { title: "workingStyle", option: [] },
      { title: "employmentBenefits", option: [] },
      { title: "city", option: [] },
      { title: "country", option: [] },
      { title: "state", option: [] },
      { title: "language", option: [] },
      { title: "type", option: [] },
      { title: "appDeadlineType", option: [] },
    ];

    let minSalary = 0,
      maxSalary = 0;
    let jobCategoryIds = [];

    if (hierarchyLevel === 4) {
      jobCategoryIds = [id];
    } else {
      const jobCategoryAncestors = await JobCategoryAncestor.findAll({
        attributes: ["jobcategoriesId"],
        where: { ancestorId: id },
      });
      jobCategoryIds = jobCategoryAncestors.map((item) => item.jobcategoriesId);
    }

    if (jobCategoryIds.length > 0) {
      const minMaxResult = await Jobs.findAll({
        attributes: [
          [Sequelize.fn("MIN", Sequelize.col("salary")), "minSalary"],
          [Sequelize.fn("MAX", Sequelize.col("salary")), "maxSalary"],
        ],
        where: { jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds } },
        raw: true,
      });
      if (minMaxResult && minMaxResult.length > 0) {
        minSalary = minMaxResult[0].minSalary || 0;
        maxSalary = minMaxResult[0].maxSalary || 0;
      }
    }

    filters[0].option = [
      { name: "min", value: minSalary },
      { name: "max", value: maxSalary },
    ];

    if (jobCategoryIds.length > 0) {
      const educationResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("levelOfEducation"), "name"],
          [Sequelize.fn("COUNT", Sequelize.col("levelOfEducation")), "count"],
        ],
        where: { jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds } },
        group: ["levelOfEducation"],
        raw: true,
      });
      if (educationResult && educationResult.length > 0) {
        filters[1].option = educationResult.map((item) => ({
          name: item.name,
          count: item.count,
        }));
      }

      const experienceResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("experienceLevel"), "name"],
          [Sequelize.fn("COUNT", Sequelize.col("experienceLevel")), "count"],
        ],
        where: { jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds } },
        group: ["experienceLevel"],
        raw: true,
      });
      if (experienceResult && experienceResult.length > 0) {
        filters[2].option = experienceResult.map((item) => ({
          name: item.name,
          count: item.count,
        }));
      }

      const companyResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("organizationName"), "name"],
          [Sequelize.fn("COUNT", Sequelize.col("organizationName")), "count"],
        ],
        where: { jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds } },
        group: ["organizationName"],
        raw: true,
      });
      if (companyResult && companyResult.length > 0) {
        filters[3].option = companyResult.map((item) => ({
          name: item.name,
          count: item.count,
        }));
      }

      const workStyleResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("workingStyle"), "name"],
          [Sequelize.fn("COUNT", Sequelize.col("workingStyle")), "count"],
        ],
        where: { jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds } },
        group: ["workingStyle"],
        raw: true,
      });
      if (workStyleResult && workStyleResult.length > 0) {
        filters[4].option = workStyleResult.map((item) => ({
          name: item.name,
          count: item.count,
        }));
      }

      const languageResult = await Jobs.findAll({
        attributes: [
          [Sequelize.fn("JSON_UNQUOTE", Sequelize.col("language")), "language"],
        ],
        where: { jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds } },
        raw: true,
      });
      const languageCount = {};
      if (languageResult && languageResult.length > 0) {
        languageResult.forEach((job) => {
          const languages = JSON.parse(job.language);
          languages.forEach((language) => {
            languageCount[language] = (languageCount[language] || 0) + 1;
          });
        });
      }
      filters[9].option = Object.keys(languageCount).map((language) => ({
        name: language,
        count: languageCount[language],
      }));

      const employeeBenefitsResult = await Jobs.findAll({
        attributes: [
          [
            Sequelize.fn("JSON_UNQUOTE", Sequelize.col("employmentBenefits")),
            "benefits",
          ],
        ],
        where: { jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds } },
        raw: true,
      });
      const benefitsCount = {};
      if (employeeBenefitsResult && employeeBenefitsResult.length > 0) {
        employeeBenefitsResult.forEach((job) => {
          const benefits = JSON.parse(job.benefits);
          benefits.forEach((benefit) => {
            benefitsCount[benefit] = (benefitsCount[benefit] || 0) + 1;
          });
        });
      }
      filters[5].option = Object.keys(benefitsCount).map((benefit) => ({
        name: benefit,
        count: benefitsCount[benefit],
      }));

      const countryResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("country"), "country_code"],
          [Sequelize.fn("COUNT", Sequelize.col("country")), "count"],
        ],
        where: { jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds } },
        group: ["country"],
        raw: true,
      });
      if (countryResult && countryResult.length > 0) {
        const path = require("path");
        const countriesDataPath = path.resolve(
          __dirname,
          "../controllers/countries/data/countries.json"
        );
        const countriesData = require(countriesDataPath);

        filters[6].option = countryResult.map((item) => {
          const countryInfo = countriesData.find(
            (country) => country.name === item.country_code
          );

          return {
            country_code: countryInfo ? countryInfo.iso2 : item.country_code,
            country_name: countryInfo ? countryInfo.name : "Unknown",
            count: item.count,
          };
        });
      }

      const stateResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("state"), "state_code"],
          [Sequelize.col("country"), "country_code"],
          [Sequelize.fn("COUNT", Sequelize.col("state")), "count"],
        ],
        where: { jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds } },
        group: ["state", "country"],
        raw: true,
      });

      if (stateResult && stateResult.length > 0) {
        const path = require("path");
        const statesDataPath = path.resolve(
          __dirname,
          "../controllers/countries/data/states.json"
        );
        const statesData = require(statesDataPath);

        filters[7].option = stateResult.map((item) => {
          const stateInfo = statesData.find(
            (state) =>
              state.state_code === item.state_code &&
              state.country_name === item.country_code
          );
          return {
            country_name: stateInfo
              ? stateInfo.country_name
              : item.country_code,
            state_name: stateInfo ? stateInfo.name : item.state_code,
            count: item.count,
          };
        });
      }

      const cityResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("city"), "name"],
          [Sequelize.col("state"), "state_code"],
          [Sequelize.col("country"), "country_code"],
          [Sequelize.fn("COUNT", Sequelize.col("city")), "count"],
        ],
        where: { jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds } },
        group: ["city", "state", "country"],
        raw: true,
      });

      if (cityResult && cityResult.length > 0) {
        const path = require("path");
        const stateDataPath = path.resolve(
          __dirname,
          "../controllers/countries/data/states_cities.json"
        );
        const stateData = require(stateDataPath);

        filters[8].option = cityResult.map((item) => {
          const state = stateData.find(
            (state) =>
              state.state_code === item.state_code &&
              state.country_code === item.country_code
          );
          const city = state
            ? state.cities.find((city) => city.name === item.name)
            : null;
          return {
            state_name: state ? state.name : item.state_code,
            city_name: city ? city.name : item.name,
            count: item.count,
          };
        });
      }

      const jobTypeResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("type"), "name"],
          [Sequelize.fn("COUNT", Sequelize.col("type")), "count"],
        ],
        where: { jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds } },
        group: ["type"],
        raw: true,
      });
      if (jobTypeResult && jobTypeResult.length > 0) {
        filters[10].option = jobTypeResult.map((item) => ({
          name: item.name,
          count: item.count,
        }));
      }

      const appDeadlineTypeResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("appDeadlineType"), "name"],
          [Sequelize.fn("COUNT", Sequelize.col("appDeadlineType")), "count"],
        ],
        where: { jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds } },
        group: ["appDeadlineType"],
        raw: true,
      });
      if (appDeadlineTypeResult && appDeadlineTypeResult.length > 0) {
        filters[11].option = appDeadlineTypeResult.map((item) => ({
          name: item.name,
          count: item.count,
        }));
      }
    }
    return { ...categoryData, filters };
  }

  async findFilter(req) {
    const filterValue = this.generateFilterValueForCategory(req.query);
    const filterJobCategory = await this.generateCategoryFilterValue(req.query); // Handles jobcategoryId

    const COMMON_ATTRIBUTES = [
      "id",
      "parentId",
      "name",
      "createdAt",
      "updatedAt",
      "hierarchyLevel",
    ];

    const {
      jobcategoryId,
      language,
      levelOfEducation,
      experienceLevel,
      organizationName,
      workingStyle,
      country,
      state,
      city,
      type,
      appDeadlineType,
      employmentBenefits,
    } = req.query;

    // Step 1: Get all level-4 categories that have job matches
    let matchedJobs = [];
    if (jobcategoryId) {
      matchedJobs = await Jobs.findAll({
        attributes: ["id", "jobCategoryId"],
        where: { status: "opened", ...filterValue },
        include: [
          {
            model: JobCategory,
            as: "jobcategory",
            attributes: ["id", "name", "hierarchyLevel", "parentId"],
            where: filterJobCategory,
          },
        ],
      });
    }

    // Step 2: Collect all level-4 categories and count jobs
    const jobCategoryData = {};
    matchedJobs.forEach((job) => {
      if (job.jobcategory) {
        const { id, name, hierarchyLevel, parentId } = job.jobcategory;

        // Only consider level-4 categories
        if (hierarchyLevel === 4) {
          if (!jobCategoryData[id]) {
            jobCategoryData[id] = {
              id,
              name,
              hierarchyLevel,
              parentId,
              ajobCount: 0,
              totalJobCount: 0,
            };
          }
          jobCategoryData[id].ajobCount += 1;
          jobCategoryData[id].totalJobCount += 1;
        }
      }
    });

    // Step 3: Use jobcategoriesancestors to propagate counts upwards
    const jobCategoryKeys = Object.keys(jobCategoryData);

    if (jobCategoryKeys.length > 0) {
      const ancestors = await JobCategoryAncestor.findAll({
        where: {
          jobcategoriesId: { [Sequelize.Op.in]: jobCategoryKeys },
        },
        attributes: ["jobcategoriesId", "ancestorId"],
        raw: true,
      });

      // Propagate counts using ancestor relationships
      ancestors.forEach(({ jobcategoriesId, ancestorId }) => {
        if (!jobCategoryData[ancestorId]) {
          // Initialize ancestor if it doesn't exist
          jobCategoryData[ancestorId] = {
            id: ancestorId,
            hierarchyLevel: jobCategoryData[jobcategoriesId].hierarchyLevel - 1,
            parentId: null, // Parent ID isn't known directly here
            ajobCount: 0,
            totalJobCount: 0,
          };
        }
        // Propagate the job count from the child to the ancestor
        jobCategoryData[ancestorId].totalJobCount +=
          jobCategoryData[jobcategoriesId].totalJobCount;
      });
    }
    // Step 4: Remove categories with a total job count of 0
    Object.keys(jobCategoryData).forEach((categoryId) => {
      if (jobCategoryData[categoryId].totalJobCount === 0) {
        delete jobCategoryData[categoryId];
      }
    });
    // Step 5: Fetch the base category data including ancestors and children
    const category = await JobCategory.findOne({
      attributes: ["hierarchyLevel"],
      where: { id: jobcategoryId || null },
    });
    if (!category) {
      return {
        status: false,
        message: "JobCategory not found",
        data: null,
        error: { message: "JobCategory not found" },
      };
    }

    const { hierarchyLevel } = category;

    let jobCategory = await JobCategory.findOne({
      attributes: COMMON_ATTRIBUTES,
      where: { id: jobcategoryId },
      include: [
        {
          model: JobCategory,
          as: "children",
          attributes: COMMON_ATTRIBUTES,
          required: false,
        },
        {
          model: JobCategory,
          as: "ancestors",
          attributes: COMMON_ATTRIBUTES,
          required: false,
        },
      ],
    });
    if (!jobCategory) {
      return {
        status: false,
        message: "JobCategory not found",
        data: null,
        error: { message: "JobCategory not found" },
      };
    }

    let categoryData = jobCategory.toJSON();

    // Step 6: Update the totalJobCount dynamically for ancestors and children
    const updateTotalJobCount = (category) => {
      if (jobCategoryData[category.id]) {
        category.ajobCount = jobCategoryData[category.id].ajobCount;
        category.totalJobCount = jobCategoryData[category.id].totalJobCount;
      } else {
        // Exclude categories with 0 jobs
        return null;
      }

      if (category.children && category.children.length > 0) {
        category.children = category.children
          .map((child) => updateTotalJobCount(child))
          .filter((child) => child !== null);
        category.totalJobCount += category.children.reduce(
          (sum, child) => sum + child.totalJobCount,
          0
        );
      }

      return category;
    };

    categoryData = updateTotalJobCount(categoryData);

    if (!categoryData) {
      return {
        status: false,
        message: "No eligible job categories found",
        data: null,
        error: { message: "No eligible job categories found" },
      };
    }

    // Step 7: Format ancestors to ensure always returning an object
    const formatAncestors = (ancestorArray) => {
      if (!ancestorArray || ancestorArray.length === 0) {
        return {}; // Return empty object if there are no ancestors
      }
      const [currentAncestor, ...restAncestors] = ancestorArray;
      if (
        jobCategoryData[currentAncestor.id] &&
        jobCategoryData[currentAncestor.id].totalJobCount > 0
      ) {
        return {
          ...currentAncestor,
          totalJobCount: jobCategoryData[currentAncestor.id].totalJobCount,
          ancestors: formatAncestors(restAncestors),
        };
      }
      return formatAncestors(restAncestors); // Skip ancestors that have no job data
    };

    if (hierarchyLevel > 1 && categoryData.ancestors) {
      categoryData.ancestors = formatAncestors(categoryData.ancestors);
    } else {
      categoryData.ancestors = {}; // Ensure ancestors is always an object
    }

    var id = jobcategoryId;

    let filters = [
      { title: "salary", option: [] },
      { title: "levelOfEducation", option: [] },
      { title: "experienceLevel", option: [] },
      { title: "organizationName", option: [] },
      { title: "workingStyle", option: [] },
      { title: "employmentBenefits", option: [] },
      { title: "city", option: [] },
      { title: "country", option: [] },
      { title: "state", option: [] },
      { title: "language", option: [] },
      { title: "type", option: [] },
      { title: "appDeadlineType", option: [] },
    ];

    let minSalary = 0,
      maxSalary = 0;
    let jobCategoryIds = [];

    if (hierarchyLevel === 4) {
      jobCategoryIds = [id];
    } else {
      const jobCategoryAncestors = await JobCategoryAncestor.findAll({
        attributes: ["jobcategoriesId"],
        where: { ancestorId: id },
      });
      jobCategoryIds = jobCategoryAncestors.map((item) => item.jobcategoriesId);
    }

    if (jobCategoryIds.length > 0) {
      const minMaxResult = await Jobs.findAll({
        attributes: [
          [Sequelize.fn("MIN", Sequelize.col("salary")), "minSalary"],
          [Sequelize.fn("MAX", Sequelize.col("salary")), "maxSalary"],
        ],
        where: {
          jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds },
          ...filterValue,
        },

        raw: true,
      });
      if (minMaxResult && minMaxResult.length > 0) {
        minSalary = minMaxResult[0].minSalary || 0;
        maxSalary = minMaxResult[0].maxSalary || 0;
      }
    }

    filters[0].option = [
      { name: "min", value: minSalary },
      { name: "max", value: maxSalary },
    ];

    if (jobCategoryIds.length > 0) {
      const educationResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("levelOfEducation"), "name"],
          [Sequelize.fn("COUNT", Sequelize.col("levelOfEducation")), "count"],
        ],
        where: {
          jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds },
          ...filterValue,
        },
        group: ["levelOfEducation"],
        raw: true,
      });
      if (educationResult && educationResult.length > 0) {
        filters[1].option = educationResult.map((item) => ({
          name: item.name,
          count: item.count,
        }));
      }

      const experienceResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("experienceLevel"), "name"],
          [Sequelize.fn("COUNT", Sequelize.col("experienceLevel")), "count"],
        ],
        where: {
          jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds },
          ...filterValue,
        },
        group: ["experienceLevel"],
        raw: true,
      });
      if (experienceResult && experienceResult.length > 0) {
        filters[2].option = experienceResult.map((item) => ({
          name: item.name,
          count: item.count,
        }));
      }

      const companyResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("organizationName"), "name"],
          [Sequelize.fn("COUNT", Sequelize.col("organizationName")), "count"],
        ],
        where: {
          jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds },
          ...filterValue,
        },
        group: ["organizationName"],
        raw: true,
      });
      if (companyResult && companyResult.length > 0) {
        filters[3].option = companyResult.map((item) => ({
          name: item.name,
          count: item.count,
        }));
      }

      const workStyleResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("workingStyle"), "name"],
          [Sequelize.fn("COUNT", Sequelize.col("workingStyle")), "count"],
        ],
        where: {
          jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds },
          ...filterValue,
        },
        group: ["workingStyle"],
        raw: true,
      });
      if (workStyleResult && workStyleResult.length > 0) {
        filters[4].option = workStyleResult.map((item) => ({
          name: item.name,
          count: item.count,
        }));
      }

      const languageResult = await Jobs.findAll({
        attributes: [
          [Sequelize.fn("JSON_UNQUOTE", Sequelize.col("language")), "language"],
        ],
        where: {
          jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds },
          ...filterValue,
        },
        raw: true,
      });
      const languageCount = {};
      if (languageResult && languageResult.length > 0) {
        languageResult.forEach((job) => {
          const languages = JSON.parse(job.language);
          languages.forEach((language) => {
            languageCount[language] = (languageCount[language] || 0) + 1;
          });
        });
      }
      filters[9].option = Object.keys(languageCount).map((language) => ({
        name: language,
        count: languageCount[language],
      }));

      const employeeBenefitsResult = await Jobs.findAll({
        attributes: [
          [
            Sequelize.fn("JSON_UNQUOTE", Sequelize.col("employmentBenefits")),
            "benefits",
          ],
        ],
        where: {
          jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds },
          ...filterValue,
        },
        raw: true,
      });
      const benefitsCount = {};
      if (employeeBenefitsResult && employeeBenefitsResult.length > 0) {
        employeeBenefitsResult.forEach((job) => {
          const benefits = JSON.parse(job.benefits);
          benefits.forEach((benefit) => {
            benefitsCount[benefit] = (benefitsCount[benefit] || 0) + 1;
          });
        });
      }
      filters[5].option = Object.keys(benefitsCount).map((benefit) => ({
        name: benefit,
        count: benefitsCount[benefit],
      }));

      const countryResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("country"), "country_code"],
          [Sequelize.fn("COUNT", Sequelize.col("country")), "count"],
        ],
        where: {
          jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds },
          ...filterValue,
        },
        group: ["country"],
        raw: true,
      });
      if (countryResult && countryResult.length > 0) {
        const path = require("path");
        const countriesDataPath = path.resolve(
          __dirname,
          "../controllers/countries/data/countries.json"
        );
        const countriesData = require(countriesDataPath);

        filters[6].option = countryResult.map((item) => {
          const countryInfo = countriesData.find(
            (country) => country.name === item.country_code
          );

          return {
            country_code: countryInfo ? countryInfo.iso2 : item.country_code,
            country_name: countryInfo ? countryInfo.name : "Unknown",
            count: item.count,
          };
        });
      }

      const stateResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("state"), "state_code"],
          [Sequelize.col("country"), "country_code"],
          [Sequelize.fn("COUNT", Sequelize.col("state")), "count"],
        ],
        where: {
          jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds },
          ...filterValue,
        },
        group: ["state", "country"],
        raw: true,
      });

      if (stateResult && stateResult.length > 0) {
        const path = require("path");
        const statesDataPath = path.resolve(
          __dirname,
          "../controllers/countries/data/states.json"
        );
        const statesData = require(statesDataPath);

        filters[7].option = stateResult.map((item) => {
          const stateInfo = statesData.find(
            (state) =>
              state.state_code === item.state_code &&
              state.country_name === item.country_code
          );
          return {
            country_name: stateInfo
              ? stateInfo.country_name
              : item.country_code,
            state_name: stateInfo ? stateInfo.name : item.state_code,
            count: item.count,
          };
        });
      }

      const cityResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("city"), "name"],
          [Sequelize.col("state"), "state_code"],
          [Sequelize.col("country"), "country_code"],
          [Sequelize.fn("COUNT", Sequelize.col("city")), "count"],
        ],
        where: {
          jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds },
          ...filterValue,
        },
        group: ["city", "state", "country"],
        raw: true,
      });

      if (cityResult && cityResult.length > 0) {
        const path = require("path");
        const stateDataPath = path.resolve(
          __dirname,
          "../controllers/countries/data/states_cities.json"
        );
        const stateData = require(stateDataPath);

        filters[8].option = cityResult.map((item) => {
          const state = stateData.find(
            (state) =>
              state.state_code === item.state_code &&
              state.country_code === item.country_code
          );
          const city = state
            ? state.cities.find((city) => city.name === item.name)
            : null;
          return {
            state_name: state ? state.name : item.state_code,
            city_name: city ? city.name : item.name,
            count: item.count,
          };
        });
      }

      const jobTypeResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("type"), "name"],
          [Sequelize.fn("COUNT", Sequelize.col("type")), "count"],
        ],
        where: {
          jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds },
          ...filterValue,
        },
        group: ["type"],
        raw: true,
      });
      if (jobTypeResult && jobTypeResult.length > 0) {
        filters[10].option = jobTypeResult.map((item) => ({
          name: item.name,
          count: item.count,
        }));
      }

      const appDeadlineTypeResult = await Jobs.findAll({
        attributes: [
          [Sequelize.col("appDeadlineType"), "name"],
          [Sequelize.fn("COUNT", Sequelize.col("appDeadlineType")), "count"],
        ],
        where: {
          jobCategoryId: { [Sequelize.Op.in]: jobCategoryIds },
          ...filterValue,
        },
        group: ["appDeadlineType"],
        raw: true,
      });
      if (appDeadlineTypeResult && appDeadlineTypeResult.length > 0) {
        filters[11].option = appDeadlineTypeResult.map((item) => ({
          name: item.name,
          count: item.count,
        }));
      }
    }

    return { ...categoryData, filters };
  }

  async store(req) {
    return await JobCategory.create(req.body);
  }

  async storeSub(id, req) {
    const category = await JobCategory.findOne({ where: { id } });

    return await category.createChild(req.body);
  }

  async update(id, req) {
    return await JobCategory.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await JobCategory.destroy({ where: { id } });
  }

  //   get the next decendants
  async findDecendant(id) {
    const category = await JobCategory.findOne({ where: { id } });

    return await category.getDescendents();
  }

  //   get the next decendants
  async storeBulk(req) {
    return await JobCategory.bulkCreate(req.body);
  }

  async findBy(by) {
    return await JobCategory.findOne({ where: by });
  }
}

module.exports = new CategoryServices();
