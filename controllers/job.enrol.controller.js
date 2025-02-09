const jobEnrolServices = require("../services/job.enrol.services");
const { useAsync } = require("../core");
const { JParser, shuffleArray } = require("../core/core.utils");
const jobsServices = require("../services/jobs.services");
const { calculatePagination } = require("../helpers/paginate.helper");

exports.index = useAsync(async (req, res, next) => {
  try {
    // paginate the list of enrols

    const { limit, page, offset } = calculatePagination(req);

    let { count, rows } = await jobEnrolServices.all(req, offset, limit);

    return res.status(200).send(
      JParser("ok-response", true, {
        enrols: rows,
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
    const { id: userId } = req.user;
    req.body.userId = userId;

    const { jobId } = req.body;

    // check if job exist

    const isJob = await jobsServices.findOne(jobId);

    // check if user already enrol for the job
    const isEnrol = await jobEnrolServices.findBy({
      jobId,
      userId,
    });

    if (!isJob) {
      return res.status(404).json(JParser("job does not exist", false, null));
    }

    if (req.body.meta) {
      req.body.meta = JSON.stringify(req.body.meta);
    }

    if (isEnrol) {
      return res
        .status(409)
        .json(JParser("you have already enrol for this job", false, isEnrol));
    }

    const create = await jobEnrolServices.store(req);

    return res.status(201).json(JParser("ok-response", true, create));
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const findOne = await jobEnrolServices.findOne(id);

    if (findOne) {
      return res.status(200).json(JParser("ok-response", true, findOne));
    } else {
      return res.status(404).json(JParser("not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isEnrol = await jobEnrolServices.findOne(id);

    if (isEnrol) {
      if (req.body.meta) {
        req.body.meta = JSON.stringify(req.body.meta);
      }
      const update = await jobEnrolServices.update(id, req);

      if (update) {
        const isEnrol = await jobEnrolServices.findOne(id);

        return res.status(200).json(JParser("ok-response", true, isEnrol));
      }
    } else {
      return res.status(404).json(JParser("invalid enrol id", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.update_status = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isEnrol = await jobEnrolServices.findOne(id);

    if (isEnrol) {
      req.body.userId = isEnrol.userId;
      const update = await jobEnrolServices.update(id, req);

      if (update) {
        const isEnrol = await jobEnrolServices.findOne(id);

        return res.status(200).json(JParser("ok-response", true, isEnrol));
      }
    } else {
      return res.status(404).json(JParser("invalid enrol id", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isEnrol = await jobEnrolServices.findOne(id);

    if (isEnrol) {
      const destroy = await jobEnrolServices.destroy(id);

      if (destroy) {
        return res.status(204).json(JParser("ok-response", true, null));
      }
    } else {
      return res.status(404).json(JParser("enrol not found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_enrol_job = useAsync(async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const { limit, page, offset } = calculatePagination(req);

    let { count, rows } = await jobEnrolServices.findMyEnrolJobs(
      userId,
      offset,
      limit,
      req
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        enrols: rows,
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

// business jobs
exports.business_jobs_enrol = useAsync(async (req, res, next) => {
  try {
    const { limit, page, offset } = calculatePagination(req);

    const { id: businessId } = req.business;

    let { count, rows } = await jobEnrolServices.findUserJobs(
      businessId,
      offset,
      limit,
      req
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        enrols: rows,
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

// user job
exports.user_jobs_enrol = useAsync(async (req, res, next) => {
  try {
    const { limit, page, offset } = calculatePagination(req);

    const { id: userId } = req.user;

    let { count, rows } = await jobEnrolServices.findUserJobs(
      userId,
      offset,
      limit,
      req
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        enrols: rows,
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
