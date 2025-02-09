// Models
const { Language } = require("../models");

class LanguagesServices {
  async getAllLanguages() {
    return await Language.findAll();
  }
  async getLanguageById(id) {
    return await Language.findOne({ where: { id } });
  }

  async getLanguageByName(name) {
    return await Language.findOne({ where: { Language: name } });
  }

  async storeLanguages(req) {
    return await Language.create(req.body);
  }
  async updateLanguages(id, req) {
    return await Language.update(req.body, { where: { id } });
  }

  async deleteLanguages(id) {
    return await Language.destroy({ where: { id } });
  }
}

module.exports = new LanguagesServices();
