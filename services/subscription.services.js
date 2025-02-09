const { Subscription, User, SubscriptionPlan } = require("../models");

class SubscriptionServices {
  async all() {
    return await Subscription.findAll({
      include: [
        {
          model: User,
          as: "user",
        },

        { model: SubscriptionPlan },
      ],
    });
  }
  async findOne(id) {
    return await Subscription.findOne({ where: { id } });
  }

  async findBy(by) {
    return await Subscription.findAll({
      where: by,
      include: [
        {
          model: User,
          as: "user",
        },

        {
          model: SubscriptionPlan,
        },
      ],
    });
  }

  async findByUserId(userId) {
    return await Subscription.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: SubscriptionPlan,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async store(req) {
    return await Subscription.create(req.body);
  }
  async update(id, req) {
    return await Subscription.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await Subscription.destroy({ where: { id } });
  }

  async changeStatus(userId, subscriptionId, status) {
    return await Subscription.update(
      { status },
      { where: { userId, subscriptionId } }
    );
  }
}

module.exports = new SubscriptionServices();
