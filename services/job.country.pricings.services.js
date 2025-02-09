const { JobCountryPricings } = require("../models");
const { Op, Sequelize } = require("sequelize");

class JobCountryPricingsServices {
  async all(req) {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        if (!!JobCountryPricings.getAttributes()[key]) {
          filterValue[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }
    return await JobCountryPricings.findAll({
      where: filterValue,
    });
  }
  async findOne(id) {
    return await JobCountryPricings.findOne({ where: { id } });
  }
  async findBy(by) {
    return await JobCountryPricings.findOne({ where: by });
  }

  async findAllBy(by) {
    return await JobCountryPricings.findOne({ where: by });
  }

  async store(req) {
    return await JobCountryPricings.create(req.body);
  }

  async update(id, req) {
    return await JobCountryPricings.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await JobCountryPricings.destroy({ where: { id } });
  }

  async findBy(by) {
    return await JobCountryPricings.findOne({ where: by });
  }
}

module.exports = new JobCountryPricingsServices();
