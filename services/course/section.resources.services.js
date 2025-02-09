const { SectionResource } = require("../../models");

class SectionResourceServices {
  async getAllSectionResource() {
    return await SectionResource.findAll();
  }
  async getAllSectionResourceById(id) {
    return await SectionResource.findOne({ where: { id } });
  }
  async storeSectionResource(req) {
    return await SectionResource.create(req.body);
  }
  async updateSectionResource(id, req) {
    return await SectionResource.update(req.body, { where: { id } });
  }
  async deleteSectionResource(id) {
    return await SectionResource.destroy({ where: { id } });
  }
}

module.exports = new SectionResourceServices();
