// Models
const { Skills, Course, Jobs, Pricing, JobsSkills } = require("../models");
const { Sequelize, Op } = require("sequelize");
class SkillsServices {
  async all() {
    return await Skills.findAll({ hierarchy: true });
  }

  async courseSkills(req) {
    let filterValue = {};

    const { query } = req;
    for (let key in query) {
      if (key !== "offset" && key !== "limit") {
        if (!!Skills.getAttributes()[key]) {
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

    const skills = await Skills.findAll({
      attributes: [
        "id",
        "parentId",
        "name",
        "createdAt",
        "updatedAt",
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM coursesskills 
              INNER JOIN courses ON coursesskills.courseId = courses.id 
              INNER JOIN pricings ON courses.id = pricings.courseId 
              WHERE coursesskills.skillId = skills.id 
              AND courses.status = 'active' 
              AND pricings.id IS NOT NULL)`
          ),
          "courseCount",
        ],
      ],
      where: {
        ...filterValue,
      },
      include: [
        {
          model: Skills,
          as: "descendents",
          hierarchy: true,
          attributes: [
            "id",
            "parentId",
            "name",
            "createdAt",
            "updatedAt",
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM coursesskills 
                  INNER JOIN courses ON coursesskills.courseId = courses.id 
                  INNER JOIN pricings ON courses.id = pricings.courseId 
                  WHERE coursesskills.skillId = descendents.id 
                  AND courses.status = 'active' 
                  AND pricings.id IS NOT NULL)`
              ),
              "courseCount",
            ],
          ],
        },
        {
          model: Course,
          as: "courses",
          attributes: [],
          where: {
            status: "active",
          },
          include: [
            {
              model: Pricing,
              where: {
                id: { [Sequelize.Op.ne]: null },
              },
              required: true,
            },
          ],
          required: true,
        },
      ],
      having: Sequelize.literal("courseCount > 0"),
      order: [["name", "ASC"]],
    });

    return skills;
  }

  // new job skills
  async jobsSkills(req) {
    let filterValue = {};

    const { query } = req;
    for (let key in query) {
      if (key !== "offset" && key !== "limit") {
        if (!!Skills.getAttributes()[key]) {
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

    const skills = await Skills.findAll({
      attributes: [
        "id",
        "parentId",
        "name",
        "createdAt",
        "updatedAt",
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM jobsskills 
              INNER JOIN jobs ON jobsskills.jobId = jobs.id 
              WHERE jobsskills.skillId = skills.id 
              AND jobs.status = 'opened')`
          ),
          "jobCounts",
        ],
      ],
      where: {
        ...filterValue,
      },
      include: [
        {
          model: Skills,
          as: "descendents",
          hierarchy: true,
          attributes: [
            "id",
            "parentId",
            "name",
            "createdAt",
            "updatedAt",
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM jobsskills 
                  INNER JOIN jobs ON jobsskills.jobId = jobs.id 
                  WHERE jobsskills.skillId = skills.id 
                  AND jobs.status = 'opened')`
              ),
              "jobCounts",
            ],
          ],
        },
        {
          model: Jobs,
          as: "jobs",
          attributes: [],
          where: {
            status: "opened",
          },

          required: true,
        },
      ],
      having: Sequelize.literal("jobCounts > 0"),
      order: [["name", "ASC"]],
    });

    return skills;
  }

  async allParent() {
    return await Skills.findAll({
      where: { parentId: null },
      include: {
        model: Skills,
        as: "children",
      },
    });
  }

  async findOne(id) {
    return await Skills.findOne({
      where: { id },
      include: [
        {
          model: Skills,
          as: "children",
        },
        { model: Skills, as: "ancestors" },
      ],
    });
  }

  async store(req) {
    const create = await Skills.create(req.body);

    return create;
  }

  async storeSub(id, req) {
    const category = await Skills.findOne({ where: { id } });
    // find and create
    const subCategory = await category.createChild(req.body);

    return subCategory;
  }

  async update(id, req) {
    return await Skills.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Skills.destroy({ where: { id } });
  }

  //   get the next decendants
  async findDecendant(id) {
    const category = await Skills.findOne({ where: { id } });

    const decendants = await category.getDescendents();

    return decendants;
  }

  //   get the next decendants
  async storeBulk(req) {
    return await Skills.bulkCreate(req.body);
  }

  async findBy(by) {
    return await Skills.findOne({ where: by });
  }
}

module.exports = new SkillsServices();
