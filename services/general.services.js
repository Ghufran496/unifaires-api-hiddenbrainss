const {
  Course,
  Jobs,
  Funding,
  User,
  Business,
  Category,
  JobCategory,
  FundingCategory,
} = require("../models");
const { Op } = require("sequelize");

class GeneralServices {
  async all(query, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const where = query
      ? {
          title: {
            [Op.like]: `%${query}%`,
          },
        }
      : {};

    const searchResults = await Promise.all([
      Course.findAndCountAll({
        distinct: true,
        where: where,
        limit,
        offset,
        include: [
          {
            model: Category,
            include: [{ model: Category, as: "ancestors" }],
            order: [[{ model: Category, as: "ancestors" }, "hierarchyLevel"]],
          },
        ],
      }),
      Jobs.findAndCountAll({
        distinct: true,
        where: where,
        limit,
        offset,
        include: [
          {
            model: JobCategory,
            include: [{ model: JobCategory, as: "ancestors" }],
            order: [
              [{ model: JobCategory, as: "ancestors" }, "hierarchyLevel"],
            ],
          },
        ],
      }),
      Funding.findAndCountAll({
        distinct: true,
        where: where,
        limit,
        offset,
        include: [
          {
            model: FundingCategory,
            as: "fundingCategory",
            include: [{ model: FundingCategory, as: "ancestors" }],
            order: [
              [{ model: FundingCategory, as: "ancestors" }, "hierarchyLevel"],
            ],
          },
        ],
      }),
    ]);

    let totalItems = 0;

    const combinedResults = [];

    searchResults.forEach(({ rows, count }, index) => {
      totalItems += count;

      const modelLabel = [Course, Jobs, Funding][index].name;

      rows.forEach((item) =>
        combinedResults.push({ ...item.toJSON(), model: modelLabel })
      );
    });

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      results: combinedResults,
    };
  }

  async searchName(query, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const whereUser = query
      ? {
          [Op.or]: [
            { firstname: { [Op.like]: `%${query}%` } },
            { lastname: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
          ],
        }
      : {};

    const whereBusiness = query
      ? {
          [Op.or]: [
            { companyName: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
          ],
        }
      : {};

    const searchResults = await Promise.all([
      User.findAndCountAll({ where: whereUser, limit, offset, distinct: true }),
      Business.findAndCountAll({
        where: whereBusiness,
        limit,
        offset,
        distinct: true,
      }),
    ]);

    let totalItems = 0;

    const combinedResults = [];

    searchResults.forEach(({ rows, count }, index) => {
      totalItems += count;

      const modelLabel = index === 0 ? "User" : "Business";

      rows.forEach((item) =>
        combinedResults.push({ ...item.toJSON(), model: modelLabel })
      );
    });

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      results: combinedResults,
    };
  }

  async searchNameChat(req, query, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    let userId = null;
    let businessId = null;

    if (req.user) {
      userId = req.user.id;
    } else if (req.business) {
      businessId = req.business.id;
    }

    const whereUser = query
      ? {
          [Op.and]: [
            {
              [Op.or]: [
                { firstname: { [Op.like]: `%${query}%` } },
                { lastname: { [Op.like]: `%${query}%` } },
                { email: { [Op.like]: `%${query}%` } },
              ],
            },
            userId ? { id: { [Op.ne]: userId } } : {},
          ],
        }
      : userId
      ? { id: { [Op.ne]: userId } }
      : {};

    const whereBusiness = query
      ? {
          [Op.and]: [
            {
              [Op.or]: [
                { companyName: { [Op.like]: `%${query}%` } },
                { email: { [Op.like]: `%${query}%` } },
              ],
            },
            businessId ? { id: { [Op.ne]: businessId } } : {},
          ],
        }
      : businessId
      ? { id: { [Op.ne]: businessId } }
      : {};

    const searchResults = await Promise.all([
      User.findAndCountAll({ where: whereUser, limit, offset, distinct: true }),
      Business.findAndCountAll({
        where: whereBusiness,
        limit,
        offset,
        distinct: true,
      }),
    ]);

    let totalItems = 0;

    const combinedResults = [];

    searchResults.forEach(({ rows, count }, index) => {
      totalItems += count;

      const modelLabel = index === 0 ? "User" : "Business";

      rows.forEach((item) =>
        combinedResults.push({ ...item.toJSON(), model: modelLabel })
      );
    });

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      results: combinedResults,
    };
  }
}

module.exports = new GeneralServices();
