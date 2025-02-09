const voucherServices = require("../services/voucher.services");
const businessServices = require("../services/business.services");

const { JParser } = require("../core/core.utils");

exports.index = async (req, res, next) => {
  try {
    const vouchers = await voucherServices.getAllVoucher();

    if (vouchers) {
      return res.status(200).json(JParser("success", true, vouchers));
    }
  } catch (error) {
    next(error);
  }
};

exports.store = async (req, res, next) => {
  try {
    const { voucher, businessId } = req.body;
    // check if voucher already exist
    const isVoucher = await voucherServices.getVoucherByVoucher(voucher);

    if (!isVoucher) {
      // verify the business
      const isBusiness = await businessServices.getBusinessById(businessId);

      if (isBusiness) {
        const voucher = await voucherServices.storeVoucher(req);

        if (voucher) {
          return res
            .status(201)
            .json(JParser("voucher created successfully", true, voucher));
        }
      } else {
        return res
          .status(400)
          .json(JParser("business does not exist", false, null));
      }
    } else {
      return res
        .status(400)
        .json(JParser("voucher already exist", false, null));
    }
  } catch (error) {
    next(error);
  }
};

exports.get_by_id = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isVoucher = await voucherServices.getAllVoucherById(id);

    if (isVoucher) {
      return res
        .status(200)
        .json(JParser("voucher fetch successfully", true, isVoucher));
    } else {
      return res
        .status(400)
        .json(JParser("voucher does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isVoucher = await voucherServices.getAllVoucherById(id);

    if (isVoucher) {
      const updateVoucher = await voucherServices.updateVoucher(id, req);

      if (updateVoucher) {
        const voucher = await voucherServices.getAllVoucherById(id);

        return res
          .status(200)
          .json(JParser("voucher updated successfully", true, voucher));
      }
    } else {
      return res
        .status(400)
        .json(JParser("voucher does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isVoucher = await voucherServices.getAllVoucherById(id);

    if (isVoucher) {
      const deleteVoucher = await voucherServices.deleteVoucher(id);

      if (deleteVoucher) {
        return res
          .status(204)
          .json(JParser("voucher deleted successfully", true, null));
      }
    } else {
      return res
        .status(404)
        .json(JParser("voucher does not exist on the system", false, null));
    }
  } catch (error) {
    next(error);
  }
};

exports.get_all_business_voucher = async (req, res, next) => {
  try {
    const { businessId } = req.params;

    const isBusiness = await voucherServices.getAllVoucherById(businessId);

    if (isBusiness) {
      const vouchers = await voucherServices.getBusinessVouchers(businessId);

      return res.status(200).json(JParser("voucher fetched", true, vouchers));
    } else {
      return res
        .status(404)
        .json(JParser("business does not exist", false, null));
    }
  } catch (error) {
    next(error);
  }
};
