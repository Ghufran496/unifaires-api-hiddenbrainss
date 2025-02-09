const { utils, useAsync } = require("../core");
const socialsServices = require("../services/socials.services");
const { JParser } = utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await socialsServices.all();

    return res.status(200).json(JParser("ok-response", true, all));
  } catch (error) {
    next(error);
  }
});

exports.user_social = useAsync(async (req, res, next) => {
  try {
    let column;
    let value;

    if (req.user) {
      column = "userId";
      value = req.user.id;
    } else if (req.business) {
      column = "businessId";
      value = req.business.id;
    }

    const social = await socialsServices.findAllBy({ [column]: value });

    if (!social) {
      return res.status(404).json(JParser("no social found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, social));
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const socialArray = req.body;
    const userId = req.user ? req.user.id : null;
    const businessId = req.business ? req.business.id : null;

    const socialData = socialArray.map((social) => {
      if (userId) {
        return { ...social, userId };
      } else if (businessId) {
        return { ...social, businessId };
      }
    });

    const results = await Promise.all(
      socialData.map(async (social) => {
        const { name, userId, businessId } = social;
        const criteria = userId ? { userId, name } : { businessId, name };

        // Check if the record exists
        const existingSocial = await socialsServices.findBy(criteria);

        if (existingSocial) {
          // Update the existing record
          await socialsServices.update(existingSocial.id, { body: social });
          return {
            status: true,
            message: "ok-response",
            data: social,
          };
        } else {
          // Create a new record
          const createdSocial = await socialsServices.store({ body: social });
          return {
            status: true,
            message: "ok-response",
            data: createdSocial,
          };
        }
      })
    );

    return res.status(201).json(JParser("ok-response", true, results));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await socialsServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user) {
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business;
    }

    const find = await socialsServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const update = await socialsServices.update(id, req);

    if (update) {
      const find = await socialsServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await socialsServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const destroy = await socialsServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});
