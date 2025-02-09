const { useAsync } = require("../../core");
const { JParser } = require("../../core/core.utils");
const jobsServices = require("../../services/jobs.services");
const jobCategoryServices = require("../../services/job.category.services");
const { calculatePagination } = require("../../helpers/paginate.helper");
const sendgridServices = require("../../services/sendgrid.services");

exports.admin_jobs = useAsync(async (req, res, next) => {
  try {
    const { limit, page, offset } = calculatePagination(req);

    let { count, rows } = await jobsServices.getAllUserJobs(req, offset, limit);

    return res.status(200).send(
      JParser("ok-response", true, {
        jobs: rows,
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

exports.business_jobs = useAsync(async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const isJob = await jobsServices.findOne(jobId);

    if (!isJob) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const { limit, page, offset } = calculatePagination(req);

    let { count, rows } = await jobsServices.getAllBusinessJobs(
      req,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        jobs: rows,
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

// jobs applicants
exports.admin_jobs_applicants = useAsync(async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const isJob = await jobsServices.findOne(jobId);

    if (!isJob) {
      return res.status(404).json(JParser("not found", false, null));
    }

    const { limit, page, offset } = calculatePagination(req);

    let { count, rows } = await jobsServices.getAllUserApplicants(
      req,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        jobs: rows,
        currentPage: page,
        limit,
        count,
        pages: Math.ceil(count / limit),
      })
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
});

exports.business_jobs_applicants = useAsync(async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const { limit, page, offset } = calculatePagination(req);

    let { count, rows } = await jobsServices.getAllBusinessApplicants(
      req,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        jobs: rows,
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
    if (req.user) {
      req.body.userId = req.user.id;
    } else if (req.business) {
      req.body.businessId = req.business.id;
    }

    if (req.body.contact) {
      req.body.contact = JSON.stringify(req.body.contact);
    }

    // check the job category

    const { jobcategoryId } = req.body;

    const isCategory = await jobCategoryServices.getfindJobCatOne(
      jobcategoryId
    );
    const find = await jobCategoryServices.getfindJobCatOne(jobcategoryId);

    if (!isCategory) {
      return res.status(400).json(JParser("invalid category id", false, null));
    }

    const create = await jobsServices.storeJobs(req);

    if (create) {
      return res
        .status(200)
        .send(JParser("jobs created successfully", true, create));
    } else {
      return res.status(400).send(JParser("something went wrong", true, []));
    }
  } catch (error) {
    next(error);
  }
});

exports.business_update = useAsync(async (req, res, next) => {
  try {
    // check if job exist
    const { id } = req.params;
    const isJob = await jobsServices.findOne(id);

    req.body.businessId = req.business.id;

    if (isJob) {
      if (req.body.contact) {
        req.body.contact = JSON.stringify(req.body.contact);
      }
      // update the job
      const update = await jobsServices.update(id, req);

      if (update) {
        // get the jobs again and send
        const job = await jobsServices.findOne(id);

        return res.status(200).json(JParser("ok-response", true, job));
      } else {
        return res.status(400).send("something went wrong", false, null);
      }
    } else {
      return res.status(404).send(JParser("job does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.admin_update = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    let isApproveItem = false;
    const isJob = await jobsServices.getAllJobsById(id);
    if (!(typeof isJob?.id === "string" && isJob.id.trim() !== "")) {
      return res.status(404).send(JParser("job does not exist", false, null));
    }
    const { id: userId } = req.user;

    if (req.body.contact) {
      req.body.contact = JSON.stringify(req.body.contact);
    }
    if (
      typeof req?.body?.status === "string" &&
      req.body.status.toLowerCase().trim() === "approve"
    ) {
      req.body.status = "opened";
      req.body.approveUserId = req.body.userId;
      req.body.approvedAt = new Date();
      isApproveItem = true;
    }
    delete req.body.userId;
    delete req.body.contact;
    const update = await jobsServices.updateJobs(id, req);

    if (update) {
      const job = await jobsServices.getAllJobsById(id);
      if (isApproveItem) {
        sendgridServices.sendApproveEmail(job);
      }

      return res
        .status(200)
        .json(JParser("job updated successfully", true, job));
    } else {
      return res.status(400).send("something went wrong", false, null);
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const isJob = await jobsServices.getAllJobsById(id);

    if (isJob) {
      // update the job
      const deleted = await jobsServices.deleteJobs(id);

      if (deleted) {
        return res
          .status(204)
          .json(JParser("jobs deleted successfully", true, null));
      }
    } else {
      return res.status(404).send(JParser("job does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});
