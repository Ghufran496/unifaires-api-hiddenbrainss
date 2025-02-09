function calculatePagination(req) {
  const limit = +req.query.limit || 10;
  const page = +req.query.page || 1;

  let offset = 0;
  if (limit && page) {
    offset = (page - 1) * limit;
  }

  return { limit, offset, page };
}

module.exports = { calculatePagination };
