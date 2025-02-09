const { Business, Contact, Social } = require("../models");
const bcrypt = require("bcryptjs");

const { Op } = require("sequelize");

function generateFilterValue(query) {
  let filterValue = {
    [Op.or]: [],
  };

  for (let key in query) {
    if (key !== "offset" && key !== "limit") {
      if (Business.getAttributes()[key] !== undefined) {
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

class BusinessServices {
  async all(req, offset, limit) {
    // filter here

    let filterValue = generateFilterValue(req.query);

    return await Business.findAndCountAll({
      where: { ...filterValue },
      include: [
        {
          model: Contact,
          as: "businessContacts",
        },
        {
          model: Social,
          as: "businessSocials",
        },
      ],
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });
  }

  async findOne(id, options = {}) {
    return await Business.findOne({
      where: { id },
      include: [
        {
          model: Contact,
          as: "businessContacts",
        },
        {
          model: Social,
          as: "businessSocials",
        },
      ],
      ...options,
    });
  }

  async store(req, options = {}) {
    const { password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    req.body.password = hashPassword;

    const data = req.body;
    return await Business.create({ ...data, options });
  }

  async update(id, req, options = {}) {
    return await Business.update(req.body, {
      where: { id },
      ...options,
    });
  }

  async destroy(id, options = {}) {
    return await Business.destroy({
      where: { id },
      ...options,
    });
  }

  async getByAttributes(attributes, options = {}) {
    return await Business.findOne({
      where: attributes,
      ...options,
    });
  }

  async findBy(by, options = {}) {
    return await Business.findOne({
      where: by,
      include: [
        {
          model: Contact,
          as: "businessContacts",
        },
        {
          model: Social,
          as: "businessSocials",
        },
      ],
      ...options,
    });
  }

  async findOrCreate(email, value, options = {}) {
    return await Business.findOrCreate({
      where: { email },
      defaults: value,
      ...options,
    });
  }

  async findAllByAdmin(req, by, offset, limit) {
    let filterValue = generateFilterValue(req.query);

    return Business.findAndCountAll({
      where: { ...by, ...filterValue },
      limit,
      offset,
    });
  }
}

module.exports = new BusinessServices();
