class VatServices {
  async all() {
    return await Vat.findAll();
  }
  async findOne(id) {
    return await Vat.findOne({ where: { id } });
  }
  async store(req) {
    return await Vat.create(req.body);
  }
  async update(id, req) {
    return await Vat.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await Vat.destroy({ where: { id } });
  }
}

module.exports = new VatServices();
