const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const industryServices = require("../services/industry.services");
const json_industry = require("../data/jobs.json");

exports.index = useAsync(async (req, res, next) => {
  try {
    const industries = await industryServices.all();

    return res.status(200).json(JParser("ok-response", true, industries));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const createCategory = await industryServices.store(req);

    // get the industry
    const industry = await industryServices.findOne(createCategory.id);

    return res.status(201).json(JParser("ok-response", true, industry));
  } catch (error) {
    next(error);
  }
});

exports.store_subindustry = useAsync(async (req, res, next) => {
  try {
    const { parentId } = req.body;

    // check if industry exist
    const find = await industryServices.findOne(parentId);

    if (find) {
      const create = await industryServices.storeSub(parentId, req);

      return res.status(201).json(JParser("ok-response", true, create));
    } else {
      return res.status(404).json(JParser("industry not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const find = await industryServices.findOne(id);

    if (find) {
      return res.status(200).json(JParser("ok-response", true, find));
    } else {
      return res.status(404).json(JParser("invalid industry", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check is industry exist
    const find = await industryServices.findOne(id);

    if (!find)
      return res.status(404).json(JParser("invalid industry", false, null));

    const update = await industryServices.update(id, req);

    if (update) {
      const industry = await industryServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, industry));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    // check is industry exist
    const find = await industryServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("industry not found", false, null));
    }

    const destroy = await industryServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_subindustry = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await industryServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("industry not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.get_descendants = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await industryServices.findDecendant(id);

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.get_patents = useAsync(async (req, res, next) => {
  try {
    const find = await industryServices.allParent();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.bulk_store = useAsync(async (req, res, next) => {
  try {
    let { start, end } = req.query;

    const createCategory = async (industryName) => {
      req.body.name = industryName;

      return await industryServices.store(req);
    };

    const createSubindustry = async (parentId, subindustryName) => {
      req.body.name = subindustryName;
      return await industryServices.storeSub(parentId, req);
    };

    const createTopic = async (parentId, topicName) => {
      req.body.name = topicName;
      return await industryServices.storeSub(parentId, req);
    };

    for (let i = +start; i < +end; i++) {
      let industry = json_industry[i].industry;
      let subindustry = json_industry[i].Subindustry;
      let topic = json_industry[i]["Topic, Specialization, Job Title & Skills"];

      let find = await industryServices.findBy({ name: industry });

      if (!find) {
        find = await createCategory(industry);
      }

      let isSubindustry = await industryServices.findBy({ name: subindustry });

      if (!isSubindustry) {
        isSubindustry = await createSubindustry(find.id, subindustry);
      }

      const parentId = isSubindustry.id;

      // check if it exist also

      let isTopic = await industryServices.findBy({ name: topic });

      if (!isTopic) {
        await createTopic(parentId, topic);
      }
    }

    return res.status(200).json(JParser("industries", true, []));
  } catch (error) {
    next(error);
  }
});

exports.bulk_sub_store = useAsync(async (req, res, next) => {
  try {
    const { parentId } = req.body;

    // check if industry exist
    const find = await industryServices.findOne(parentId);

    if (find) {
      const createSubindustry = await industryServices.storeSub(parentId, req);

      if (createSubindustry) {
        return res
          .status(201)
          .json(JParser("ok-response", true, createSubindustry));
      } else {
        return res
          .status(400)
          .json(JParser("something went wrong", false, null));
      }
    } else {
      return res.status(400).json(JParser("industry not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});
