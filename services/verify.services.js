class VerifyServices {
  async getAllVerify() {
    return await Verify.findAll();
  }
  async getAllVerifyById(id) {
    return await Verify.findOne({ where: { id } });
  }
  async storeVerify(req) {
    return await Verify.create(req.body);
  }
  async updateVerify(id, req) {
    return await Verify.update(req.body, { where: { id } });
  }
  async deleteVerify(id) {
    return await Verify.destroy({ where: { id } });
  }
}

module.exports = new VerifyServices();
