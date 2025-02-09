const { FundingCountryPricing } = require("../models");
const { Op, Sequelize } = require("sequelize");

class JobCountryPricingsServices {
  async all(req) {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        if (!!FundingCountryPricing.getAttributes()[key]) {
          filterValue[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }
    return await FundingCountryPricing.findAll({
      where: filterValue,
    });
  }
  async findOne(id) {
    return await FundingCountryPricing.findOne({ where: { id } });
  }
  async findBy(by) {
    return await FundingCountryPricing.findOne({ where: by });
  }

  async findAllBy(by) {
    return await FundingCountryPricing.findOne({ where: by });
  }

  async store(req) {
    return await FundingCountryPricing.create(req.body);
  }

  async update(id, req) {
    return await FundingCountryPricing.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await FundingCountryPricing.destroy({ where: { id } });
  }

  async findBy(by) {
    return await FundingCountryPricing.findOne({ where: by });
  }
}

module.exports = new JobCountryPricingsServices();
