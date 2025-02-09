// Models
const { Category, Course } = require("../models");

const { Op, Sequelize } = require("sequelize");
const Pricing = require("../models/pricing");
class CategoryServices {
  async all() {
    return Category.findAll({
      hierarchy: true,
    });
  }

  async courseCategory(req) {
    let filterValue = {};

    const { query } = req;
    for (let key in query) {
      if (key !== "offset" && key !== "limit") {
        if (!!Category.getAttributes()[key]) {
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

    const categories = await Category.findAll({
      attributes: [
        "id",
        "parentId",
        "name",
        "createdAt",
        "updatedAt",
        "hierarchyLevel",
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = category.id AND courses.status = 'active' AND pricings.id IS NOT NULL)"
          ),
          "courseCount",
        ],
      ],
      where: {
        // parentId: null,
        [Sequelize.Op.and]: Sequelize.literal(
          "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = category.id AND courses.status = 'active' AND pricings.id IS NOT NULL) > 0"
        ),
        ...filterValue,
      },
      include: [
        {
          model: Category,
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
                "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = children.id AND courses.status = 'active' AND pricings.id IS NOT NULL)"
              ),
              "courseCount",
            ],
          ],
          required: false,
          where: Sequelize.literal(
            "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = children.id AND courses.status = 'active' AND pricings.id IS NOT NULL) > 0"
          ),
          include: [
            {
              model: Category,
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
                    "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = children.id AND courses.status = 'active' AND pricings.id IS NOT NULL)"
                  ),
                  "courseCount",
                ],
              ],
              required: false,
              where: Sequelize.literal(
                "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = children.id AND courses.status = 'active' AND pricings.id IS NOT NULL) > 0"
              ),
            },
          ],
        },
        {
          model: Category,
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
                "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = ancestors.id AND courses.status = 'active' AND pricings.id IS NOT NULL)"
              ),
              "courseCount",
            ],
          ],
          required: false,
          where: Sequelize.literal(
            "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = ancestors.id AND courses.status = 'active' AND pricings.id IS NOT NULL) > 0"
          ),
        },
      ],
      order: [["name", "ASC"]],
    });

    return categories;
  }

  async allParent() {
    return await Category.findAll({
      order: [["name", "ASC"]],
      hierarchy: true,

      where: { parentId: null },
      include: {
        model: Category,
        as: "children",
      },
    });
  }

  async findOne(id) {
    const category = await Category.findOne({
      attributes: [
        "id",
        "parentId",
        "name",
        "createdAt",
        "updatedAt",
        "hierarchyLevel",
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM courses JOIN pricings ON courses.id = pricings.courseId WHERE courses.categoryId = category.id AND courses.status = 'active' AND pricings.id IS NOT NULL)"
          ),
          "courseCount",
        ],
      ],
      where: { id },
      include: [
        {
          model: Category,
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
                "(SELECT COUNT(*) FROM courses WHERE courses.categoryId = children.id)"
              ),
              "courseCount",
            ],
          ],
          required: false,
          where: Sequelize.literal(
            "(SELECT COUNT(*) FROM courses WHERE courses.categoryId = children.id) > 0"
          ),
        },
        {
          model: Category,
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
                "(SELECT COUNT(*) FROM courses WHERE courses.categoryId = ancestors.id)"
              ),
              "courseCount",
            ],
          ],
          required: false,
          where: Sequelize.literal(
            "(SELECT COUNT(*) FROM courses WHERE courses.categoryId = ancestors.id) > 0"
          ),
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return category;
  }

  async store(req) {
    const create = await Category.create(req.body);

    return create;
  }

  async storeSub(id, req) {
    const category = await Category.findOne({ where: { id } });
    // find and create
    const subCategory = await category.createChild(req.body);

    return subCategory;
  }

  async update(id, req) {
    return await Category.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Category.destroy({ where: { id } });
  }

  //   get the next decendants
  async findDecendant(id) {
    const category = await Category.findOne({
      where: { id },
      order: [["createdAt", "ASC"]],
    });

    return await category.getDescendents();
  }

  //   get the next decendants
  async storeBulk(req) {
    return await Category.bulkCreate(req.body);
  }

  async findBy(by) {
    return await Category.findOne({ where: by });
  }
}

module.exports = new CategoryServices();
