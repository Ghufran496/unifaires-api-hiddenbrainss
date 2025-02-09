const { SubscriptionPlan } = require("../models");

class SubscriptionPlanServices {
  async all() {
    return await SubscriptionPlan.findAll();
  }

  async findOne(id) {
    return await SubscriptionPlan.findOne({ where: { id } });
  }

  async findBy(by) {
    return await SubscriptionPlan.findOne({ where: by });
  }

  async store(req) {
    return await SubscriptionPlan.create(req.body);
  }

  async update(id, req) {
    return await SubscriptionPlan.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await SubscriptionPlan.destroy({ where: { id } });
  }
}

module.exports = new SubscriptionPlanServices();
