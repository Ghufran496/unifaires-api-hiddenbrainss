const jobWishServices = require("../services/job.wish.services");
const jobServices = require("../services/jobs.services");
const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");

exports.index = useAsync(async (req, res, next) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 20;
    const offset = req.query.page ? +req.query.page : 0;

    let { count, rows } = await jobWishServices.all(req, offset, limit);

    if (rows) {
      return res.status(200).send(
        JParser("ok-response", true, {
          wishes: rows,
          current_page: offset + 1,
          limit,
          count,
          pages: Math.ceil(count / limit),
        })
      );
    } else {
      return res
        .status(200)
        .send(JParser("no registered wish on the system", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    // check if user have already added this jobs to wish list
    const { id: userId } = req.user;

    const { jobId } = req.body;

    const find = await jobServices.findOne(jobId);
    req.body.userId = userId;

    if (find) {
      const isWished = await jobWishServices.findBy({
        userId,
        jobId,
      });

      if (!isWished) {
        const create = await jobWishServices.store(req);

        return res.status(201).json(JParser("ok-response", true, create));
      } else {
        return res.status(200).json(JParser("already exist", false, isWished));
      }
    } else
      return res.status(404).json(JParser("job does not exist", false, null));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const wish = await jobWishServices.findOne(id);

    if (wish) {
      return res
        .status(200)
        .json(JParser("wish fetched successfully", true, wish));
    } else {
      return res
        .status(404)
        .json(JParser("job wish does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const wish = await jobWishServices.update(id);

    if (wish) {
      const update = await jobWishServices.update(id, req);

      if (update) {
        const wish = await jobWishServices.findOne(id);

        return res
          .status(200)
          .json(JParser("wish updated successfully", true, wish));
      }
    } else return res.status(400).json(JParser("invalid wish id", false, null));
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const wish = await jobWishServices.findOne(id);

    if (wish) {
      const removed = await jobWishServices.destroy(id);

      if (removed) {
        return res
          .status(204)
          .json(JParser("wish deleted successfully", true, null));
      }
    } else return res.status(400).json(JParser("invalid wish id", false, null));
  } catch (error) {
    next(error);
  }
});

exports.user_wish = useAsync(async (req, res, next) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 20;
    const offset = req.query.page ? +req.query.page : 0;

    const userId = req.user.id;
    req.body.userId = userId;

    const { count, rows } = await jobWishServices.getUsersWishes(
      req,
      offset,
      limit,
      userId
    );

    return res.status(200).send(
      JParser("ok-respose", true, {
        wishes: rows,
        current_page: offset + 1,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    next(error);
  }
});
