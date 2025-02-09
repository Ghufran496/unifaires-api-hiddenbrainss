const { Tax } = require("./../models");
class TaxServices {
  async all() {
    return await Tax.findAll();
  }
  async findOne(id) {
    return await Tax.findOne({ where: { id } });
  }

  async findBy(by) {
    return await Tax.findOne({ where: by });
  }
  async store(req) {
    return await Tax.create(req.body);
  }
  async update(id, req) {
    return await Tax.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await Tax.destroy({ where: { id } });
  }
}

module.exports = new TaxServices();
