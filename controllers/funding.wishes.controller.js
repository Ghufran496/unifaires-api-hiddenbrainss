const FundingWishesServices = require("../services/funding.wishes.services");
const fundingServices = require("../services/funding.services");

const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");

exports.index = useAsync(async (req, res, next) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 20;
    const offset = req.query.page ? +req.query.page : 0;

    let { count, rows } = await FundingWishesServices.all(req, offset, limit);

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

    const { fundingId } = req.body;

    const find = await fundingServices.findOne(fundingId);
    req.body.userId = userId;

    if (find) {
      const isWished = await FundingWishesServices.findBy({
        userId,
        fundingId,
      });

      if (!isWished) {
        const create = await FundingWishesServices.store(req);

        return res.status(201).json(JParser("ok-response", true, create));
      } else {
        return res.status(200).json(JParser("already exist", false, isWished));
      }
    } else
      return res
        .status(404)
        .json(JParser("funding does not exist", false, null));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const wish = await FundingWishesServices.findOne(id);

    if (wish) {
      return res
        .status(200)
        .json(JParser("wish fetched successfully", true, wish));
    } else {
      return res
        .status(404)
        .json(JParser("funding wish does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const wish = await FundingWishesServices.update(id);

    if (wish) {
      const update = await FundingWishesServices.update(id, req);

      if (update) {
        const wish = await FundingWishesServices.findOne(id);

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
    const wish = await FundingWishesServices.findOne(id);

    if (wish) {
      const removed = await FundingWishesServices.destroy(id);

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

    const { count, rows } = await FundingWishesServices.getUsersWishes(
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
