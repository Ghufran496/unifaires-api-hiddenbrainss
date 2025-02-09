const { utils, useAsync } = require("../core");
const professionalCertificateServices = require("../services/professional.certificate.services");

const { JParser } = utils;

exports.index = useAsync(async (req, res, next) => {
  try {
    const all = await professionalCertificateServices.all();

    if (all) {
      return res
        .status(200)
        .json(JParser("profession fetch successfully", true, all));
    }
  } catch (error) {
    next(error);
  }
});

exports.user_profession = useAsync(async (req, res, next) => {
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

    const profession = await professionalCertificateServices.findAllBy({
      [column]: value,
    });

    if (profession) {
      return res
        .status(200)
        .json(JParser("profession retrieved successfully", true, profession));
    } else {
      return res.status(404).json(JParser("No profession found", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.store = useAsync(async (req, res, next) => {
  try {
    if (req.user) {
      const { id: userId } = req.user;
      req.body.userId = userId;

      req.body = req.body.map((body) => ({ ...body, userId }));
    } else if (req.business) {
      const { id: businessId } = req.business;
      req.body.businessId = businessId;

      req.body = req.body.map((body) => ({ ...body, businessId }));
    }

    const create = await professionalCertificateServices.store(req);

    if (create) {
      return res
        .status(200)
        .json(JParser("profession added successfully", true, create));
    }
  } catch (error) {
    next(error);
  }
});

exports.get_by_id = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await professionalCertificateServices.findOne(id);

    if (find) {
      return res
        .status(200)
        .json(JParser("profession fetch successfully", true, find));
    } else {
      return res
        .status(404)
        .json(JParser("profession doest not exist", false, null));
    }
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

    const find = await professionalCertificateServices.findOne(id);

    if (find) {
      const update = await professionalCertificateServices.update(id, req);

      if (update) {
        const find = await professionalCertificateServices.findOne(id);

        return res
          .status(200)
          .json(JParser("profession fetch successfully", true, find));
      }
    } else {
      return res
        .status(404)
        .json(JParser("profession doest not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});

exports.destroy = useAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const find = await professionalCertificateServices.findOne(id);

    if (find) {
      const destroy = await professionalCertificateServices.destroy(id);

      if (destroy) {
        return res
          .status(204)
          .json(JParser("profession deleted successfully", true, null));
      }
    } else {
      return res
        .status(404)
        .json(JParser("profession doest not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
});
