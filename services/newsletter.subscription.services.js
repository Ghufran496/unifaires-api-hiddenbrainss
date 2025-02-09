const { NewsLetterSubscription } = require("../models");

class NewsLetterSubscriptionServices {
  async all() {
    return await NewsLetterSubscription.findAll();
  }

  async findOne(id) {
    return await NewsLetterSubscription.findOne({ where: { id } });
  }

  async findBy(by) {
    return await NewsLetterSubscription.findOne({ where: by });
  }

  async findAllBy(by) {
    return await NewsLetterSubscription.findOne({ where: by });
  }

  async store(req) {
    return await NewsLetterSubscription.create(req.body);
  }

  async bulkStore(data) {
    return await NewsLetterSubscription.bulkCreate(data);
  }

  async update(id, req) {
    return await NewsLetterSubscription.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await NewsLetterSubscription.destroy({ where: { id } });
  }
}

module.exports = new NewsLetterSubscriptionServices();
