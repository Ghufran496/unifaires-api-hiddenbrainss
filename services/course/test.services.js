const { Test } = require("../../models");

class TestServices {
  async getAllTest() {
    return await Test.findAll();
  }
  async getAllTestById(id) {
    return await Test.findOne({ where: { id } });
  }
  async storeTest(req) {
    return await Test.create(req.body);
  }
  async updateTest(id, req) {
    return await Test.update(req.body, { where: { id } });
  }
  async deleteTest(id) {
    return await Test.destroy({ where: { id } });
  }
}

module.exports = new TestServices();
