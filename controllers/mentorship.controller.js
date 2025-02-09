const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const { calculatePagination } = require("../helpers/paginate.helper");

const mentorshipServices = require("../services/mentorship.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await mentorshipServices.all(req, offset, limit);

    return res.status(200).send(
      JParser("ok-response", true, {
        mentorship: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    const { email } = req.body;

    if (req.user) {
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business.id;
    }

    // check if user already submit a mentorship
    const find = await mentorshipServices.findBy({ email });

    if (find) {
      return res
        .status(409)
        .json(
          JParser(
            "you have already submit a mentorship application",
            false,
            null
          )
        );
    }

    // submit the mentoship application
    const create = await mentorshipServices.store(req);

    if (create) {
      return res.status(201).json(JParser("ok-response", true, create));
    }
  } catch (error) {
    next(error);
  }
});
exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await mentorshipServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found!", false, null));
    }

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  console.log("I got into this processing pipeline....")
  try {
    const { id } = req.params;

    const find = await mentorshipServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found!", false, null));
    }

    const update = await mentorshipServices.update(id, req);

    if (update) {
      const find = await mentorshipServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.body;

    const find = await mentorshipServices.findOne(id);

    if (!find) {
      return res.status(404).json(JParser("not found!", false, null));
    }

    const destroy = await mentorshipServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.bulk_delete = useAsync(async (req, res, next) => {
  try {
    const { ids } = req.body;

    const validIds = await mentorshipServices.findIds(ids);

    const validIdsArray = validIds.map((id) => id.id);

    const invalidIds = ids.filter((id) => !validIdsArray.includes(id));

    if (invalidIds.length) {
      return res.status(400).json(JParser("invalid ids", false, null));
    }

    const destroy = await mentorshipServices.bulkDestroy(ids);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});
