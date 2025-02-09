const jobArchieveServices = require("../services/job.archieve.services");
const jobServices = require("../services/jobs.services");
const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");

exports.index = useAsync(async (req, res, next) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 20;
    const offset = req.query.page ? +req.query.page : 0;

    let { count, rows } = await jobArchieveServices.all(req, offset, limit);

    return res.status(200).send(
      JParser("ok-response", true, {
        archieves: rows,
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

exports.store = useAsync(async (req, res, next) => {
  try {
    // check if user have already added this jobs to archieve list

    const isJob = await jobServices.getAllJobsById(req.body.jobId);

    if (req.user) {
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business.id;
    }
    const { jobId } = req.body;

    if (isJob) {
      const isArchieve = await jobArchieveServices.findBy({ jobId });

      if (!isArchieve) {
        const create = await jobArchieveServices.store(req);

        if (create) {
          const job = await jobArchieveServices.findOne(create.id);

          return res.status(201).json(JParser("ok-response", true, job));
        }
      } else {
        return res
          .status(409)
          .json(JParser("job already archieve exist", false, isArchieve));
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
    const archieve = await jobArchieveServices.findOne(id);

    if (archieve) {
      return res.status(200).json(JParser("ok-response", true, archieve));
    } else {
      return res
        .status(404)
        .json(JParser("job archieve does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const archieve = await jobArchieveServices.update(id);

    if (archieve) {
      const update = await jobArchieveServices.update(id, req);

      if (update) {
        const archieve = await jobArchieveServices.findOne(id);

        return res
          .status(200)
          .json(JParser("archieve updated successfully", true, archieve));
      }
    } else
      return res.status(400).json(JParser("invalid archieve id", false, null));
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const archieve = await jobArchieveServices.findOne(id);

    if (archieve) {
      const removed = await jobArchieveServices.destroy(id);

      if (removed) {
        return res.status(204).json(JParser("ok-response", true, null));
      }
    } else
      return res.status(400).json(JParser("invalid archieve id", false, null));
  } catch (error) {
    next(error);
  }
});

exports.user_archieve = useAsync(async (req, res, next) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 20;
    const offset = req.query.page ? +req.query.page : 0;

    const { id: userId } = req.user;

    let { count, rows } = await jobArchieveServices.getUsersArchieves(
      req,
      offset,
      limit,
      userId
    );

    if (rows) {
      return res.status(200).send(
        JParser("ok-response", true, {
          archieves: rows,
          current_page: offset + 1,
          limit,
          count,
          pages: Math.ceil(count / limit),
        })
      );
    } else {
      return res.status(200).send(JParser("no archieve found", true, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.business_archieve = useAsync(async (req, res, next) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 20;
    const offset = req.query.page ? +req.query.page : 0;

    const { id: businessId } = req.business;

    let { count, rows } = await jobArchieveServices.getBusinessArchieves(
      req,
      offset,
      limit,
      businessId
    );

    if (rows) {
      return res.status(200).send(
        JParser("ok-response", true, {
          archieves: rows,
          current_page: offset + 1,
          limit,
          count,
          pages: Math.ceil(count / limit),
        })
      );
    } else {
      return res.status(200).send(JParser("no archieve found", true, null));
    }
  } catch (error) {
    next(error);
  }
});
