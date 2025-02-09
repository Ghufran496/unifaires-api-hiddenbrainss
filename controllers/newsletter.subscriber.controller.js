const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const { calculatePagination } = require("../helpers/paginate.helper");
const newsletterSubscriberServices = require("../services/newsletter.subscriber.services");
const newsletterSubscriptionServices = require("../services/newsletter.subscription.services");
const newsletterTypeServices = require("../services/newsletter.type.services");
const Papa = require("papaparse");

exports.index = useAsync(async (req, res, next) => {
  try {
    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await newsletterSubscriberServices.all(
      req,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        subscribers: rows,
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
    const { newsletterTypeIds, email } = req.body;

    const isEmail = await newsletterSubscriberServices.findBy({ email });

    if (isEmail) {
      return res.status(409).json(JParser("already subscribe", false, null));
    }

    // Create the subscriber
    const create = await newsletterSubscriberServices.store(req);

    if (create) {
      if (newsletterTypeIds && newsletterTypeIds.length > 0) {
        // Fetch all newsletter types in a single query
        const validNewsletterTypes = await newsletterTypeServices.findAllBy({
          id: newsletterTypeIds,
        });

        // Filter out only valid newsletterTypeIds
        const validNewsletterTypeIds = validNewsletterTypes.map((nt) => nt.id);

        const subscriptionData = validNewsletterTypeIds.map((id) => ({
          subscriberId: create.id,
          newsletterTypeId: id,
        }));

        // Perform bulk creation of subscriptions
        if (subscriptionData.length > 0) {
          await newsletterSubscriptionServices.bulkStore(subscriptionData);
        }
      }

      return res.status(201).json(JParser("ok-response", true, create));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await newsletterSubscriberServices.findBy({ id });

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await newsletterSubscriberServices.findBy({ id });

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const update = await newsletterSubscriberServices.update(id, req);

    if (update) {
      const find = await newsletterSubscriberServices.findBy({ id });

      return res.status(200).json(JParser("ok-response", true, find));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await newsletterSubscriberServices.findBy({ id });

    if (!find) {
      return res.status(404).json(JParser("not found", false, null));
    }

    // destroy

    const destroy = await newsletterSubscriberServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.exportNewsletter = useAsync(async (req, res, next) => {
  try {
    let rows = await newsletterSubscriberServices.exportAll();
    if (!(!Number.isNaN(rows) && rows.length > 0)) {
      return res.status(404).json(JParser("No records", false, null));
    }
    rows = rows.map((itemObj) => {
      return { email: itemObj?.email };
    });
    const csv = Papa.unparse(rows);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=data.csv");
    res.send(csv);
  } catch (error) {
    next(error);
  }
});
