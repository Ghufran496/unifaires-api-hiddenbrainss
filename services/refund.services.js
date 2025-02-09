const { Refund, Transactions, User } = require("../models");

class RefundServices {
  async all(req, offset, limit) {
    return await Refund.findAndCountAll({
      offset,
      limit,
    });
  }

  async findOne(id) {
    return await Refund.findOne({ where: { id } });
  }

  async findBy(by) {
    return await Refund.findOne({ where: by });
  }

  async findAllBy(by) {
    return await Refund.findOne({ where: by });
  }

  async store(req) {
    return await Refund.create(req.body);
  }

  async update(id, req) {
    return await Refund.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Refund.destroy({ where: { id } });
  }

  async userRefund(req, offset, limit, userId) {
    return await Refund.findAndCountAll({
      include: [
        {
          model: Transactions,
          include: [
            {
              model: User,
              where: { id: userId },
              as: "user",
            },
          ],
        },
      ],
    });
  }
}

module.exports = new RefundServices();
