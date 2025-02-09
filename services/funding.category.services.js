// Models
const { FundingCategory } = require("../models");
const { Op, Sequelize } = require("sequelize");

class CategoryServices {
  async all() {
    return await FundingCategory.findAll({
      hierarchy: true,
      order: [["name", "ASC"]],
    });
  }

  async fundingCategories(req) {
    let filterValue = {};

    const { query } = req;
    for (let key in query) {
      if (key !== "offset" && key !== "limit") {
        if (!!FundingCategory.getAttributes()[key]) {
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

    const categories = await FundingCategory.findAll({
      attributes: [
        "id",
        "parentId",
        "name",
        "createdAt",
        "updatedAt",
        "hierarchyLevel",
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = fundingcategories.id)"
          ),
          "fundingCount",
        ],
      ],
      where: {
        parentId: null,
        [Sequelize.Op.and]: Sequelize.literal(
          "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = fundingcategories.id) > 0"
        ),
        ...filterValue,
      },
      include: [
        {
          model: FundingCategory,
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
                "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = children.id)"
              ),
              "fundingCount",
            ],
          ],
          required: false,
          where: Sequelize.literal(
            "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = children.id) > 0"
          ),
          include: [
            {
              model: FundingCategory,
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
                    "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = children.id)"
                  ),
                  "fundingCount",
                ],
              ],
              required: false,
              where: Sequelize.literal(
                "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = children.id) > 0"
              ),
            },
          ],
        },
        {
          model: FundingCategory,
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
                "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = ancestors.id)"
              ),
              "fundingCount",
            ],
          ],
          required: false,
          where: Sequelize.literal(
            "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = ancestors.id) > 0"
          ),
        },
      ],
      order: [["name", "ASC"]],
    });

    return categories;
  }

  async allParent() {
    return await FundingCategory.findAll({
      where: { parentId: null },
      include: {
        model: FundingCategory,
        as: "children",
      },
    });
  }

  async findOne(id) {
    const categories = await FundingCategory.findAll({
      attributes: [
        "id",
        "parentId",
        "name",
        "createdAt",
        "updatedAt",
        "hierarchyLevel",
        [
          Sequelize.literal(
            "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = fundingcategories.id)"
          ),
          "fundingCount",
        ],
      ],
      where: {
        parentId: null,
        [Sequelize.Op.and]: Sequelize.literal(
          "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = fundingcategories.id) > 0"
        ),
        id,
      },
      include: [
        {
          model: FundingCategory,
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
                "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = children.id)"
              ),
              "fundingCount",
            ],
          ],
          required: false,
          where: Sequelize.literal(
            "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = children.id) > 0"
          ),
          include: [
            {
              model: FundingCategory,
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
                    "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = children.id)"
                  ),
                  "fundingCount",
                ],
              ],
              required: false,
              where: Sequelize.literal(
                "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = children.id) > 0"
              ),
            },
          ],
        },
        {
          model: FundingCategory,
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
                "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = ancestors.id)"
              ),
              "fundingCount",
            ],
          ],
          required: false,
          where: Sequelize.literal(
            "(SELECT COUNT(*) FROM fundings WHERE fundings.fundingcategoryId = ancestors.id) > 0"
          ),
        },
      ],
      order: [["name", "ASC"]],
    });

    return categories;
    // return await FundingCategory.findOne({
    //   where: { id },
    //   include: [
    //     {
    //       model: FundingCategory,
    //       as: "children",
    //     },
    //     { model: FundingCategory, as: "ancestors" },
    //   ],
    // });
  }

  async store(req) {
    return await FundingCategory.create(req.body);
  }

  async storeSub(id, req) {
    const category = await FundingCategory.findOne({ where: { id } });

    return await category.createChild(req.body);
  }

  async update(id, req) {
    return await FundingCategory.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await FundingCategory.destroy({ where: { id } });
  }

  //   get the next decendants
  async findDecendant(id) {
    const category = await FundingCategory.findOne({ where: { id } });

    return await category.getDescendents();
  }

  //   get the next decendants
  async storeBulk(req) {
    return await FundingCategory.bulkCreate(req.body);
  }

  async findBy(by) {
    return await FundingCategory.findOne({ where: by });
  }
}

module.exports = new CategoryServices();
