const { Voucher } = require("../models");

class VoucherServices {
  async getAllVoucher() {
    return await Voucher.findAll();
  }
  async getAllVoucherById(id) {
    return await Voucher.findOne({ where: { id } });
  }
  async storeVoucher(req) {
    return await Voucher.create(req.body);
  }
  async updateVoucher(id, req) {
    return await Voucher.update(req.body, { where: { id } });
  }
  async deleteVoucher(id) {
    return await Voucher.destroy({ where: { id } });
  }

  // voucher exist

  async getVoucherByVoucher(voucher) {
    return await Voucher.findOne({ where: { voucher } });
  }

  async getBusinessVouchers(businessId) {
    return await Voucher.findAll({ where: { businessId } });
  }
}

module.exports = new VoucherServices();
