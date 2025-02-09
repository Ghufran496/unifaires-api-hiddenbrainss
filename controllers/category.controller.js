const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const categoryServices = require("../services/category.services");
const json_category = require("../data/jobs.json");
const { Category } = require("../models");

exports.index = useAsync(async (req, res, next) => {
  try {
    const categories = await categoryServices.all(req);

    return res.status(200).json(JParser("ok-response", true, categories));
  } catch (error) {
    next(error);
  }
});

exports.course_category = useAsync(async (req, res, next) => {
  try {
    const categories = await categoryServices.courseCategory(req);

    return res.status(200).json(JParser("ok-response", true, categories));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const createCategory = await categoryServices.store(req);

    // get the category
    const category = await categoryServices.findOne(createCategory.id);

    return res.status(201).json(JParser("ok-response", true, category));
  } catch (error) {
    next(error);
  }
});

exports.store_subcategory = useAsync(async (req, res, next) => {
  try {
    const { parentId } = req.body;

    // check if category exist
    const find = await categoryServices.findOne(parentId);

    if (!find) {
      return res.status(404).json(JParser("category not found", false, null));
    }

    const create = await categoryServices.storeSub(parentId, req);

    return res.status(201).json(JParser("ok-response", true, create));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await categoryServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("invalid category", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check is category exist
    const find = await categoryServices.findOne(id);

    if (!find)
      return res.status(404).json(JParser("invalid category", false, null));

    const update = await categoryServices.update(id, req);

    if (update) {
      const category = await categoryServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, category));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check is category exist
    const find = await categoryServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("category not found", false, null));
    }

    const destroy = await categoryServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_subcategory = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const find = await categoryServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.get_descendants = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await categoryServices.findDecendant(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.get_patents = useAsync(async (req, res, next) => {
  try {
    const find = await categoryServices.allParent();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.bulk_store = useAsync(async (req, res, next) => {
  try {
    let { start, end } = req.query;

    const createCategory = async (categoryName) => {
      req.body.name = categoryName;

      return await categoryServices.store(req);
    };

    const createSubcategory = async (parentId, subcategoryName) => {
      req.body.name = subcategoryName;
      return await categoryServices.storeSub(parentId, req);
    };

    const createTopic = async (parentId, topicName) => {
      req.body.name = topicName;
      return await categoryServices.storeSub(parentId, req);
    };

    for (let i = +start; i < +end; i++) {
      let category = json_category[i].Category;
      let subcategory = json_category[i].Subcategory;
      let topic = json_category[i]["Topic, Specialization, Job Title & Skills"];

      let find = await categoryServices.findBy({ name: category });

      if (!find) {
        find = await createCategory(category);
      }

      let isSubcategory = await categoryServices.findBy({ name: subcategory });

      if (!isSubcategory) {
        isSubcategory = await createSubcategory(find.id, subcategory);
      }

      const parentId = isSubcategory.id;

      // check if it exist also

      let isTopic = await categoryServices.findBy({ name: topic });

      if (!isTopic) {
        await createTopic(parentId, topic);
      }
    }

    return res.status(200).json(JParser("categories", true, []));
  } catch (error) {
    next(error);
  }
});

exports.bulk_sub_store = useAsync(async (req, res, next) => {
  try {
    const { parentId } = req.body;

    // check if category exist
    const find = await categoryServices.findOne(parentId);

    if (find) {
      const createSubcategory = await categoryServices.storeSub(parentId, req);

      if (createSubcategory) {
        return res
          .status(201)
          .json(JParser("ok-response", true, createSubcategory));
      } else {
        return res
          .status(400)
          .json(JParser("something went wrong", false, null));
      }
    } else {
      return res.status(400).json(JParser("category not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});
