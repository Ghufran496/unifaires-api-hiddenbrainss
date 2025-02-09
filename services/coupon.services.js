const { Coupon } = require("../models");
const { Op } = require("sequelize");
class CouponServices {
  async all({ offset, limit }) {
    // change any coupon that has expired to expired status
    await Coupon.update(
      { status: "expired" },
      {
        where: {
          expirationDate: { [Op.lt]: new Date() },
          status: "active",
        },
      }
    );

    return await Coupon.findAndCountAll({
      distinct: true,
      offset,
      limit,
    });
  }

  async findOne(id) {
    return await Coupon.findOne({ where: { id } });
  }

  async findBy(by) {
    return await Coupon.findOne({ where: by });
  }

  async findAllBy(by) {
    return await Coupon.findOne({ where: by });
  }

  async store(req) {
    return await Coupon.create(req.body);
  }

  async update(id, req) {
    return await Coupon.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Coupon.destroy({ where: { id } });
  }
}

module.exports = new CouponServices();
