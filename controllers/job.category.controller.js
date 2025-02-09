const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const jobCategoryServices = require("../services/job.category.services");
const json_category = require("../data/jobs.json");
// const { uploadCourseCategory } = require('../data/upload.courses');

exports.index = useAsync(async (req, res, next) => {
  try {
    const categories = await jobCategoryServices.all(req);

    return res.status(200).json(JParser("ok-response", true, categories));
  } catch (error) {
    next(error);
  }
});

exports.jobs_category = useAsync(async (req, res, next) => {
  try {
    const categories = await jobCategoryServices.jobCategories(req);

    return res.status(200).json(JParser("ok-response", true, categories));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { name } = req.body;

    const find = await jobCategoryServices.findBy({ name });

    if (!find) {
      const create = await jobCategoryServices.store(req);

      // get the category
      const category = await jobCategoryServices.findOne(create.id);

      return res.status(201).json(JParser("ok-response", true, category));
    } else {
      return res.status(200).json(JParser(`${name} already exist`, true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.store_subcategory = useAsync(async (req, res, next) => {
  try {
    const { parentId } = req.body;

    // check if category exist
    const find = await jobCategoryServices.findOne(parentId);

    if (find) {
      const create = await jobCategoryServices.storeSub(parentId, req);

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
    const find = await jobCategoryServices.findOne(id);
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
    const find = await jobCategoryServices.findOne(id);

    if (!find)
      return res.status(404).json(JParser("invalid category", false, null));

    const update = await jobCategoryServices.update(id, req);

    if (update) {
      const category = await jobCategoryServices.findOne(id);

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
    const find = await jobCategoryServices.findOne(id);

    if (find) {
      const destroy = await jobCategoryServices.destroy(id);

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
    const subcategory = await jobCategoryServices.findOne(id);

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
    const subcategory = await jobCategoryServices.findDecendant(id);

    return res.status(200).json(JParser("ok-response", true, subcategory));
  } catch (error) {
    next(error);
  }
});

exports.get_patents = useAsync(async (req, res, next) => {
  try {
    const find = await jobCategoryServices.allParent();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.seed_store = useAsync(async (req, res, next) => {
  try {
    for (const job of json_category) {
      const { Major, Category, Subcategory, SubcategoryofSubcategory } = job;

      // Handle Major Category (Hierarchy Level 1)
      let major = await jobCategoryServices.findBy({ name: Major });
      if (!major) {
        major = await jobCategoryServices.store({
          body: { name: Major, hierarchyLevel: 1 },
        });
      }

      // Handle Category under Major (Hierarchy Level 2)
      let category = await jobCategoryServices.findBy({
        name: Category,
        parentId: major.id, // Ensure parent ID is checked for scoping
      });
      if (!category) {
        category = await jobCategoryServices.store({
          body: { name: Category, parentId: major.id, hierarchyLevel: 2 },
        });
      }

      // Handle Subcategory under Category (Hierarchy Level 3)
      let subcategory = await jobCategoryServices.findBy({
        name: Subcategory,
        parentId: category.id, // Ensure parent ID is checked for scoping
      });
      if (!subcategory) {
        subcategory = await jobCategoryServices.store({
          body: { name: Subcategory, parentId: category.id, hierarchyLevel: 3 },
        });
      }

      // Handle SubcategoryofSubcategory under Subcategory (Hierarchy Level 4)
      if (SubcategoryofSubcategory && SubcategoryofSubcategory.trim() !== "") {
        let subSubcategory = await jobCategoryServices.findBy({
          name: SubcategoryofSubcategory,
          parentId: subcategory.id, // Ensure parent ID is checked for scoping
        });
        if (!subSubcategory) {
          subSubcategory = await jobCategoryServices.store({
            body: {
              name: SubcategoryofSubcategory,
              parentId: subcategory.id,
              hierarchyLevel: 4,
            },
          });
        }
      }
    }

    return res
      .status(200)
      .json(JParser("job category seeded successfully", true, []));
  } catch (error) {
    console.error("Error during seed_store:", error);
    next(error);
  }
});

exports.bulk_store = useAsync(async (req, res, next) => {
  try {
    let { start, end } = req.query;

    const createCategory = async (categoryName) => {
      req.body.name = categoryName;

      return await jobCategoryServices.store(req);
    };

    const createSubcategory = async (parentId, subcategoryName) => {
      req.body.name = subcategoryName;
      return await jobCategoryServices.storeSub(parentId, req);
    };

    const createTopic = async (parentId, topicName) => {
      req.body.name = topicName;
      return await jobCategoryServices.storeSub(parentId, req);
    };

    for (let i = +start; i < +end; i++) {
      let category = json_category[i].Category;
      let subcategory = json_category[i].Subcategory;
      let topic = json_category[i]["Topic, Specialization, Job Title & Skills"];

      let find = await jobCategoryServices.findBy({ name: category });

      if (!find) {
        find = await createCategory(category);
      }

      let isSubcategory = await jobCategoryServices.findBy({
        name: subcategory,
      });

      if (!isSubcategory) {
        isSubcategory = await createSubcategory(find.id, subcategory);
      }

      const parentId = isSubcategory.id;

      // check if it exist also

      let isTopic = await jobCategoryServices.findBy({ name: topic });

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
    const find = await jobCategoryServices.findOne(parentId);

    if (find) {
      const createSubcategory = await jobCategoryServices.storeSub(
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
