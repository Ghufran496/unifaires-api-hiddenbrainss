const { CourseCountryPricing } = require("../models");
const { Op, Sequelize } = require("sequelize");

class CourseCountryPricingsServices {
  async all(req) {
    let filterValue = {};

    for (let key in req.query) {
      if (key !== "offset" && key !== "limit") {
        if (!!CourseCountryPricing.getAttributes()[key]) {
          filterValue[key] = {
            [Op.like]: `%${req.query[key]}%`,
          };
        }
      }
    }
    return await CourseCountryPricing.findAll({
      where: filterValue,
    });
  }
  async findOne(id) {
    return await CourseCountryPricing.findOne({ where: { id } });
  }
  async findBy(by) {
    return await CourseCountryPricing.findOne({ where: by });
  }

  async findAllBy(by) {
    return await CourseCountryPricing.findOne({ where: by });
  }

  async store(req) {
    return await CourseCountryPricing.create(req.body);
  }

  async update(id, req) {
    return await CourseCountryPricing.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await CourseCountryPricing.destroy({ where: { id } });
  }

  async findBy(by) {
    return await CourseCountryPricing.findOne({ where: by });
  }
}

module.exports = new CourseCountryPricingsServices();
