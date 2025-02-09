const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const fundingCategoryServices = require("../services/funding.category.services");
const funding_category = require("../data/funding.json");

exports.index = useAsync(async (req, res, next) => {
  try {
    const categories = await fundingCategoryServices.all(req);

    return res.status(200).json(JParser("ok-response", true, categories));
  } catch (error) {
    next(error);
  }
});

exports.funding_categories = useAsync(async (req, res, next) => {
  try {
    const categories = await fundingCategoryServices.fundingCategories(req);

    return res.status(200).json(JParser("ok-response", true, categories));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { name } = req.body;

    const find = await fundingCategoryServices.findBy({ name });

    if (find) {
      return res.status(200).json(JParser(`${name} already exist`, true, find));
    }

    const create = await fundingCategoryServices.store(req);

    return res.status(201).json(JParser("ok-response", true, create));
  } catch (error) {
    next(error);
  }
});

exports.store_subcategory = useAsync(async (req, res, next) => {
  try {
    const { parentId } = req.body;

    // check if category exist
    const find = await fundingCategoryServices.findOne(parentId);

    if (find) {
      const create = await fundingCategoryServices.storeSub(parentId, req);

      return res.status(201).json(JParser("ok-response", true, create));
    } else {
      return res.status(404).json(JParser("category not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const find = await fundingCategoryServices.findOne(id);

    if (find) {
      return res.status(200).json(JParser("ok-response", true, find));
    } else {
      return res.status(404).json(JParser("invalid category", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check is category exist
    const find = await fundingCategoryServices.findOne(id);

    if (!find)
      return res.status(404).json(JParser("invalid category", false, null));

    const update = await fundingCategoryServices.update(id, req);

    if (update) {
      const category = await fundingCategoryServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, category));
    } else {
      return res.status(200).json(JParser("something went wrong", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check is category exist
    const find = await fundingCategoryServices.findOne(id);

    if (find) {
      const destroy = await fundingCategoryServices.destroy(id);

      if (destroy) {
        return res.status(204).json(JParser("ok-response", true, null));
      }
    } else {
      return res.status(404).json(JParser("category not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_subcategory = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const subcategory = await fundingCategoryServices.findOne(id);

    if (subcategory) {
      return res.status(200).json(JParser("ok-response", true, subcategory));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_descendants = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const subcategory = await fundingCategoryServices.findDecendant(id);

    return res.status(200).json(JParser("ok-response", true, subcategory));
  } catch (error) {
    next(error);
  }
});

exports.get_patents = useAsync(async (req, res, next) => {
  try {
    const find = await fundingCategoryServices.allParent();

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

      return await fundingCategoryServices.store(req);
    };

    const createSubcategory = async (parentId, subcategoryName) => {
      req.body.name = subcategoryName;
      return await fundingCategoryServices.storeSub(parentId, req);
    };

    const createTopic = async (parentId, topicName) => {
      req.body.name = topicName;
      return await fundingCategoryServices.storeSub(parentId, req);
    };

    for (let i = +start; i < +end; i++) {
      let category = funding_category[i].Category;
      let subcategory = funding_category[i].Subcategory;
      let topic =
        funding_category[i]["Topic, Specialization, Job Title & Skills"];

      let find = await fundingCategoryServices.findBy({ name: category });

      if (!find) {
        find = await createCategory(category);
      }

      let isSubcategory = await fundingCategoryServices.findBy({
        name: subcategory,
      });

      if (!isSubcategory) {
        isSubcategory = await createSubcategory(find.id, subcategory);
      }

      const parentId = isSubcategory.id;

      // check if it exist also

      let isTopic = await fundingCategoryServices.findBy({ name: topic });

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
    const find = await fundingCategoryServices.findOne(parentId);

    if (find) {
      const createSubcategory = await fundingCategoryServices.storeSub(
        parentId,
        req
      );

      return res
        .status(201)
        .json(JParser("ok-response", true, createSubcategory));
    } else {
      return res.status(400).json(JParser("category not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});
