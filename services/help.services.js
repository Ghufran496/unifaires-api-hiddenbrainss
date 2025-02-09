// const { generateFilterQuery } = require("../helpers/filter.helper");
const { Help, HelpTrack } = require("../models");
const { Op } = require("sequelize");

function generateFilterQuery(req, Model) {
  const { query } = req;
  let filterValue = {};

  for (let key in query) {
    if (key !== "offset" && key !== "limit") {
      if (!!Model.getAttributes()[key]) {
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

  if (query.days) {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(query.days, 10));
    filterValue.createdAt = {
      [Op.gte]: daysAgo,
    };
  }

  return filterValue;
}

class HelpServices {
  async all(req, offset, limit) {
    let filterValue = generateFilterQuery(req, Help);

    return await Help.findAndCountAll({
      distinct: true,
      where: { ...filterValue },
      include: {
        model: HelpTrack,
      },
      offset,
      limit,
    });
  }

  async findOne(id) {
    return await Help.findOne({
      where: { id },
      include: {
        model: HelpTrack,
      },
    });
  }

  async findBy(by) {
    return await Help.findOne({
      where: by,
      include: {
        model: HelpTrack,
      },
    });
  }

  async findAllBy(by) {
    return await Help.findAll({
      where: by,
      include: includeClause,
    });
  }

  async findAllUserHelp(req, query) {
    let filterValue = generateFilterQuery(req, Help);

    let whereClause = {
      ...filterValue,
    };

    if (query.email && query.userId) {
      whereClause[Op.or] = [{ email: query.email }, { userId: query.userId }];
    } else {
      if (query.email) {
        whereClause.email = query.email;
      }
      if (query.userId) {
        whereClause.userId = query.userId;
      }
      if (query.businessId) {
        whereClause.businessId = query.businessId;
      }
    }

    return await Help.findAll({
      where: whereClause,
      include: [
        {
          model: HelpTrack,
        },
      ],
    });
  }

  async store(req) {
    return await Help.create(req.body);
  }

  async update(id, req) {
    return await Help.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Help.destroy({ where: { id } });
  }

  async getAllHelpByStatus(status) {
    if (status === null || status === "pending") {
      return await Help.findAll({
        include: [
          {
            model: HelpTrack,
          },
        ],
        where: {
          [Op.or]: {
            "$helptracks.helpId$": { [Op.is]: null },
            "$helptracks.status$": "pending",
          },
          // Filter where "HelpTrack" is null
        },
      });
    } else {
      return await Help.findAll({
        include: {
          model: HelpTrack,
          where: {
            status: status,
          },
        },
      });
    }
  }
}

module.exports = new HelpServices();
