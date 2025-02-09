// Models
const { Industry } = require("../models");
class CategoryServices {
  async all() {
    return await Industry.findAll({ hierarchy: true });
  }

  async allParent() {
    return await Industry.findAll({
      where: { parentId: null },
      include: {
        model: Industry,
        as: "children",
      },
    });
  }

  async findOne(id) {
    return await Industry.findOne({
      where: { id },
      include: [
        {
          model: Industry,
          as: "children",
        },
        { model: Industry, as: "ancestors" },
      ],
    });
  }

  async store(req) {
    const create = await Industry.create(req.body);

    return create;
  }

  async storeSub(id, req) {
    const category = await Industry.findOne({ where: { id } });
    // find and create
    const subCategory = await category.createChild(req.body);

    return subCategory;
  }

  async update(id, req) {
    return await Industry.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Industry.destroy({ where: { id } });
  }

  //   get the next decendants
  async findDecendant(id) {
    const category = await Industry.findOne({ where: { id } });

    const decendants = await category.getDescendents();

    return decendants;
  }

  //   get the next decendants
  async storeBulk(req) {
    return await Industry.bulkCreate(req.body);
  }

  async findBy(by) {
    return await Industry.findOne({ where: by });
  }
}

module.exports = new CategoryServices();
