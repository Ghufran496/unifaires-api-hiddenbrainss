const userServices = require("../services/users.services"); // Import your user services
const businessServices = require("../services/business.services"); // Import your business services

async function getUserOrBusinessById(req) {
  if (req.user) {
    return await userServices.findOne(req.user.id);
  } else if (req.business) {
    return await businessServices.findOne(req.business.id);
  } else {
    return null;
  }
}
function userType(req) {
  let query = null;

  if (req.user) {
    query = { userId: req.user.id };
  } else if (req.business) {
    query = { businessId: req.business.id };
  }

  return query;
}
const USER_ROLES = {
  manager: "manager",
  contributor: "contributor",
};
module.exports = {
  getUserOrBusinessById,
  userType,
  USER_ROLES,
};
