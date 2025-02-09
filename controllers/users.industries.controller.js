const { useAsync, utils } = require("./../core");
const { JParser } = require("../core/core.utils");
const usersIndustriesServices = require("../services/users.industries.services");
const IndustryServices = require("../services/industry.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await usersIndustriesServices.all();

    return res.status(200).json(JParser("ok-response", true, all));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { industriesId } = req.body;

    if (req.user) {
      const { id: userId } = req.user;

      req.body.userId = userId;
    } else if (req.business) {
      const { id: businessId } = req.business;

      req.body.businessId = businessId;
    }

    const createdIndustries = [];

    for (const industryId of industriesId) {
      const find = await IndustryServices.findOne(industryId);

      if (find) {
        const create = await usersIndustriesServices.store({
          body: { ...req.body, industryId },
        });
        createdIndustries.push(create);
      }
    }

    return res
      .status(201)
      .json(JParser("ok-response", true, createdIndustries));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await usersIndustriesServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("industries not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await usersIndustriesServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("industries not found", false, null));
    }

    const update = await usersIndustriesServices.update(id, req);

    if (update) {
      const find = await usersIndustriesServices.findOne(id);
      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await usersIndustriesServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("industries not found", false, null));
    }

    const destroy = await usersIndustriesServices.destroy(id);

    if (destroy)
      return res.status(204).json(JParser("ok-response", true, null));
  } catch (error) {
    next(error);
  }
});

exports.user_industries = useAsync(async (req, res, next) => {
  try {
    let industries = [];
    if (req.user) {
      const { id: userId } = req.user;

      industries = await usersIndustriesServices.findAllBy({ userId });
    } else if (req.business) {
      const { id: businessId } = req.business;

      industries = await usersIndustriesServices.findAllBy({
        businessId,
      });
    }

    return res.status(200).json(JParser("ok-response", true, industries));
  } catch (error) {
    next(error);
  }
});
