const { AssociateTransactions, AssociateUser } = require("../models");

class AssociateTransactionsServices {
  async all() {
    return await AssociateTransactions.findAll({
      include: [
        {
          model: AssociateUser,
        },
      ],
    });
  }
  async findOne(id) {
    return await AssociateTransactions.findOne({ where: { id } });
  }

  async findAllBy(by) {
    return await AssociateTransactions.findAll({ where: by });
  }

  async store(req) {
    return await AssociateTransactions.create(req.body);
  }
  async update(id, req) {
    return await AssociateTransactions.update(req.body, { where: { id } });
  }
  async destroy(id) {
    return await AssociateTransactions.destroy({ where: { id } });
  }

  async findBy(by) {
    return await AssociateTransactions.findOne({ where: by });
  }
}

module.exports = new AssociateTransactionsServices();
