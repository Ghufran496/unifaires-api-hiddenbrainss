const { where } = require("sequelize");
const { Token } = require("../models");

class TokenServices {
  async all() {
    return await Token.findAll();
  }

  async findOne(id) {
    return await Token.findOne({ where: { id } });
  }

  async findBy(by) {
    return await Token.findOne({ where: by });
  }

  async store(data) {
    return await Token.create({
      token: data.token,
      email: data.email || null,
      userId: data.userId || null,
      businessId: data.businessId || null,
      expiredAt: data.expiredAt,
    });
  }

  async update(id, req) {
    return await Token.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await Token.destroy({ where: { id } });
  }

  async changeUserStatus(userId, status) {
    return await Token.update(
      {
        status,
        userId,
      },
      { where: { userId } }
    );
  }

  async changeBusinessStatus(businessId, status) {
    return await Token.update(
      {
        status,
        businessId,
      },
      { where: { businessId } }
    );
  }
  async verify(email, userId) {
    // verify the token for both business and userId

    if (userId)
      return await Token.findOne({
        where: {
          [Op.or]: [{ email }, { userId }],
        },
      });
  }
}

module.exports = new TokenServices();
