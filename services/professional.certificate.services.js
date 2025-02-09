const { ProfessionalCertificate, User } = require("../models");

class ProfessionalCertificateServices {
  async all() {
    return await ProfessionalCertificate.findAll({
      include: [
        {
          model: User,
        },
      ],
    });
  }

  async findOne(id) {
    return await ProfessionalCertificate.findOne({
      where: { id },
      include: [
        {
          model: User,
        },
      ],
    });
  }

  async findBy(by) {
    return await ProfessionalCertificate.findOne({
      where: by,
      include: [
        {
          model: User,
        },
      ],
    });
  }

  async findAllBy(by) {
    return await ProfessionalCertificate.findAll({
      where: by,
      include: [
        {
          model: User,
        },
      ],
    });
  }

  async store(req) {
    return await ProfessionalCertificate.bulkCreate(req.body);
  }

  async update(id, req) {
    return await ProfessionalCertificate.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await ProfessionalCertificate.destroy({ where: { id } });
  }
}

module.exports = new ProfessionalCertificateServices();
