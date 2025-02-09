const { FundingEnrol, User, Funding } = require("../models");
const { Op } = require("sequelize");

class FundingEnrolServices {
  async all(req, offset, limit) {
    // paginate it

    let fundingEnrolFilter = {};
    let fundingsFilter = {};

    const fundingEnrolAttributes = FundingEnrol.getAttributes();
    const fundingsAttributes = Funding.getAttributes();

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        // Check if the key exists in fundingEnrol model's attributes
        if (fundingEnrolAttributes[key]) {
          fundingEnrolFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }

        // Check if the key exists in fundings model's attributes
        if (fundingsAttributes[key]) {
          fundingsFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }

    return await FundingEnrol.findAndCountAll({
      distinct: true,
      where: fundingEnrolFilter,
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Funding,
          where: fundingsFilter,
        },
      ],
      limit,
      offset,
    });
  }

  async findOne(id) {
    return await FundingEnrol.findOne({
      where: { id },
      include: [{ model: User, as: "user" }, { model: Funding }],
    });
  }

  async findAllBy(by) {
    return await FundingEnrol.findAll({
      where: by,
      include: [{ model: User, as: "user" }, Funding],
    });
  }

  async findBy(by) {
    return await FundingEnrol.findOne({
      where: by,
      include: [{ model: User, as: "user" }, Funding],
    });
  }

  async store(req) {
    return await FundingEnrol.create(req.body);
  }

  async update(id, req) {
    return await FundingEnrol.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await FundingEnrol.destroy({ where: { id } });
  }

  async findBusinessFundings(businessId, offset, limit, req) {
    // paginate it

    let fundingEnrolFilter = {};
    let fundingsFilter = {};

    const fundingEnrolAttributes = FundingEnrol.getAttributes();
    const fundingsAttributes = Funding.getAttributes();

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        // Check if the key exists in fundingEnrol model's attributes
        if (fundingEnrolAttributes[key]) {
          fundingEnrolFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }

        // Check if the key exists in fundings model's attributes
        if (fundingsAttributes[key]) {
          fundingsFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }

    return await Funding.findAndCountAll({
      distinct: true,
      where: { businessId, ...fundingsFilter },
      include: [
        {
          model: FundingEnrol,
          where: fundingEnrolFilter,
        },
      ],
      offset,
      limit,
    });
  }

  async findUserFunding(userId, offset, limit, req) {
    // paginate it

    let fundingEnrolFilter = {};
    let fundingsFilter = {};

    const fundingEnrolAttributes = FundingEnrol.getAttributes();
    const fundingsAttributes = Funding.getAttributes();

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        // Check if the key exists in fundingEnrol model's attributes
        if (fundingEnrolAttributes[key]) {
          fundingEnrolFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }

        // Check if the key exists in fundings model's attributes
        if (fundingsAttributes[key]) {
          fundingsFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }

    return await FundingEnrol.findAndCountAll({
      distinct: true,
      where: { userId, ...fundingEnrolFilter },
      include: [
        {
          model: Funding,
          where: fundingsFilter,
        },
      ],
      offset,
      limit,
    });
  }

  async findMyEnrolFunding(userId, offset, limit, req) {
    // paginate it

    let fundingEnrolFilter = {};
    let fundingsFilter = {};

    const fundingEnrolAttributes = FundingEnrol.getAttributes();
    const fundingsAttributes = Funding.getAttributes();

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        // Check if the key exists in fundingEnrol model's attributes
        if (fundingEnrolAttributes[key]) {
          fundingEnrolFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }

        // Check if the key exists in fundings model's attributes
        if (fundingsAttributes[key]) {
          fundingsFilter[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }

    return await FundingEnrol.findAndCountAll({
      distinct: true,
      where: { userId, ...fundingEnrolFilter },
      include: [
        {
          model: Funding,
          where: fundingsFilter,
        },
      ],
      offset,
      limit,
    });
  }
}

module.exports = new FundingEnrolServices();
