const { Transactions, Course, Jobs, User, Business } = require("../models");
const { Op, Sequelize } = require("sequelize");
const stripe = require("../config/stripe");
const dayjs = require("dayjs");

function generateTransactionFilter(req) {
  let filterValue = {};

  const { query } = req;
  for (let key in query) {
    if (
      key !== "offset" &&
      key !== "limit" &&
      key !== "from" &&
      key !== "to" &&
      key !== "page"
    ) {
      if (!!Transactions.getAttributes()[key]) {
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

  // Handle date filtering
  const from = query.from ? dayjs(query.from).startOf("day").toDate() : null;
  const to = query.to
    ? dayjs(query.to).endOf("day").toDate()
    : dayjs().endOf("day").toDate();

  if (from) {
    filterValue.createdAt = {
      [Op.between]: [from, to],
    };
  }

  return filterValue;
}

// generate user filter for transactions
function generateUserFilter(query) {
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

// generate business filter for transaction
function generateBusinessFilter(query) {
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

class TransactionsServices {
  async all(req, offset, limit) {
    // Generate filter
    let filterValue = {};
    let filterUserValue = generateUserFilter(req.query);
    let filterBusinessValue = generateBusinessFilter(req.query);

    const { query } = req;
    for (let key in query) {
      if (
        key !== "offset" &&
        key !== "limit" &&
        key !== "from" &&
        key !== "to"
      ) {
        if (!!Transactions.getAttributes()[key]) {
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

    // Handle date filtering
    const from = query.from ? dayjs(query.from).startOf("day").toDate() : null;
    const to = query.to
      ? dayjs(query.to).endOf("day").toDate()
      : dayjs().endOf("day").toDate();

    if (from) {
      filterValue.createdAt = {
        [Op.between]: [from, to],
      };
    }

    return await Transactions.findAndCountAll({
      where: { ...filterValue },
      include: [
        {
          model: User,
          as: "user",
          where: { ...filterUserValue },
          required: false,
        },
        {
          model: Business,
          as: "business",
          where: { ...filterBusinessValue },
          required: false,
        },
      ],
      distinct: true,
      offset,
      limit,
    });
  }

  async findOne(id) {
    return await Transactions.findOne({ where: { id } });
  }

  async store(req) {
    return await Transactions.create(req.body);
  }

  async update(id, req) {
    return await Transactions.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Transactions.destroy({ where: { id } });
  }

  async findBy(by) {
    return await Transactions.findOne({
      where: by,
    });
  }
  async findAllBy(by) {
    return await Transactions.findAll({
      where: by,
    });
  }

  async findUserTransaction(req, offset, limit, by) {
    // add filter here

    const filterValue = generateTransactionFilter(req);

    return await Transactions.findAndCountAll({
      distinct: true,
      where: { ...by, ...filterValue },
      offset,
      limit,
    });
  }

  async subscription() {
    return await stripe.subscriptions.list();
  }

  async charges() {
    return await stripe.charges.list();
  }

  async user_subscription(customer_id) {
    return await stripe.subscriptions.list({ customer: customer_id });
  }

  async user_charges(customer_id) {
    return await stripe.charges.list({ customer_id });
  }

  // paid for route

  // all attributes
  async getAllPaidForAttributes() {
    const attributes = ["paidFor"];

    const results = {};

    for (const attribute of attributes) {
      results[attribute] = await Transactions.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col(attribute)), attribute],
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

module.exports = new TransactionsServices();
