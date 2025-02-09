const { Cart, Course, Pricing } = require("../models");

class CartServices {
  async all() {
    return await Cart.findAll({
      include: {
        model: Course,
        include: {
          model: Pricing,
        },
      },
    });
  }
  async findOne(id) {
    return await Cart.findOne({
      where: { id },
      include: {
        model: Course,
        include: {
          model: Pricing,
        },
      },
    });
  }
  async findBy(by) {
    return await Cart.findOne({
      where: by,
      include: {
        model: Course,
        include: {
          model: Pricing,
        },
      },
    });
  }
  async findAllBy(by) {
    return await Cart.findAll({
      where: by,
      include: {
        model: Course,
        include: {
          model: Pricing,
        },
      },
    });
  }
  async store(req) {
    return await Cart.create(req.body);
  }
  async update(id, req) {
    return await Cart.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await Cart.destroy({ where: { id } });
  }
}

module.exports = new CartServices();
