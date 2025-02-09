const { Earnings, Transactions, User } = require("../models");

function generateFilter(query) {
  let filterValue = {
    [Op.or]: [],
  };

  for (let key in query) {
    if (
      key !== "offset" &&
      key !== "limit" &&
      key !== "from" &&
      key !== "to" &&
      key !== "page"
    ) {
      if (User.getAttributes()[key] !== undefined) {
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

  return filterValue;
}

class EarningsServices {
  async all(req, offset, limit) {
    const filterValue = generateFilter(req.query);

    return await Earnings.findAndCountAll({
      where: { ...filterValue },
      offset,
      limit,
    });
  }

  async findOne(id) {
    return await Earnings.findOne({ where: { id } });
  }

  async findBy(by) {
    return await Earnings.findOne({ where: by });
  }

  async findAllBy(by) {
    return await Earnings.findOne({ where: by });
  }

  async store(req) {
    return await Earnings.create(req.body);
  }

  async update(id, req) {
    return await Earnings.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Earnings.destroy({ where: { id } });
  }

  async userEarnings(req, offset, limit, userId) {
    return await Earnings.findAndCountAll({
      include: [
        {
          model: Transactions,
          include: [
            {
              model: User,
              where: { id: userId },
              as: "user",
            },
          ],
        },
      ],
    });
  }
}

module.exports = new EarningsServices();
