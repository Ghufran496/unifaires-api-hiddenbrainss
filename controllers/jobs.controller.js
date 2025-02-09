const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const jobsServices = require("../services/jobs.services");
const jobCategoryServices = require("../services/job.category.services");
const { calculatePagination } = require("../helpers/paginate.helper");
const jobSkillsServices = require("../services/job.skills.services");
const { USER_ROLES } = require("../helpers/user.helper");
const sendGridServices = require("../services/sendgrid.services");

exports.index = useAsync(async (req, res, next) => {
  try {
    const { limit, offset, page } = calculatePagination(req);

    // Fetch category by jobcategoryId ravi chauhan
    const categoryId = req.query.jobcategoryId;
    let category = null;
    if (categoryId) {
      category = await jobCategoryServices.findFilter(req);
    }

    let { count, rows } = await jobsServices.all(req, offset, limit);

    return res.status(200).send(
      JParser("ok-response", true, {
        category: category || {}, // Add the category object here
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

exports.admin = useAsync(async (req, res, next) => {
  try {
    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await jobsServices.all(req, offset, limit);

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

exports.admin_jobs = useAsync(async (req, res, next) => {
  try {
    const { limit, offset, page } = calculatePagination(req);

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
    const { limit, offset, page } = calculatePagination(req);

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
    const { limit, offset, page } = calculatePagination(req);

    const { jobId: id } = req.params;

    // validate the job

    const isJob = await jobsServices.findOne(id);

    if (!isJob) {
      return res.status(404).json(JParser("job not found", false, null));
    }

    let { count, rows } = await jobsServices.getAllUserApplicants(
      req,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        applicants: rows,
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

exports.business_jobs_applicants = useAsync(async (req, res, next) => {
  try {
    const { jobId: id } = req.params;

    // validate the job

    const isJob = await jobsServices.findOne(id);

    if (!isJob) {
      return res.status(404).json(JParser("job not found", false, null));
    }

    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await jobsServices.getAllBusinessApplicants(
      req,
      offset,
      limit
    );

    return res.status(200).send(
      JParser("ok-response", true, {
        applicants: rows,
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
    const { skills } = req.body;
    let roleName = "";
    if (
      typeof req?.user?.roleName === "string" &&
      req.user.roleName.trim() !== ""
    ) {
      roleName = req.user.roleName.toLowerCase().trim();
    } else if (
      typeof req?.business?.roleName === "string" &&
      req.business.roleName.trim() !== ""
    ) {
      roleName = req.business.roleName.toLowerCase().trim();
    }

    if (req?.user?.id) {
      req.body.userId = req.user.id;
    } else if (req?.business?.id) {
      req.body.businessId = req.business.id;
    }

    if (req?.body?.contact) {
      req.body.contact = JSON.stringify(req.body.contact);
    }

    // check the job category

    const { jobcategoryId } = req.body;

    const isCategory = await jobCategoryServices.getfindJobCatOne(
      jobcategoryId
    );

    if (!isCategory) {
      return res.status(400).json(JParser("invalid category id", false, null));
    }

    if (roleName === USER_ROLES.contributor) {
      req.body.status = "pending";
    }

    const create = await jobsServices.store(req);

    if (create) {
      // create the skills

      const skillsData = skills.map((skill) => ({
        skillId: skill,
        jobId: create.id,
      }));

      const createJobSkills = await jobSkillsServices.bulkStore(skillsData);

      // find the job
      if (createJobSkills) {
        const find = await jobsServices.findOne(create.id);
        return res.status(201).send(JParser("ok-response", true, find));
      }
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await jobsServices.findOne(id);

    if (!job) {
      return res.status(404).send(JParser("job does not exist", false, null));
    }

    return res.status(200).send(JParser("ok-response", true, job));
  } catch (error) {
    next(error);
  }
});

exports.get_by_slug = useAsync(async (req, res, next) => {
  try {
    const { slug } = req.params;

    const job = await jobsServices.findBy({ slug });

    if (!job) {
      return res.status(404).send(JParser("job does not exist", false, null));
    }

    return res.status(200).send(JParser("ok-response", true, job));
  } catch (error) {
    next(error);
  }
});

exports.business_update = useAsync(async (req, res, next) => {
  try {
    // check if job exist
    const { id } = req.params;
    const { skills } = req.body;

    const find = await jobsServices.findOne(id);

    req.body.businessId = req.business.id;

    if (!find) {
      return res.status(404).send(JParser("not found", false, null));
    }

    if (req?.body?.contact) {
      delete req.body.contact;
    }

    // update skills if skills exist

    if (skills && skills.length > 0) {
      // remove the skills on this course
      await jobSkillsServices.destroyBy({
        jobId: find.id,
      });
      // add this one to it

      const bulkSkillsData = skills.map((skill) => {
        return {
          skillId: skill,
          jobId: find.id,
        };
      });

      await jobSkillsServices.bulkStore(bulkSkillsData);
    }
    delete req.body.businessId;

    // update the job
    const update = await jobsServices.update(id, req);

    if (update) {
      // get the jobs again and send
      const job = await jobsServices.findOne(id);

      return res.status(200).json(JParser("ok-response", true, job));
    } else {
      return res.status(400).send("something went wrong", false, null);
    }
  } catch (error) {
    next(error);
  }
});

exports.admin_update = useAsync(async (req, res, next) => {
  try {
    // check if job exist
    const { id } = req.params;
    const { id: userId } = req.user;
    const { skills } = req.body;
    let isApproveItem = false;

    req.body.userId = userId;

    const find = await jobsServices.findOne(id);

    if (!find) {
      return res.status(404).send(JParser("job not found", false, null));
    }

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

    if (skills && skills.length > 0) {
      // remove the skills on this course
      await jobSkillsServices.destroyBy({
        jobId: find.id,
      });
      // add this one to it

      const bulkSkillsData = skills.map((skill) => {
        return {
          skillId: skill,
          jobId: find.id,
        };
      });

      await jobSkillsServices.bulkStore(bulkSkillsData);
    }

    const update = await jobsServices.update(id, req);

    if (update) {
      const job = await jobsServices.findOne(id);
      if (isApproveItem) {
        sendGridServices.sendApproveEmail(job);
      }

      return res.status(200).json(JParser("ok-response", true, job));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isJob = await jobsServices.findOne(id);

    if (!isJob) {
      return res.status(404).send(JParser("job does not exist", false, null));
    }

    // delete the job
    const destroy = await jobsServices.destroy(id);

    if (destroy) {
      return res.status(204).json(JParser("ok-response", true, null));
    }
  } catch (error) {
    next(error);
  }
});

/* skills gap */
exports.skills_jobs = useAsync(async function (req, res, next) {
  try {
    // check for filter

    const { skills } = req.body;

    const { limit, offset, page } = calculatePagination(req);

    let { count, rows } = await jobsServices.skillsJobs(
      req,
      skills,
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

exports.job_attributes_filter = useAsync(async (req, res, next) => {
  try {
    const find = await jobsServices.getAllDistinctAttributes();

    return res.status(200).json(JParser("ok-response", true, find));
  } catch (error) {
    next(error);
  }
});
