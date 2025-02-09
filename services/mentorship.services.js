const { Mentorship } = require("../models");
const skillsServices = require("./skills.services");
const { Op } = require("sequelize");

function generateFilterValue(query) {
  let filterValue = {
    [Op.or]: [],
  };

  for (let key in query) {
    if (key !== "offset" && key !== "limit") {
      if (Mentorship.getAttributes()[key] !== undefined) {
        if (Array.isArray(query[key])) {
          // If the query parameter is an array, use Op.or to filter for any of the values
          filterValue[Op.or].push({
            [key]: {
              [Op.or]: query[key].map((value) => ({
                [Op.like]: `%{value}%`,
              })),
            },
          });
        } else {
          // If the query parameter is a single value, filter normally
          filterValue[Op.or].push({
            [key]: {
              [Op.like]: `%${query[key]}%`,
            },
          });
        }
      }
    }
  }

  // Add the logic to combine firstname and lastname filters
  let nameFilters = [];
  if (query.firstname) {
    nameFilters.push({
      firstname: {
        [Op.like]: `%${query.firstname}%`,
      },
    });
  }
  if (query.lastname) {
    nameFilters.push({
      lastname: {
        [Op.like]: `%${query.lastname}%`,
      },
    });
  }
  if (nameFilters.length > 0) {
    filterValue[Op.or].push(...nameFilters);
  }

  // If the Op.or array is empty, remove it to avoid unnecessary filtering
  if (filterValue[Op.or].length === 0) {
    delete filterValue[Op.or];
  }

  return filterValue;
}

class MentorshipServices {
  async all(req, offset, limit) {
    let filterValue = generateFilterValue(req.query);

    const mentorships = await Mentorship.findAndCountAll({
      distinct: true,
      where: { ...filterValue },
      offset,
      limit,
    });

    for (let mentorship of mentorships.rows) {
      const skillsArray = JSON.parse(mentorship.skills);

      let skills = [];

      // Fetch the skills
      for (const skill of skillsArray) {
        const find = await skillsServices.findOne(skill);

        if (find) skills.push(find);
      }

      mentorship.skills = skills;
    }

    return mentorships;
  }

  async findOne(id) {
    let skills = [];
    let result = await Mentorship.findOne({ where: { id } });
    let skillsArray = JSON.parse(result.skills);
    skillsArray = Array.isArray(skillsArray) ? skillsArray : [];
    for (const skill of skillsArray) {
      const find = await skillsServices.findOne(skill);

      if (find) skills.push(find);
    }
    result.skills = skills;

    return result;
  }

  async findIds(ids) {
    return await Mentorship.findAll({ where: { id: ids } });
  }

  async findBy(by) {
    return await Mentorship.findOne({ where: by });
  }

  async findAllBy(by) {
    return await Mentorship.findAll({ where: by });
  }

  async store(req) {
    return await Mentorship.create(req.body);
  }

  async update(id, req) {
    return await Mentorship.update(req.body, { where: { id } });
  }

  async destroy(id) {
    return await Mentorship.destroy({ where: { id } });
  }

  async bulkDestroy(ids) {
    return await Mentorship.destroy({ where: { id: ids } });
  }
}

module.exports = new MentorshipServices();
