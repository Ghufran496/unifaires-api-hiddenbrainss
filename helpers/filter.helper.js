const { Op } = require("sequelize");

function generateFilterQuery(req, Model) {
  const { query } = req;
  let filterValue = {};

  for (let key in query) {
    if (key !== "offset" && key !== "limit") {
      if (!!Model.getAttributes()[key]) {
        if (Array.isArray(query[key])) {
          filterValue[key] = {
            [Op.or]: query[key].map((value) => ({
              [Op.like]: `%${value}%`,
            })),
          };
        } else {
          filterValue[key] = {
            [Op.like]: `%${query[key]}%`,
          };
        }
      }
    }
  }

  return filterValue;
}

module.exports = {
  generateFilterQuery,
};
